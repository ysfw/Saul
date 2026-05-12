import json
from django.conf import settings
from google import genai
from .models import Major, Course


def get_ai_recommended_courses(request):
    liked_topics = request.data.get('liked_topics', [])
    preferred_difficulty = request.data.get('preferred_difficulty', "")
    major = request.data.get('major', "")
    completed_courses = request.data.get('completed_courses', [])
    liked_courses = extract_liked_courses(liked_topics, major)
    prerequisites=extract_major_prerequisites(major) #we have map here

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    prompt = build_prompt(major,liked_courses,completed_courses,preferred_difficulty,prerequisites)

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    return parse(response.text)





def extract_liked_courses(topics, major_name):
    if not topics or not major_name:
        return []
    try:
        major = Major.objects.get(name__iexact=major_name)
        #this shit topic__in==where topic in topics [in SQL]
        topics=list(map(lambda t:t.lower(), topics))    #map here takes(function,collection) so i apply fun to each elemnt in collection
        liked_courses=Course.objects.filter(topic__in=topics, majors=major).values_list('name', flat=True)
        return list(liked_courses)
    except Major.DoesNotExist:
        return []


def extract_major_prerequisites(major_name):
    try:
        major = Major.objects.get(name__iexact=major_name)
        courses=Course.objects.filter(majors=major).prefetch_related('prerequisites')
        prereq_map={}
        for course in courses:
            element=list(course.prerequisites.values_list('name',flat=True))
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
            Liked courses: {', '.join(liked_courses or [])}
            Completed courses: {', '.join(completed_courses or [])}
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