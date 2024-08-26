from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.forms import modelformset_factory
from .forms import AnswerForm
from .models import Answer, Course, Exam, Question, Topic, Video
from django.contrib import messages
from django.contrib.auth.decorators import login_required
# Create your views here.

def viewCourse(request):
    courses = Course.objects.all()
    return render(request, 'courses.html', {'courses': courses})


def get_course_with_topics_and_videos(id):
    try:
        course = Course.objects.prefetch_related('topics__videos', 'topics__pdfs', 'topics__exams').select_related('created_by').get(id=id)
        
        return course

    except Course.DoesNotExist:
        return None

def ParticularCourse(request, id):
    if not request.user.is_authenticated:
        print(request.user)
        return redirect('login')
    print(request.user)
    request.session['course_id'] = id
    course = get_course_with_topics_and_videos(id)
    if course:
        return render(request, 'course.html', {'course': course})
    else:
        return render(request, '404.html')
    



@login_required
def exam_details(request, exam_id):
    exam = get_object_or_404(Exam, pk=exam_id)
    questions = exam.questions.all()

    question_form_pairs = []

    if request.method == 'POST':
        all_valid = True
        for question in questions:
            form = AnswerForm(request.POST, prefix=str(question.id), question=question)
            if form.is_valid():
                answer = form.save(commit=False)
                answer.question = question
                answer.student = request.user
                answer.save()
            else:
                all_valid = False
            question_form_pairs.append((question, form))
        
        if all_valid:
            messages.success(request, 'Exam completed successfully.')
            return redirect('viewCourse')
        else:
            messages.warning(request, 'Some answers were invalid. Please correct them.')
    else:
        for question in questions:
            form = AnswerForm(prefix=str(question.id), question=question)
            question_form_pairs.append((question, form))

    return render(request, 'exam_detail.html', {'exam': exam, 'question_form_pairs': question_form_pairs})
