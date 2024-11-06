import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.conf import settings

from ..models import Project, ProposalUtility
from ..serializers import ProjectSerializer, ProposalUtilitySerializer
from ..services.rate_calculator import RateCalculator
from ..services.rate_provider import RateProvider
from ..services.rate_processor import RateProcessor

logger = logging.getLogger(__name__)

class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Project instances.
    Provides CRUD operations and custom actions for rate calculations.
    """
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter queryset to return only the authenticated user's projects"""
        return Project.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Create a new project associated with the current user"""
        try:
            with transaction.atomic():
                serializer.save(user=self.request.user)
                logger.info(f"Created project for user {self.request.user.username}")
        except Exception as e:
            logger.error(f"Error creating project: {str(e)}")
            raise

    @action(detail=True, methods=['post'])
    def calculate_rates(self, request, pk=None):
        """
        Calculate utility rates for a project based on its address
        and consumption data
        """
        project = self.get_object()

        try:
            # Initialize providers and calculators
            rate_provider = RateProvider(api_key=settings.OPENEI_API_KEY)
            rate_processor = RateProcessor()
            rate_calculator = RateCalculator()

            # Fetch and process rates
            raw_rates = rate_provider.get_utility_rates(project.address)
            processed_rates = rate_processor.process_rate_data(raw_rates)

            # Calculate costs for each rate
            results = []
            for rate in processed_rates:
                yearly_costs = rate_calculator.calculate_yearly_cost(
                    rate_info=rate,
                    yearly_consumption=project.consumption,
                    escalator=project.percentage
                )

                results.append({
                    'rate_name': rate['name'],
                    'utility': rate['utility'],
                    'avg_rate': rate['avg_rate'],
                    'first_year_cost': yearly_costs[0],
                    'yearly_projection': yearly_costs
                })

            return Response(results, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error calculating rates for project {pk}: {str(e)}")
            return Response(
                {"error": "Failed to calculate utility rates"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def select_rate(self, request, pk=None):
        """
        Select a specific utility rate and create/update the associated
        ProposalUtility instance
        """
        project = self.get_object()
        rate_data = request.data

        try:
            with transaction.atomic():
                # Update project with selected rate
                project.selected_rate = rate_data.get('rate_name', '')
                project.save()

                # Create or update proposal
                proposal_data = {
                    'project': project,
                    'openei_id': rate_data.get('label', ''),
                    'rate_name': rate_data.get('rate_name', ''),
                    'average_rate': rate_data.get('avg_rate', 0.0),
                    'first_year_cost': rate_data.get('first_year_cost', 0.0),
                    'pricing_matrix': rate_data.get('yearly_projection', [])
                }

                proposal, created = ProposalUtility.objects.update_or_create(
                    project=project,
                    defaults=proposal_data
                )

                serializer = ProposalUtilitySerializer(proposal)
                return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error selecting rate for project {pk}: {str(e)}")
            return Response(
                {"error": "Failed to select utility rate"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
