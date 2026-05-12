from django.urls import path
from . import views


urlpatterns = [
    path('majors/', views.get_majors, name='get_majors'),
    path('courses/', views.get_courses, name='get_courses'),
    path('topics/', views.get_topics, name='get_topics'),
    path('recommend/prolog/', views.recommend_prolog, name='recommend_prolog'),
    path('recommend/ai/', views.recommend_ai, name='recommend_ai'),
]