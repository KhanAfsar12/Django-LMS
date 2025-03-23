from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.forms import modelformset_factory
from .forms import AnswerForm, EnrollNowForm, ReviewForm
from .models import Announcement, Answer, CompanySettings, Course, Enrollment, Exam, ExamResult, Question, Review, Topic,  Video
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
# Create your views here.



from django.contrib.auth.models import AnonymousUser
from django.shortcuts import render

def viewCourse(request):
    user = request.user
    courses = Course.objects.all()  # Fetch all courses for anonymous users

    company_settings = None
    enrolled_dic = {}

    if not isinstance(user, AnonymousUser) and user.is_authenticated:
        # Only query company settings and enrollment for authenticated users
        company_settings = CompanySettings.objects.filter(owner=user)
        courses = Course.objects.filter(company_name__in=company_settings)

        # Dictionary to check enrollment status for each course
        enrolled_dic = {
            course.title: Enrollment.objects.filter(user=user, course=course).exists()
            for course in courses
        }
    
    # Pass enrolled_dic as a list to the template
    enrolled_status_list = list(enrolled_dic.values())

    return render(request, 'course_manage/courses.html', {
        'courses': courses,
        'user': user,
        'company_settings': company_settings,
        'enrolled_dic': enrolled_status_list,
    })





def get_course_with_topics_and_videos(id):
    try:
        course = Course.objects.prefetch_related('topics__videos', 'topics__pdfs', 'topics__exams').select_related('created_by').get(id=id)
        return course

    except Course.DoesNotExist:
        return None
    
def is_user_enrolled(user, course_id):
    return Enrollment.objects.filter(user=user, course_id=course_id)

def ParticularCourse(request, id):
    reviews = Review.objects.filter(course=id).order_by('-created_at')
    if not request.user.is_authenticated:
        return redirect('login')
    
    is_enrolled = is_user_enrolled(request.user, id)
    
    if not is_user_enrolled(request.user, id):
        return redirect('enrollNow', course_id=id)
    
    request.session['course_id'] = id
    course = get_course_with_topics_and_videos(id)

    announcement = Announcement.objects.filter(id=id)
    company_settings = CompanySettings.objects.first()
    if course:
        return render(request, 'course_manage/course.html', {'course': course, 'reviews': reviews, 'announcement': announcement, 'is_enrolled': is_enrolled})
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




def enrollNow(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    if not request.user.is_authenticated:
        return redirect('login')
    
    if Enrollment.objects.filter(user=request.user, course=course).exists():
        return render(request, 'course_manage/enroll_course.html', {'course': course, 'already_enrolled': True,})

    if request.method == 'POST':
        form = EnrollNowForm(request.POST)
        if form.is_valid():
            enrollment = form.save(commit=False)
            enrollment.user = request.user
            enrollment.course = course
            enrollment.save()
            messages.success(request, "Enrollment is successful...")
            return redirect('/')
        else:
            messages.warning(request, "Something went wrong")
            return redirect('/')
    else:
        if not request.user.is_authenticated:
            return redirect('login')
        form = EnrollNowForm()
    context = {
        'user': request.user,
        'course': course_id,
        'form': form
    }
    return render(request, 'course_manage/enroll_course.html', context)



