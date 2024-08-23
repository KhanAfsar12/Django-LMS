from django import forms
from .models import Course, Topic, Video

class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['title', 'description']