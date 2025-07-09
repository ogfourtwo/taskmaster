from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, MeetingViewSet, InboxItemViewSet, MeetingMinuteEntryViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'meetings', MeetingViewSet)
router.register(r'inbox', InboxItemViewSet)
router.register(r'minutes', MeetingMinuteEntryViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
