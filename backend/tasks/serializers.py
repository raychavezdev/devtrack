from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = "__all__"

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