from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HomeView, ProjectViewSet, ProposalUtilityViewSet

router = DefaultRouter()
router.register(r'api/projects', ProjectViewSet, basename='project')
router.register(r'api/proposals', ProposalUtilityViewSet, basename='proposal')

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('', include(router.urls)),
]
