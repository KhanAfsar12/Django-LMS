from django.urls import path
from .views import ParticularCourse, course_reviews, enrollNow, viewCourse, exam_details


urlpatterns = [
    path('', viewCourse, name='viewCourse'),
    path('ParticularCourse/<int:id>', ParticularCourse, name='ParticularCourse'),
    path('exam/<int:exam_id>/', exam_details, name='exam_detail'),
    path('courses/<int:course_id>/reviews/', course_reviews, name='course_reviews'),
    path('enrollNow/<int:course_id>/', enrollNow, name='enrollNow'),
]