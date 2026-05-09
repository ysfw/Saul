from django.urls import path
from . import views
# from .views import test_gemini

urlpatterns = [
    path('majors/', views.get_majors, name='get_majors'),
    path('courses/', views.get_courses, name='get_courses'),
    path('recommend/prolog/', views.recommend_prolog, name='recommend_prolog'),
    path('recommend/ai/', views.recommend_ai, name='recommend_ai'),
    # path('test/', test_gemini),
]