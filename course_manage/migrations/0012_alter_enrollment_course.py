# Generated by Django 5.1.1 on 2024-10-31 13:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course_manage', '0011_alter_enrollment_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='enrollment',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='course_manage.course'),
        ),
    ]
