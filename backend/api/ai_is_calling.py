import json

from django.conf import settings
from google import genai

from .models import Major, Course


def get_ai_recommended_courses(request):
    topics=request.data.get('topics', [])
    preferred_difficulty = request.data.get('preferred_difficulty', "")
    major = request.data.get('major', "")
    completed_courses = request.data.get('completed_courses', [])

    liked_courses=extract_liked_courses(topics)
    prerequisites=extract_major_prerequisites(major) #we have map here

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    prompt = build_prompt(major,liked_courses,completed_courses,preferred_difficulty,prerequisites)

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    return parse(response.text)





def extract_liked_courses(topics):
    if not topics:
        return []
    #this shit topic__in==where topic in topics [in SQL]
    liked_courses=Course.objects.filter(topic__in=topics).values_list('name', flat=True)
    return list(liked_courses)


def extract_major_prerequisites(major_name):
    try:
        major = Major.objects.get(name__iexact=major_name)
        courses=Course.objects.filter(majors=major).prefetch_related('prerequisites')
        prereq_map={}
        for course in courses:
            element=course.prerequisites.values_list('name',flat=True)
            if element:
                prereq_map[course.name]=list(element)


        return prereq_map

    except Major.DoesNotExist:
        return {}

#Functional para
def build_prompt(major,liked_courses,completed_courses,
                 preferred_difficulty,
                 prerequisites):
    return f"""
            You are a university course recommendation system.
            Based on the student's information, recommend suitable new courses.

            Student major: {major}
            Liked courses: {', '.join(liked_courses)}
            Completed courses: {', '.join(completed_courses)}
            Preferred difficulty: {preferred_difficulty}

            University prerequisite rules (course: [required prerequisites]):
            {json.dumps(prerequisites, indent=2)}

            Requirements:
            - Only recommend courses whose prerequisites are all in the completed courses list.
            - Do not recommend courses already completed.
            - Align with student interests and preferred difficulty.
            - CRITICAL: Start with {{ and end with }}. No markdown, no backticks, raw JSON only.

            Return in this exact format:
            {{
                "recommendations": [
                    {{"course_name": "Course 1", "difficulty": "easy|medium|hard"}},
                    {{"course_name": "Course 2", "difficulty": "easy|medium|hard"}}
                ]
            }}
        """

def parse(raw):
    if not raw:
        raise ValueError("No response from Gemini")

    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("json"):
            clean = clean[4:]
        clean = clean.strip()

    return json.loads(clean)