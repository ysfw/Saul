from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Major, Course, StudentProfile


class MajorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Major
        fields = ['id', 'name', 'description']


class CourseSerializer(serializers.ModelSerializer):
    majors = MajorSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'difficulty', "topic", 'majors', 'prerequisites']


class CourseMinimalSerializer(serializers.ModelSerializer):
    """Lightweight serializer for course lists (profile, selection UI)."""
    class Meta:
        model = Course
        fields = ['id', 'name', 'difficulty', 'topic']


class StudentProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    major_name = serializers.CharField(source='major.name', read_only=True, default=None)
    completed_courses = CourseMinimalSerializer(many=True, read_only=True)

    class Meta:
        model = StudentProfile
        fields = ['id', 'username', 'major_name', 'completed_courses']


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=6)
    major = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def create(self, validated_data):
        major_name = validated_data.pop('major', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )
        major = None
        if major_name:
            try:
                major = Major.objects.get(name__iexact=major_name)
            except Major.DoesNotExist:
                pass
        StudentProfile.objects.create(user=user, major=major)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
