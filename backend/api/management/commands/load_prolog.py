import re
from django.core.management.base import BaseCommand
from api.models import Course, Major


class Command(BaseCommand):
    help = 'Load courses and prerequisites from Prolog rules.pl file'

    def handle(self, *args, **kwargs):
        prolog_path = 'api/prolog/rules.pl'

        with open(prolog_path, 'r') as f:
            content = f.read()

        # Parse courses: course(id, difficulty, topic, major)
        course_pattern = re.compile(r'course\((\w+),\s*(\w+),\s*(\w+),\s*(\w+)\)\.')
        courses = course_pattern.findall(content)

        # Parse prerequisites: prerequisite(course, pre)
        prereq_pattern = re.compile(r'prerequisite\((\w+),\s*(\w+)\)\.')
        prerequisites = prereq_pattern.findall(content)

        # Create majors from the courses data itself
        self.stdout.write('Creating majors...')
        major_names = set(major for _, _, _, major in courses)
        major_objects = {}
        for major_name in major_names:
            major_obj, created = Major.objects.get_or_create(name=major_name)
            major_objects[major_name] = major_obj
            if created:
                self.stdout.write(f'  Created major: {major_name}')

        # Create courses
        self.stdout.write('Creating courses...')
        course_objects = {}
        for course_id, difficulty, topic, major_name in courses:
            course_obj, created = Course.objects.get_or_create(
                name=course_id,
                defaults={
                    'difficulty': difficulty,
                    'topic': topic,
                }
            )
            course_objects[course_id] = course_obj

            # Assign major directly from course fact
            if major_name in major_objects:
                course_obj.majors.add(major_objects[major_name])

            if created:
                self.stdout.write(f'  Created course: {course_id} ({difficulty}, {topic}, {major_name})')

        # Create prerequisites
        self.stdout.write('Creating prerequisites...')
        prereq_count = 0
        for course_id, pre_id in prerequisites:
            if course_id in course_objects and pre_id in course_objects:
                course_objects[course_id].prerequisites.add(course_objects[pre_id])
                prereq_count += 1
            else:
                self.stdout.write(
                    self.style.WARNING(f'  Skipped prerequisite: {course_id} -> {pre_id} (one or both not found)')
                )

        self.stdout.write(self.style.SUCCESS(
            f'Done! Loaded {len(course_objects)} courses, '
            f'{len(major_objects)} majors, and {prereq_count} prerequisites.'
        ))