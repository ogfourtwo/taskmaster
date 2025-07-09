from rest_framework import viewsets
from .models import MeetingMinuteEntry, Task, Meeting, InboxItem
from .serializers import MeetingMinuteEntrySerializer, TaskSerializer, MeetingSerializer, InboxItemSerializer

class MeetingMinuteEntryViewSet(viewsets.ModelViewSet):
    queryset = MeetingMinuteEntry.objects.all()
    serializer_class = MeetingMinuteEntrySerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

class InboxItemViewSet(viewsets.ModelViewSet):
    queryset = InboxItem.objects.all()
    serializer_class = InboxItemSerializer
