from rest_framework import serializers
from .models import Project, ProposalUtility

class ProjectSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'address', 'consumption',
            'percentage', 'created_at', 'updated_at', 'selected_rate'
        ]
        read_only_fields = ['created_at', 'updated_at', 'selected_rate']

class ProposalUtilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProposalUtility
        fields = [
            'id', 'project', 'openei_id', 'rate_name',
            'pricing_matrix', 'average_rate', 'first_year_cost'
        ]
