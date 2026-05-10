"""Prolog engine for course recommendations goes here. This is a placeholder for the mean time."""

from pyswip import Prolog

import os

prolog = Prolog()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROLOG_FILE_PATH = os.path.join(BASE_DIR, 'prolog', 'rules.pl')
PROLOG_FILE_PATH = PROLOG_FILE_PATH.replace('\\', '/')

try:
    prolog.consult(PROLOG_FILE_PATH)
except Exception as e:
    print(f"Warning: Failed to load Prolog rules from {PROLOG_FILE_PATH}: {e}")

def get_recommendations(liked_topics: list, completed_courses: list, preferred_difficulty: str, major: str = None) -> list:
    # Clean up any stale facts
    list(prolog.query(f"retractall(completed(_))"))
    list(prolog.query(f"retractall(student_preference(_))"))
    list(prolog.query(f"retractall(prefers_difficulty(_))"))
    list(prolog.query(f"retractall(student_major(_))"))

    # Assert the user's context dynamically into Prolog
    # we wrap the string values in quotes to ensure Prolog treats them as atoms, not variables
    for course in completed_courses:
        prolog.assertz(f"completed('{course}')")
        
    for topic in liked_topics:
        prolog.assertz(f"student_preference('{topic}')")

    if preferred_difficulty:
        prolog.assertz(f"prefers_difficulty('{preferred_difficulty}')")

    if major:
        prolog.assertz(f"student_major('{major}')")

    recommendations = []
    try:
        query = prolog.query(f"recommend(Course)")
        for soln in query:
            # We extract the bound variable 'Course' from the solution dictionary
            course_name = soln["Course"]
            
            # PySwip sometimes returns byte strings; decoding it if needed
            if isinstance(course_name, bytes):
                course_name = course_name.decode("utf-8")
                
            recommendations.append(course_name)
    except Exception as e:
        print(f"Prolog Query Error: {e}")

    # Clean up the dynamic facts after querying
    list(prolog.query(f"retractall(completed(_))"))
    list(prolog.query(f"retractall(student_preference(_))"))
    list(prolog.query(f"retractall(prefers_difficulty(_))"))
    list(prolog.query(f"retractall(student_major(_))"))
    
    # Return unique recommendations
    return list(set(recommendations))