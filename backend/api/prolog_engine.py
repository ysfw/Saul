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
    # all values are lowercased to match the lowercase atoms in rules.pl
    for course in completed_courses:
        prolog.assertz(f"completed('{course.lower()}')")
        
    for topic in liked_topics:
        prolog.assertz(f"student_preference('{topic.lower()}')")

    if preferred_difficulty:
        prolog.assertz(f"prefers_difficulty('{preferred_difficulty.lower()}')")

    if major:
        prolog.assertz(f"student_major('{major.lower()}')")

    def collect_results(query_str):
        """Run a Prolog query and collect unique course recommendations."""
        results = []
        for soln in prolog.query(query_str):
            course_name = soln["Course"]
            difficulty = soln["Difficulty"]
            if isinstance(course_name, bytes):
                course_name = course_name.decode("utf-8")
            if isinstance(difficulty, bytes):
                difficulty = difficulty.decode("utf-8")
            if course_name not in seen:
                seen.add(course_name)
                results.append({"course_name": course_name, "difficulty": difficulty})
        return results

    recommendations = []
    seen = set()
    try:
        # Level 1: Strict — topic + difficulty + major
        recommendations = collect_results("recommend(Course, Difficulty)")

        # Level 2: Drop topic, keep difficulty
        if not recommendations:
            recommendations = collect_results("recommend_any_topic(Course, Difficulty)")

        # Level 3: Drop difficulty, keep topic
        if not recommendations:
            recommendations = collect_results("recommend_any_difficulty(Course, Difficulty)")

        # Level 4: Drop both topic and difficulty
        if not recommendations:
            recommendations = collect_results("recommend_any_difficulty_topic(Course, Difficulty)")
        
        for course in recommendations:
            print(f"Recommended Course: {course['course_name']} (Difficulty: {course['difficulty']})")

    except Exception as e:
        print(f"Prolog Query Error: {e}")

    # Clean up the dynamic facts after querying
    list(prolog.query(f"retractall(completed(_))"))
    list(prolog.query(f"retractall(student_preference(_))"))
    list(prolog.query(f"retractall(prefers_difficulty(_))"))
    list(prolog.query(f"retractall(student_major(_))"))
    
    return recommendations