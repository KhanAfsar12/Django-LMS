# Generated by Django 5.1.1 on 2024-10-31 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course_manage', '0007_course_course_desc_course_created_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='course_desc',
        ),
        migrations.AddField(
            model_name='companysettings',
            name='course_desc',
            field=models.CharField(max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name='companysettings',
            name='name',
            field=models.CharField(max_length=1000, null=True),
        ),
    ]
