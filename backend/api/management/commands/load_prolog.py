import re
from django.core.management.base import BaseCommand
from api.models import Course, Major


MAJOR_MAP = {
    'computer_and_systems': 'computer_and_systems',
    'electronics_and_communications': 'electronics_and_communications',
    'electrical_power_and_machines': 'electrical_power_and_machines',
    'civil': 'civil',
    'mechanical': 'mechanical',
    'chemical': 'chemical',
    'production': 'production',
    'naval_architecture': 'naval_architecture',
    'nuclear_and_radiation': 'nuclear_and_radiation',
    'architectural': 'architectural',
    'textiles': 'textiles',
    'business': 'business',
    'medicine': 'medicine',
    'dentistry': 'dentistry',
    'law': 'law',
    'agriculture': 'agriculture',
    'fine_arts': 'fine_arts',
    'science': 'science',
    'pharmacy': 'pharmacy',
    'nursing': 'nursing',
    'veterinary': 'veterinary',
    'tourism': 'tourism',
    'education': 'education',
    'physical_education': 'physical_education',
}

# Map each course to its major based on the Prolog file sections
COURSE_MAJOR_MAP = {}


class Command(BaseCommand):
    help = 'Load courses and prerequisites from Prolog rules.pl file'

    def handle(self, *args, **kwargs):
        prolog_path = 'api/prolog/rules.pl'

        with open(prolog_path, 'r') as f:
            content = f.read()

        # Parse courses: course(id, difficulty, topic)
        course_pattern = re.compile(r'course\((\w+),\s*(\w+),\s*(\w+)\)\.')
        courses = course_pattern.findall(content)

        # Parse prerequisites: prerequisite(course, pre)
        prereq_pattern = re.compile(r'prerequisite\((\w+),\s*(\w+)\)\.')
        prerequisites = prereq_pattern.findall(content)

        # Parse majors from comments like "% CSE" and section blocks
        # We'll determine major by parsing sections
        major_sections = self._parse_major_sections(content)

        # Create majors
        self.stdout.write('Creating majors...')
        major_objects = {}
        for major_name in MAJOR_MAP.values():
            major_obj, _ = Major.objects.get_or_create(name=major_name)
            major_objects[major_name] = major_obj

        # Create courses
        self.stdout.write('Creating courses...')
        course_objects = {}
        for course_id, difficulty, topic in courses:
            course_obj, _ = Course.objects.get_or_create(
                name=course_id,
                defaults={
                    'difficulty': difficulty,
                    'topic': topic,
                }
            )
            course_objects[course_id] = course_obj

            # Assign major
            major_name = major_sections.get(course_id)
            if major_name and major_name in major_objects:
                course_obj.majors.add(major_objects[major_name])

        # Create prerequisites
        self.stdout.write('Creating prerequisites...')
        for course_id, pre_id in prerequisites:
            if course_id in course_objects and pre_id in course_objects:
                course_objects[course_id].prerequisites.add(course_objects[pre_id])

        self.stdout.write(self.style.SUCCESS(
            f'Done! Loaded {len(course_objects)} courses and {len(prerequisites)} prerequisites.'
        ))

    def _parse_major_sections(self, content):
        """Map each course to its major by reading section comments."""
        major_comment_map = {
            '% CSE': 'computer_and_systems',
            '% ECE': 'electronics_and_communications',
            '% EPM': 'electrical_power_and_machines',
            '% CVE': 'civil',
            '% MEC': 'mechanical',
            '% CHE': 'chemical',
            '% PED': 'production',
            '% NAME': 'naval_architecture',
            '% NRED': 'nuclear_and_radiation',
            '% ARC': 'architectural',
            '% TED': 'textiles',
            '% Business': 'business',
            '% Medicine': 'medicine',
            '% Dentistry': 'dentistry',
            '% Law': 'law',
            '% Agriculture': 'agriculture',
            '% Fine Arts': 'fine_arts',
            '% Science': 'science',
            '% Pharmacy': 'pharmacy',
            '% Nursing': 'nursing',
            '% Veterinary': 'veterinary',
            '% Tourism': 'tourism',
            '% Education': 'education',
            '% Physical Education': 'physical_education',
        }

        course_major = {}
        current_major = None
        course_pattern = re.compile(r'course\((\w+),')

        for line in content.splitlines():
            stripped = line.strip()
            for comment, major in major_comment_map.items():
                if stripped.startswith(comment):
                    current_major = major
                    break
            match = course_pattern.match(stripped)
            if match and current_major:
                course_major[match.group(1)] = current_major

        return course_major