from django.urls import path
from .views import (
    CourseListAPIView,
    ParticularCourseAPIView,
    ExamDetailsAPIView,
    CourseReviewAPIView,
    EnrollNowAPIView,
    ExtractResumeAPIView,
    ProfileAPIView,
    extract_resume_details
)

urlpatterns = [
    path('', CourseListAPIView.as_view(), name='viewCourse'),
    path('ParticularCourse/<int:id>/', ParticularCourseAPIView.as_view(), name='ParticularCourse'),
    path('exam/<int:exam_id>/', ExamDetailsAPIView.as_view(), name='exam_detail'),
    path('courses/<int:course_id>/reviews/', CourseReviewAPIView.as_view(), name='course_reviews'),
    path('enrollNow/<int:course_id>/', EnrollNowAPIView.as_view(), name='enrollNow'),
    path('extract-resume/', ExtractResumeAPIView.as_view(), name="extract_resume"),
    path('profile/<str:username>/', ProfileAPIView.as_view(), name='profile'),
]