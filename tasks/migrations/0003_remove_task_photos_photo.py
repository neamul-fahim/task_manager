# Generated by Django 5.0.1 on 2024-01-29 16:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_rename_due_data_task_due_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='photos',
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='task_photos/')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='tasks.task')),
            ],
        ),
    ]
