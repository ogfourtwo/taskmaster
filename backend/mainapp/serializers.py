from rest_framework import serializers
from .models import Task, Meeting, MeetingMinuteEntry, InboxItem
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class TaskSerializer(serializers.ModelSerializer):
    assignees = UserSerializer(many=True, read_only=True)
    manager = UserSerializer(read_only=True)
    parent_task = serializers.PrimaryKeyRelatedField(queryset=Task.objects.all(), allow_null=True, required=False)
    subtasks = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Task
        fields = '__all__'


class MeetingSerializer(serializers.ModelSerializer):
    attendees = UserSerializer(many=True, read_only=True)
    host = UserSerializer(read_only=True)

    class Meta:
        model = Meeting
        fields = '__all__'


class InboxItemSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = InboxItem
        fields = '__all__'



class MeetingMinuteEntrySerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    meeting = serializers.PrimaryKeyRelatedField(queryset=Meeting.objects.all())
    parent_task = serializers.PrimaryKeyRelatedField(queryset=Task.objects.all(), allow_null=True, required=False)

    class Meta:
        model = MeetingMinuteEntry
        fields = '__all__'

    def create(self, validated_data):
        # Extract required fields
        assigned_user = validated_data.get('assigned_to')
        meeting = validated_data.get('meeting')
        deadline = validated_data.get('deadline')
        priority = validated_data.get('priority')
        note = validated_data.get('note')
        parent_task = validated_data.get('parent_task', None)

        # Create the minute entry
        minute_entry = MeetingMinuteEntry.objects.create(**validated_data)

        # Create a related Task
        task = Task.objects.create(
            title=note[:50],  # Short title from note
            description=note,
            due_date=deadline,
            priority=priority,
            manager=meeting.host,  # Set meeting host as manager
            meeting_minutes=None,  # You can link MeetingMinutes if needed
            parent_task=parent_task
        )
        task.assignees.set([assigned_user])
        task.save()

        # Link back the minute entry to the task (if you later add a task field to minute entry)
        # minute_entry.task = task
        # minute_entry.save()

        return minute_entry