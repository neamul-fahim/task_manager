from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Task(models.Model):

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField()
    priority = models.CharField(
        max_length=10, choices=PRIORITY_CHOICES, default='medium')
    is_complete = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Photo(models.Model):
    task = models.ForeignKey(
        Task, related_name='photos', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='task_photos/')
