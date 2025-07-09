from django.contrib import admin
from .models import Task, Meeting, InboxItem

admin.site.register(Task)
admin.site.register(Meeting)
admin.site.register(InboxItem)
