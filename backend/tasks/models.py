from django.db import models


class Task(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("progress", "In Progress"),
        ("done", "Done"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    TYPE_CHOICES = [
        ("bug", "Bug"),
        ("feature", "Feature"),
        ("improvement", "Improvement"),
        ("refactor", "Refactor"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    task_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title