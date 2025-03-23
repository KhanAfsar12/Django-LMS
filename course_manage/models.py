from django.db import models
from django.contrib.auth.models import User
from ckeditor.fields import RichTextField
# Create your models here.



class CompanySettings(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='company_settings', null=True)
    name = models.CharField(max_length=1000, null=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    powered_by = models.ImageField(upload_to='powered_by/', blank=True, null=True)
    company_url = models.URLField(null=True, blank=True)
    course_desc = models.CharField(max_length=1000, null=True)

    def __str__(self):
        return f"{self.name}"


class Course(models.Model):
    company_name = models.ForeignKey(CompanySettings, on_delete=models.CASCADE, related_name='courses', null=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    credits = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    course_image = models.ImageField(upload_to='course_image/', blank=True, null=True) 
    created_at = models.DateTimeField(null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title



class Topic(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} - {self.course.title}"
    

class PDF(models.Model):
    topic = models.ForeignKey(Topic, related_name='pdfs', on_delete=models.CASCADE)
    pdf_file = models.FileField(upload_to='pdfs/')
    title = models.CharField(max_length=255, blank=True)
    def __str__(self):
        return f"{self.title} - {self.topic.title}"


class Video(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=255)
    video_file = models.FileField(upload_to='videos/')  

    def __str__(self):
        return f"{self.title} - {self.topic.title}"
    


class Exam(models.Model):
    course = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='exams')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def __str__(self):
        return self.title


class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    text = RichTextField()
    is_multiple_choice = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.text


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.TextField()
    is_correct = models.BooleanField(default=True)

    def __str__(self):
        return self.text


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    selected_choice = models.ForeignKey(Choice, on_delete=models.CASCADE, null=True)
    text = models.CharField(max_length=1000, null=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.selected_choice.text




class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()  # For ratings between 1-5
    review_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.course.title}"
    



class Announcement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    message = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Announcement by {self.user.username} for {self.course.title}"
    



class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    progress = models.FloatField(default=0)  # Percentage of completion

    def __str__(self):
        return f"{self.user.username} - {self.course.title}"



class ExamResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    score = models.FloatField()  # Score out of 100

    def __str__(self):
        return f"{self.user.username} - {self.exam.title} - {self.score}"


