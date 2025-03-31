from django.contrib import admin
from .models import Announcement, CompanySettings, Course, Enrollment, ExamResult, Review, Topic, Video, PDF, Exam, Question, Answer, Choice
from django_admin_listfilter_dropdown.filters import (
    DropdownFilter,
    RelatedDropdownFilter,
    ChoiceDropdownFilter
)

# Register your models here.

class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'credits', 'start_date', 'end_date', 'course_image', 'created_by']
    search_fields = ['title', 'description', 'created_by__username']
    list_filter = (
        ('company_name', RelatedDropdownFilter),
        ('credits', DropdownFilter),
        ('start_date', DropdownFilter),
        ('end_date', DropdownFilter),
        ('created_by', RelatedDropdownFilter)
    )

 
admin.site.register(Course, CourseAdmin)



class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'topic']
    search_fields = ['title', 'topic']

admin.site.register(Video, VideoAdmin)



class PDFAdmin(admin.ModelAdmin):
    list_display = ['topic', 'pdf_file', 'title']
    search_fields = ['topic', 'pdf_file', 'title']

admin.site.register(PDF, PDFAdmin)



class TopicAdmin(admin.ModelAdmin):
    list_display = ['course', 'title', 'description']
    search_fields = ['course', 'title', 'description']


admin.site.register(Topic, TopicAdmin)


admin.site.register(Exam)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Choice)

@admin.register(CompanySettings)
class CompanySettingsAdmin(admin.ModelAdmin):
    list_display = ['name','logo', 'powered_by', 'course_desc']


admin.site.register(Review)


admin.site.register(Announcement)


admin.site.register(Enrollment)

admin.site.register(ExamResult)




admin.site.site_header = "LMS Admin Panel"
admin.site.site_title = "Admin Dashboard"
admin.site.index_title = "Wlecome"