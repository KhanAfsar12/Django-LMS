from django.urls import path
from .views import ParticularCourse, viewCourse, exam_details


urlpatterns = [
    path('', viewCourse, name='viewCourse'),
    path('ParticularCourse/<int:id>', ParticularCourse, name='ParticularCourse'),
    path('exam/<int:exam_id>/', exam_details, name='exam_detail'),
]