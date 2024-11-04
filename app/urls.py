
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ProposalUtilityViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'proposals', ProposalUtilityViewSet, basename='proposal')

urlpatterns = router.urls
