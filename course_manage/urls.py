from django.urls import path
from .views import ParticularCourse, viewCourse


urlpatterns = [
    path('', viewCourse, name='viewCourse'),
    path('ParticularCourse/<int:id>', ParticularCourse, name='ParticularCourse'),
]