from course_manage.models import *
from django.db import connection

def run():
    course = Topic.objects.prefetch_related('pdfs').all()
    print(course)
    for course in course:
        for pdf in course.pdfs.all():
            print(pdf)