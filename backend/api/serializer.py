from rest_framework import serializers
from .models import Major, Course


class MajorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Major
        fields = ['id', 'name']


class CourseSerializer(serializers.ModelSerializer):
    prerequisites = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    majors = MajorSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'difficulty', "topic", 'majors', 'prerequisites']
