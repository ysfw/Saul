import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Course, Major
from .serializer import CourseSerializer, MajorSerializer
from .prolog_engine import get_recommendations
from .ai_is_calling import get_ai_recommended_courses
from google import genai
from google.genai import types

import os
from dotenv import load_dotenv

from django.conf import settings



@api_view(['GET'])
def get_majors(request):
    majors = Major.objects.all()
    serializer = MajorSerializer(majors, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_courses(request):
    major_name = request.query_params.get('major', None)
    if not major_name:
        return Response({"error": "major query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        major = Major.objects.get(name=major_name)
    except Major.DoesNotExist:
        return Response({"error": f"Major '{major_name}' not found"}, status=status.HTTP_404_NOT_FOUND)

    courses = Course.objects.filter(majors=major).values_list('name', flat=True)
    return Response(list(courses))


@api_view(['POST'])
def recommend_prolog(request):
    """
    Stateless Prolog recommendation.

    Expected request body:
    {
        "liked_topics": ["Algorithms", "Databases"],
        "completed_courses": ["Intro Programming", "Data Structures"],
        "preferred_difficulty": "hard",   // optional, defaults to "medium"
        "major": "Computer Science"        // optional
    }
    Returns: { "recommendations": [...course names...] }
    """
    liked = request.data.get('liked_topics', [])
    completed = request.data.get('completed_courses', [])
    preferred = request.data.get('preferred_difficulty', 'medium')
    major = request.data.get('major', None)

    recommendations = get_recommendations(liked, completed, preferred, major)
    return Response({'recommendations': recommendations})


@api_view(['POST'])
def recommend_ai(request):
   major= request.data.get('major', "")
   if not major:
       return Response({"error": "major is required"}, status=status.HTTP_400_BAD_REQUEST)

   try:
       data = get_ai_recommended_courses(request)
       return Response(data, status=status.HTTP_200_OK)

   except json.JSONDecodeError:
       return Response({"error": "AI returned invalid JSON"}, status=500)

   except Exception as e:
       return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




