# Generated by Django 5.1.1 on 2024-09-14 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course_manage', '0002_companysettings_course_course_image_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='companysettings',
            name='powered_by',
            field=models.ImageField(blank=True, null=True, upload_to='powered_by/'),
        ),
    ]