from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Course, Major
from .serializer import CourseSerializer, MajorSerializer
from .prolog_engine import get_recommendations
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

    #we need to extract data and do prompt
    liked_courses=request.data.get('liked_courses', [])
    completed_courses=request.data.get('completed_courses', [])
    preferred_difficulty = request.data.get('preferred_difficulty',"")
    major = request.data.get('major', "")
    prerequisites=None
    if not major:
        return Response(
            {"error": "major is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
        # I configured it setting.py so whenever you call do it from there
        client= genai.Client(api_key=settings.GEMINI_API_KEY)

        #Building the prompt and note this func doesnt save context
        prompt = f""""
            I am a {major} student.
                I liked these courses: {', '.join(liked_courses)}.
                I have completed: {', '.join(completed_courses)}.
                I prefer {preferred_difficulty} difficulty.
                Note the my university prerequisites in this major are: {prerequisites}
                Recommend me new courses to take.
                """

        response=client.models.generate_content(model="gemini-2.5-flash",
            contents=prompt)
        if not response or not response.text:
            return Response({"error": "didnt get response from gemini"},status=status.HTTP_502_BAD_GATEWAY)

        return Response({'recommendations': response.text}
                        , status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error":f"Gemini key error pay u poor: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def test_gemini(request):
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="say hi"  # absolute minimum prompt
        )

        return Response({"reply": response.text})

    except Exception as e:
        return Response({"error": str(e)}, status=500)
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
