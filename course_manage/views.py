from django.shortcuts import render
from .models import Course, Topic, Video
# Create your views here.

def viewCourse(request):
    courses = Course.objects.all()
    return render(request, 'courses.html', {'courses': courses})


def get_course_with_topics_and_videos(id):
    try:
        course = Course.objects.prefetch_related('topics__videos', 'topics__pdfs').select_related('created_by').get(id=id)
        
        return course

    except Course.DoesNotExist:
        return None


def ParticularCourse(request, id):
    # course = Course.objects.filter(id=id).first()
    # topics_with_videos = Topic.objects.filter(id=course.id).prefetch_related('videos')
    # return render(request, 'course.html', {'topics_with_videos': topics_with_videos})
    course = get_course_with_topics_and_videos(id)
    if course:
        return render(request, 'course.html', {'course': course})
    else:
        return render(request, '404.html')