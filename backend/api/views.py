from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Course, Major
from .serializer import CourseSerializer, MajorSerializer
from .prolog_engine import get_recommendations


@api_view(['GET'])
def get_majors(request):
    majors = Major.objects.all()
    serializer = MajorSerializer(majors, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_courses(request):
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def recommend_prolog(request):
    """
    Stateless Prolog recommendation.

    Expected request body:
    {
        "liked_courses": ["Algorithms", "Databases"],
        "completed_courses": ["Intro Programming", "Data Structures"],
        "preferred_difficulty": "hard",   // optional, defaults to "medium"
        "major": "Computer Science"        // optional
    }
    Returns: { "recommendations": [...course names...] }
    """
    liked = request.data.get('liked_courses', [])
    completed = request.data.get('completed_courses', [])
    preferred = request.data.get('preferred_difficulty', 'medium')
    major = request.data.get('major', None)

    recommendations = get_recommendations(liked, completed, preferred, major)
    return Response({'recommendations': recommendations})


@api_view(['POST'])
def recommend_ai(request):
    """
    Stateless AI recommendation.

    Expected request body:
    {
        "liked_courses": ["Algorithms", "Databases"],
        "completed_courses": ["Intro Programming", "Data Structures"],
        "preferred_difficulty": "hard",
        "major": "Computer Science"
    }
    Returns: { "recommendations": [...course names...] }
    """
    # Gemini wiring goes here.
    return Response({'recommendations': []}, status=status.HTTP_200_OK)
