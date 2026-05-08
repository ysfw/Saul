from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Course, Major
from .serializer import CourseSerializer, MajorSerializer
from .prolog_engine import get_recommendations
import google.generativeai as genai

import os
from dotenv import load_dotenv

from ..backend import settings


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
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model= genai.GenerativeModel("gemini-1.5-flash")
    #we need to extract data and do prompt
    liked_courses=request.data.get('liked_courses', [])
    completed_courses=request.data.get('completed_courses', [])
    preferred_difficulty = request.data.get('preferred_difficulty',"")
    major = request.data.get('major', "")
    prerequisites=None
    prompt=f""""
    I am a {major} student.
        I liked these courses: {', '.join(liked_courses)}.
        I have completed: {', '.join(completed_courses)}.
        I prefer {preferred_difficulty} difficulty.
        Note the my university prerequisites in this major are: {prerequisites}
        Recommend me new courses to take.
        """

    response=model.generate_content(prompt)
    return Response({'recommendations': response.text}, status=status.HTTP_200_OK)


    """
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
