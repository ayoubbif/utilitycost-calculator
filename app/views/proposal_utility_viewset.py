import logging
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError

from ..models import Project, ProposalUtility
from ..serializers import ProposalUtilitySerializer

logger = logging.getLogger(__name__)

class ProposalUtilityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing ProposalUtility instances.
    Provides CRUD operations for utility proposals.
    """
    serializer_class = ProposalUtilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter queryset to return only proposals for the user's projects"""
        return ProposalUtility.objects.filter(project__user=self.request.user)

    def perform_create(self, serializer):
        """Create a new proposal, ensuring project ownership"""
        project_id = self.request.data.get('project')
        project = get_object_or_404(Project, id=project_id, user=self.request.user)
        try:
            serializer.save(project=project)
            logger.info(f"Created proposal for project {project_id}")
        except Exception as e:
            logger.error(f"Error creating proposal: {str(e)}")
            raise

    def perform_update(self, serializer):
        """Update proposal, ensuring project ownership"""
        instance = self.get_object()
        if instance.project.user != self.request.user:
            raise ValidationError("You don't have permission to update this proposal")
        try:
            serializer.save()
            logger.info(f"Updated proposal {instance.id}")
        except Exception as e:
            logger.error(f"Error updating proposal: {str(e)}")
            raise
