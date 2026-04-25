from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AgentViewSet, AdminViewSet, MeView, CompleteInviteView

router = DefaultRouter()
router.register(r"agents", AgentViewSet, basename='agent')
router.register(r"admins", AdminViewSet, basename='admin')

urlpatterns = [
    path('auth/complete-invite/', CompleteInviteView.as_view(), name='complete-invite'),
    path('users/me/', MeView.as_view(), name='user-me'),
    path('', include(router.urls))
]