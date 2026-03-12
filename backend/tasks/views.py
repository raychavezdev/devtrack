from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer


# Tasks 

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by("status", "position")
    serializer_class = TaskSerializer


# Register User 

from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer