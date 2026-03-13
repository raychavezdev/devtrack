from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User



class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ["user"]

    def create(self, validated_data):
        status = validated_data.get("status", "pending")

        last_task = (
            Task.objects
            .filter(status=status)
            .order_by("-position")
            .first()
        )

        if last_task:
            position = last_task.position + 1000
        else:
            position = 1000

        validated_data["position"] = position

        return super().create(validated_data)
    

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user