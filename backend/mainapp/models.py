from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)

    manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name='managed_tasks', null=True)
    assignees = models.ManyToManyField(User, related_name='assigned_tasks')
    priority = models.CharField(
        max_length=50,
        choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')],
        default='Medium'
    )

    # 👇 Optional link to meeting minutes
    meeting_minutes = models.ForeignKey('MeetingMinutes', on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')

    # 👇 Optional parent task
    parent_task = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='child_tasks')

    def __str__(self):
        return self.title

class Meeting(models.Model):
    title = models.CharField(max_length=255)
    date = models.DateTimeField()
    attendees = models.ManyToManyField(User)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_meetings', null=True)
    link = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} on {self.date.strftime('%Y-%m-%d')}"


class MeetingMinutes(models.Model):
    meeting = models.OneToOneField(Meeting, on_delete=models.CASCADE, related_name='minutes_summary')
    summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    priority = models.CharField(
        max_length=50,
        choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')],
        default='Medium'
    )

    def __str__(self):
        return f"Minutes for {self.meeting.title}"




class MeetingMinuteEntry(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='minutes_entries')
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
    note = models.TextField()
    deadline = models.DateTimeField()
    reminder_days = models.IntegerField(default=1)
    priority = models.CharField(max_length=50, choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')])
    file = models.FileField(upload_to='meeting_files/', null=True, blank=True)
    parent_task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True, related_name='meeting_subtasks')
    task = models.OneToOneField(Task, on_delete=models.SET_NULL, null=True, blank=True, related_name='minute_entry')

    def __str__(self):
        return f"{self.note[:30]}..."



class InboxItem(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_items', null=True)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_items', null=True)
    message = models.TextField()
    received_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    is_approval_request = models.BooleanField(default=False)
    is_approved = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username}"

