from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User

from .models import Task
from .serializers import TaskSerializer, RegisterSerializer


# Tasks

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by("status", "position")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Register User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer