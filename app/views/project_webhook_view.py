import logging
import requests
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.db import transaction

from ..models import Project
from ..serializers import ProjectSerializer

logger = logging.getLogger(__name__)

class ProjectWebhookHandler:
    """Handles webhook notifications for project events"""

    def __init__(self):
        self.webhook_url = settings.WEBHOOK_URL
        if not self.webhook_url:
            raise ValueError("WEBHOOK_URL setting is not configured")

    def notify(self, event_type, project_data):
        """
        Send webhook notification for project events

        Args:
            event_type (str): Type of event (e.g., 'project.created', 'project.updated')
            project_data (dict): Project data to send in webhook
        """
        try:
            payload = {
                'event': event_type,
                'project': project_data
            }

            logger.info(f"Sending webhook to {self.webhook_url} with payload: {payload}")

            response = requests.post(
                self.webhook_url,
                json=payload,
                headers={'Content-Type': 'application/json'}
            )

            logger.info(f"Webhook response status: {response.status_code}")
            logger.info(f"Webhook response content: {response.text}")

            if not response.ok:
                logger.error(
                    f"Webhook delivery failed: {response.status_code} - {response.text}"
                )

            return response.ok

        except Exception as e:
            logger.error(f"Error sending webhook: {str(e)}", exc_info=True)
            return False

class ProjectWebhookViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Project instances.
    Provides CRUD operations with webhook notifications.
    """
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.webhook_handler = ProjectWebhookHandler()

    def get_queryset(self):
        """Filter queryset to return only the authenticated user's projects"""
        return Project.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Create a new project and send webhook notification"""
        try:
            with transaction.atomic():
                # Save the project
                project = serializer.save(user=self.request.user)
                logger.info(f"Created project for user {self.request.user.username}")

                # Prepare webhook data
                project_data = {
                    'id': project.id,
                    'user_id': self.request.user.id,
                    'name': project.name,
                    'address': project.address,
                    'consumption': project.consumption,
                    'percentage': project.percentage,
                    'description': project.description
                }

                # Send webhook notification
                webhook_success = self.webhook_handler.notify('project.created', project_data)

                if not webhook_success:
                    logger.warning(f"Webhook delivery failed for project {project.id}")

        except Exception as e:
            logger.error(f"Error creating project: {str(e)}")
            raise

    def perform_update(self, serializer):
        """Update project and send webhook notification"""
        try:
            with transaction.atomic():
                project = serializer.save()
                logger.info(f"Updated project {project.id}")

                # Prepare webhook data
                project_data = {
                    'id': project.id,
                    'user_id': self.request.user.id,
                    'name': project.name,
                    'address': project.address,
                    'consumption': project.consumption,
                    'percentage': project.percentage,
                    'description': project.description,
                    'selected_rate': project.selected_rate
                }

                # Send webhook notification
                webhook_success = self.webhook_handler.notify('project.updated', project_data)

                if not webhook_success:
                    logger.warning(f"Webhook delivery failed for project {project.id}")

        except Exception as e:
            logger.error(f"Error updating project: {str(e)}")
            raise

    def perform_destroy(self, instance):
        """Delete project and send webhook notification"""
        try:
            project_data = {
                'id': instance.id,
                'user_id': self.request.user.id
            }

            # Send webhook notification before deletion
            webhook_success = self.webhook_handler.notify('project.deleted', project_data)

            if not webhook_success:
                logger.warning(f"Webhook delivery failed for project {instance.id}")

            instance.delete()
            logger.info(f"Deleted project {instance.id}")

        except Exception as e:
            logger.error(f"Error deleting project: {str(e)}")
            raise

    @action(detail=True, methods=['post'])
    def notify_update(self):
        """
        Manual trigger for sending webhook notifications
        Useful for testing or resending failed notifications
        """
        project = self.get_object()

        try:
            project_data = {
                'id': project.id,
                'user_id': self.request.user.id,
                'name': project.name,
                'address': project.address,
                'consumption': project.consumption,
                'percentage': project.percentage,
                'description': project.description,
                'selected_rate': project.selected_rate
            }

            webhook_success = self.webhook_handler.notify('project.updated', project_data)

            return Response({
                'success': webhook_success,
                'message': 'Webhook notification sent' if webhook_success else 'Webhook delivery failed'
            }, status=status.HTTP_200_OK if webhook_success else status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Error sending webhook notification: {str(e)}")
            return Response(
                {'error': 'Failed to send webhook notification'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
