from django.contrib import admin
from .models import Task



class TaskAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'description', 'task_type', 'priority', 'status', 'position', 'created_at', 'completed_at')
    list_filter = ('task_type', 'priority', 'status')
    search_fields = ('title', 'description')
    ordering = ('status','position')




admin.site.register(Task, TaskAdmin)