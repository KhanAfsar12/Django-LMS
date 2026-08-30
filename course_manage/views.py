from rest_framework import status, permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
import spacy

from .models import (
    Announcement, Answer, Choice, CompanySettings, Course,
    Enrollment, Exam, ExamResult, Question, Review, Topic, Video
)
from .serializers import (
    CompanySettingsSerializer, CourseSerializer, CourseDetailSerializer,
    ReviewSerializer, AnnouncementSerializer, EnrollmentSerializer,
    ExamSerializer, ExamResultSerializer, UserProfileSerializer,
    AnswerSubmitSerializer
)

try:
    nlp = spacy.load('en_core_web_sm')
except Exception:
    nlp = None


class CourseListAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = request.user
        if user.is_authenticated:
            company_settings = CompanySettings.objects.filter(owner=user)
            if company_settings.exists():
                courses = Course.objects.filter(company_name__in=company_settings)
            else:
                courses = Course.objects.all()
        else:
            courses = Course.objects.all()

        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ParticularCourseAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        course = get_object_or_404(
            Course.objects.prefetch_related('topics__videos', 'topics__pdfs', 'topics__exams').select_related('created_by'),
            id=id
        )

        is_enrolled = False
        if request.user.is_authenticated:
            is_enrolled = Enrollment.objects.filter(user=request.user, course=course).exists()
            if is_enrolled:
                request.session['course_id'] = course.id

        reviews = Review.objects.filter(course=course).order_by('-created_at')
        announcements = Announcement.objects.filter(course=course)
        
        serializer = CourseDetailSerializer(course, context={'request': request})
        review_serializer = ReviewSerializer(reviews, many=True)
        announcement_serializer = AnnouncementSerializer(announcements, many=True)

        return Response({
            "course": serializer.data,
            "reviews": review_serializer.data,
            "announcements": announcement_serializer.data,
            "is_enrolled": is_enrolled
        }, status=status.HTTP_200_OK)


class EnrollNowAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        enrollment, created = Enrollment.objects.get_or_create(user=request.user, course=course)
        
        if not created:
            return Response({
                "message": "Already enrolled in this course.",
                "already_enrolled": True,
                "enrollment": EnrollmentSerializer(enrollment).data
            }, status=status.HTTP_200_OK)

        return Response({
            "message": "Enrollment successful.",
            "already_enrolled": False,
            "enrollment": EnrollmentSerializer(enrollment).data
        }, status=status.HTTP_201_CREATED)


class CourseReviewAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        reviews = Review.objects.filter(course=course).order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, course=course)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExamDetailsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, exam_id):
        exam = get_object_or_404(Exam, pk=exam_id)
        serializer = ExamSerializer(exam)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, exam_id):
        exam = get_object_or_404(Exam, pk=exam_id)
        answers_data = request.data.get('answers', [])
        
        saved_answers = []
        for ans_item in answers_data:
            question_id = ans_item.get('question_id')
            selected_choice_id = ans_item.get('selected_choice_id')
            text = ans_item.get('text')

            question = get_object_or_404(Question, id=question_id, exam=exam)
            selected_choice = Choice.objects.filter(id=selected_choice_id).first() if selected_choice_id else None

            answer = Answer.objects.create(
                question=question,
                selected_choice=selected_choice,
                text=text,
                student=request.user
            )
            saved_answers.append(answer.id)

        return Response({
            "message": "Exam completed successfully.",
            "saved_answers_count": len(saved_answers)
        }, status=status.HTTP_200_OK)


class ExtractResumeAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        text = """
        John Doe is a Software Developer with 5 years of experience in Python and Django.
        He has worked at Google and Microsoft.
        Skills include Machine Learning, REST APIs, and Database Management.
        """
        if nlp is None:
            return Response({
                "name": "John Doe",
                "skills": ["Python", "Django", "Machine Learning", "REST APIs"],
                "companies": ["Google", "Microsoft"]
            }, status=status.HTTP_200_OK)

        doc = nlp(text)
        name = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
        skills = [token.text for token in doc if token.pos_ in ["PROPN", "NOUN"]]
        companies = [ent.text for ent in doc.ents if ent.label_ == "ORG"]

        data = {
            "name": name[0] if name else "Unknown",
            "skills": list(set(skills)),
            "companies": list(set(companies))
        }
        return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def extract_resume_details(request):
    return ExtractResumeAPIView().get(request)


class ProfileAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)