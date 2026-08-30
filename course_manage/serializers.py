from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    CompanySettings,
    Course,
    Topic,
    PDF,
    Video,
    Exam,
    Question,
    Choice,
    Answer,
    Review,
    Announcement,
    Enrollment,
    ExamResult
)
from authentication.serializers import UserSerializer


class CompanySettingsSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = CompanySettings
        fields = ['id', 'owner', 'name', 'logo', 'powered_by', 'company_url', 'course_desc']


class PDFSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDF
        fields = ['id', 'title', 'pdf_file']


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'video_file']


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'is_multiple_choice', 'choices']


class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'questions']


class TopicSerializer(serializers.ModelSerializer):
    pdfs = PDFSerializer(many=True, read_only=True)
    videos = VideoSerializer(many=True, read_only=True)
    exams = ExamSerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ['id', 'title', 'description', 'pdfs', 'videos', 'exams']


class CourseSerializer(serializers.ModelSerializer):
    company_name = CompanySettingsSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'company_name', 'title', 'description', 'credits',
            'start_date', 'end_date', 'course_image', 'created_at',
            'created_by', 'is_enrolled'
        ]

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(user=request.user, course=obj).exists()
        return False


class CourseDetailSerializer(serializers.ModelSerializer):
    company_name = CompanySettingsSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    topics = TopicSerializer(many=True, read_only=True)
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'company_name', 'title', 'description', 'credits',
            'start_date', 'end_date', 'course_image', 'created_at',
            'created_by', 'topics', 'is_enrolled'
        ]

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(user=request.user, course=obj).exists()
        return False


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'course', 'rating', 'review_text', 'created_at']
        read_only_fields = ['user', 'course', 'created_at']


class AnnouncementSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Announcement
        fields = ['id', 'user', 'course', 'message']


class EnrollmentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'progress']


class ExamResultSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    exam = ExamSerializer(read_only=True)

    class Meta:
        model = ExamResult
        fields = ['id', 'user', 'exam', 'score']


class AnswerSubmitSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_choice_id = serializers.IntegerField(required=False, allow_null=True)
    text = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class ExamSubmissionSerializer(serializers.Serializer):
    answers = AnswerSubmitSerializer(many=True)


class UserProfileSerializer(serializers.ModelSerializer):
    company_settings = CompanySettingsSerializer(many=True, read_only=True)
    courses_created = CourseSerializer(many=True, read_only=True, source='course_set')
    enrollments = EnrollmentSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True, source='review_set')
    announcements = AnnouncementSerializer(many=True, read_only=True, source='announcement_set')
    exam_results = ExamResultSerializer(many=True, read_only=True, source='examresult_set')

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'company_settings', 'courses_created', 'enrollments',
            'reviews', 'announcements', 'exam_results'
        ]
