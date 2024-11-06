from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HomeView, ProjectViewSet, ProposalUtilityViewSet, ProjectWebhookViewSet

router = DefaultRouter()
router.register(r'api/projects', ProjectViewSet, basename='project')
router.register(r'api/proposals', ProposalUtilityViewSet, basename='proposal')
router.register(r'api/webhooks/project', ProjectWebhookViewSet, basename='webhook')

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('', include(router.urls)),
]
