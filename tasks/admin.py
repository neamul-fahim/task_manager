from django.contrib import admin
from .models import Task, Photo


class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'due_date',
                    'priority', 'is_complete', 'user')
    list_filter = ('priority', 'is_complete')
    search_fields = ('title', 'description')

    def get_queryset(self, request):
        return super().get_queryset(request).order_by('priority')


class PhotoAdmin(admin.ModelAdmin):
    list_display = ('task', 'image')


admin.site.register(Task, TaskAdmin)
admin.site.register(Photo, PhotoAdmin)
