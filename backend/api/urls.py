from django.urls import path
from . import views


urlpatterns = [
    # Auth
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),

    # Profile
    path('profile/', views.profile, name='profile'),
    path('profile/courses/', views.profile_courses, name='profile_courses'),

    # Data (public)
    path('majors/', views.get_majors, name='get_majors'),
    path('courses/', views.get_courses, name='get_courses'),

    # Recommendations (guest + authenticated)
    path('recommend/prolog/', views.recommend_prolog, name='recommend_prolog'),
    path('recommend/ai/', views.recommend_ai, name='recommend_ai'),
]