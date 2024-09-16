from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.forms import modelformset_factory
from .forms import AnswerForm, ReviewForm
from .models import Answer, CompanySettings, Course, Exam, Question, Review, Topic,  Video
from django.contrib import messages
from django.contrib.auth.decorators import login_required
# Create your views here.

def viewCourse(request):
    courses = Course.objects.all()
    user = request.user
    company_settings = CompanySettings.objects.first()
    print(company_settings)
    return render(request, 'courses.html', {'courses': courses, 'user':user, 'company_settings':company_settings})


def get_course_with_topics_and_videos(id):
    try:
        course = Course.objects.prefetch_related('topics__videos', 'topics__pdfs', 'topics__exams').select_related('created_by').get(id=id)
        return course

    except Course.DoesNotExist:
        return None

def ParticularCourse(request, id):
    reviews = Review.objects.filter(course=id).order_by('-created_at')
    if not request.user.is_authenticated:
        print(request.user)
        return redirect('login')
    print(request.user)
    request.session['course_id'] = id
    course = get_course_with_topics_and_videos(id)
    company_settings = CompanySettings.objects.first()
    if course:
        return render(request, 'course.html', {'course': course, 'reviews': reviews})
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
            course_id = request.session.get('course_id')
            return redirect('ParticularCourse',id=course_id)
        else:
            messages.warning(request, 'Some answers were invalid. Please correct them.')
    else:
        for question in questions:
            form = AnswerForm(prefix=str(question.id), question=question)
            question_form_pairs.append((question, form))

    return render(request, 'Q&A.html', {'exam': exam, 'question_form_pairs': question_form_pairs})



@login_required
def course_reviews(request, course_id):
    course = get_object_or_404(Course, id=course_id)
 
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.user = request.user
            review.course = course
            review.save()
            course_id = request.session.get('course_id')
            return redirect('ParticularCourse',id=course_id)
        else:
            return HttpResponse('Form is invalid')
    else:
        form = ReviewForm()
    context = {
        'form': form,
    }
    return render(request, 'course_reviews.html', context)