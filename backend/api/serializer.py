from rest_framework import serializers
from .models import Major, Course


class MajorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Major
        fields = ['id', 'name', 'description']


class CourseSerializer(serializers.ModelSerializer):
    majors = MajorSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'difficulty', "topic", 'majors', 'prerequisites']
