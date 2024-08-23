from django.contrib import admin
from .models import Course, Topic, Video, PDF
# Register your models here.


admin.site.register(Course)
admin.site.register(Topic)
admin.site.register(Video)
admin.site.register(PDF)

