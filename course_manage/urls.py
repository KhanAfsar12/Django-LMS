from django.urls import path
<<<<<<< HEAD
from .views import ParticularCourse, course_reviews, enrollNow, extract_resume_details, viewCourse, exam_details
=======
from .views import ParticularCourse, course_reviews, enrollNow, viewCourse, exam_details
>>>>>>> 54fb3efbf3f95277ba87d02031ae3980816b5d52


urlpatterns = [
    path('', viewCourse, name='viewCourse'),
    path('ParticularCourse/<int:id>', ParticularCourse, name='ParticularCourse'),
    path('exam/<int:exam_id>/', exam_details, name='exam_detail'),
    path('courses/<int:course_id>/reviews/', course_reviews, name='course_reviews'),
    path('enrollNow/<int:course_id>/', enrollNow, name='enrollNow'),
<<<<<<< HEAD
    path('extract-resume/', extract_resume_details, name="extract_resume")
=======
>>>>>>> 54fb3efbf3f95277ba87d02031ae3980816b5d52
]