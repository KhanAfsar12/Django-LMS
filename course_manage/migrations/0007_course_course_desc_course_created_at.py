# Generated by Django 5.1.1 on 2024-10-31 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course_manage', '0006_enrollment_examresult'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='course_desc',
            field=models.CharField(max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name='course',
            name='created_at',
            field=models.DateTimeField(null=True),
        ),
    ]
