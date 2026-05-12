from django.db import models
from django.contrib.auth.models import User


class Major(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Course(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    TOPIC_CHOICES = [
        ('accounting', 'Accounting'),
        ('agriculture', 'Agriculture'),
        ('algorithms', 'Algorithms'),
        ('anatomy', 'Anatomy'),
        ('arts', 'Arts'),
        ('biochemistry', 'Biochemistry'),
        ('biology', 'Biology'),
        ('business', 'Business'),
        ('chemistry', 'Chemistry'),
        ('circuits', 'Circuits'),
        ('communications', 'Communications'),
        ('control', 'Control'),
        ('dentistry', 'Dentistry'),
        ('design', 'Design'),
        ('drawing', 'Drawing'),
        ('economics', 'Economics'),
        ('education', 'Education'),
        ('electronics', 'Electronics'),
        ('environment', 'Environment'),
        ('finance', 'Finance'),
        ('fluid_mechanics', 'Fluid Mechanics'),
        ('geography', 'Geography'),
        ('hardware', 'Hardware'),
        ('history', 'History'),
        ('hydraulics', 'Hydraulics'),
        ('language', 'Language'),
        ('law', 'Law'),
        ('management', 'Management'),
        ('manufacturing', 'Manufacturing'),
        ('marketing', 'Marketing'),
        ('materials', 'Materials'),
        ('mathematics', 'Mathematics'),
        ('mechanics', 'Mechanics'),
        ('medicine', 'Medicine'),
        ('microbiology', 'Microbiology'),
        ('naval', 'Naval'),
        ('networks', 'Networks'),
        ('nuclear', 'Nuclear'),
        ('nursing', 'Nursing'),
        ('nutrition', 'Nutrition'),
        ('pathology', 'Pathology'),
        ('pharmacology', 'Pharmacology'),
        ('pharmacy', 'Pharmacy'),
        ('philosophy', 'Philosophy'),
        ('physics', 'Physics'),
        ('physiology', 'Physiology'),
        ('power', 'Power'),
        ('programming', 'Programming'),
        ('psychology', 'Psychology'),
        ('signals', 'Signals'),
        ('sociology', 'Sociology'),
        ('software', 'Software'),
        ('sports', 'Sports'),
        ('structures', 'Structures'),
        ('surgery', 'Surgery'),
        ('surveying', 'Surveying'),
        ('systems', 'Systems'),
        ('textiles', 'Textiles'),
        ('thermodynamics', 'Thermodynamics'),
        ('tourism', 'Tourism'),
        ('veterinary', 'Veterinary'),
    ]

    topic = models.CharField(max_length=50, choices=TOPIC_CHOICES, default='other')

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    majors = models.ManyToManyField(
        Major,
        blank=True,
        related_name='courses'
    )
    prerequisites = models.ManyToManyField(
        'self',
        symmetrical=False,
        blank=True,
        related_name='unlocks'
    )

    def __str__(self):
        return self.name


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    major = models.ForeignKey(Major, on_delete=models.SET_NULL, null=True, blank=True)
    completed_courses = models.ManyToManyField(Course, blank=True, related_name='completed_by')

    def __str__(self):
        return f"{self.user.username}'s profile"
