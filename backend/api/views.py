import json

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .models import Course, Major, StudentProfile
from .serializer import (
    CourseSerializer, MajorSerializer, CourseMinimalSerializer,
    StudentProfileSerializer, RegisterSerializer, LoginSerializer,
)
from .prolog_engine import get_recommendations
from .ai_is_calling import get_ai_recommended_courses

import os
from dotenv import load_dotenv
from django.conf import settings


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Create a new user account and return an auth token."""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        profile = user.profile
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'major': profile.major.name if profile.major else None,
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Authenticate and return an auth token."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password'],
        )
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            # Ensure profile exists (for users created before the profile model)
            profile, _ = StudentProfile.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'major': profile.major.name if profile.major else None,
                }
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    """GET: return profile.  PATCH: update major."""
    prof, _ = StudentProfile.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        serializer = StudentProfileSerializer(prof)
        return Response(serializer.data)

    # PATCH — update major
    major_name = request.data.get('major')
    if major_name is not None:
        try:
            major = Major.objects.get(name__iexact=major_name)
            prof.major = major
            prof.save()
        except Major.DoesNotExist:
            return Response({'error': f"Major '{major_name}' not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = StudentProfileSerializer(prof)
    return Response(serializer.data)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def profile_courses(request):
    """
    POST: add courses to completed list.  Body: {"course_names": ["math1", "physics1"]}
    DELETE: remove courses from completed list.  Body: {"course_names": ["math1"]}
    """
    prof, _ = StudentProfile.objects.get_or_create(user=request.user)
    course_names = request.data.get('course_names', [])

    if not course_names:
        return Response({'error': 'course_names is required'}, status=status.HTTP_400_BAD_REQUEST)

    courses = Course.objects.filter(name__in=course_names)
    found_names = set(courses.values_list('name', flat=True))
    missing = set(course_names) - found_names

    if request.method == 'POST':
        prof.completed_courses.add(*courses)
        msg = 'Courses added'
    else:
        prof.completed_courses.remove(*courses)
        msg = 'Courses removed'

    result = {
        'message': msg,
        'updated_courses': list(prof.completed_courses.values_list('name', flat=True)),
    }
    if missing:
        result['warnings'] = [f"Course '{n}' not found" for n in missing]

    return Response(result)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_majors(request):
    majors = Major.objects.all()
    serializer = MajorSerializer(majors, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_courses(request):
    major_name = request.query_params.get('major', None)
    if not major_name:
        return Response({"error": "major query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        major = Major.objects.get(name=major_name)
    except Major.DoesNotExist:
        return Response({"error": f"Major '{major_name}' not found"}, status=status.HTTP_404_NOT_FOUND)

    courses = Course.objects.filter(majors=major)
    serializer = CourseMinimalSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def recommend_prolog(request):
    """
    Prolog recommendation.  Supports both guest and authenticated modes.

    If authenticated: completed_courses and major are read from the user's profile
    (but can be overridden by the request body).

    Expected request body:
    {
        "liked_topics": ["mathematics", "algorithms"],
        "completed_courses": ["math1", "math2"],     // optional if authenticated
        "preferred_difficulty": "hard",               // optional, defaults to "medium"
        "major": "computer_and_systems"               // optional if authenticated
    }
    """
    liked_topics = request.data.get('liked_topics', [])
    preferred = request.data.get('preferred_difficulty', 'medium')

    # Resolve completed_courses and major — prefer request body, fall back to profile
    completed = request.data.get('completed_courses', None)
    major = request.data.get('major', None)

    if request.user.is_authenticated:
        prof, _ = StudentProfile.objects.get_or_create(user=request.user)
        if completed is None:
            completed = list(prof.completed_courses.values_list('name', flat=True))
        if major is None and prof.major:
            major = prof.major.name

    completed = completed or []

    recommendations = get_recommendations(liked_topics, completed, preferred, major)
    return Response({'recommendations': recommendations})


@api_view(['POST'])
@permission_classes([AllowAny])
def recommend_ai(request):
    """AI recommendation.  Supports both guest and authenticated modes."""
    major = request.data.get('major', None)

    if request.user.is_authenticated and not major:
        prof, _ = StudentProfile.objects.get_or_create(user=request.user)
        if prof.major:
            major = prof.major.name

    if not major:
        return Response({"error": "major is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Inject major back into request data for ai_is_calling
    request.data['major'] = major

    if request.user.is_authenticated:
        prof, _ = StudentProfile.objects.get_or_create(user=request.user)
        if 'completed_courses' not in request.data or not request.data['completed_courses']:
            request.data['completed_courses'] = list(
                prof.completed_courses.values_list('name', flat=True)
            )

    try:
        data = get_ai_recommended_courses(request)
        return Response(data, status=status.HTTP_200_OK)
    except json.JSONDecodeError:
        return Response({"error": "AI returned invalid JSON"}, status=500)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
