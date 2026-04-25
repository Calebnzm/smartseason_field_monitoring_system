from rest_framework import serializers
from .models import Field, FieldUpdate, FieldSatelliteData
from users.serializers import AgentSerializer

class FieldSatelliteDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldSatelliteData
        fields = ['ndvi', 'ndwi', 'fetched_at']


class FieldUpdateSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = FieldUpdate
        fields = ['id', 'field', 'author', 'author_name', 'stage', 'note', 'created_at']
        read_only_fields = ['field', 'author', 'created_at']

    def get_author_name(self, obj):
        if obj.author:
            return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username
        return "Unknown"

    def create(self, validated_data):
        # When an update is created with a stage, we also update the field's stage
        update = super().create(validated_data)
        if update.stage:
            field = update.field
            field.stage = update.stage
            field.save(update_fields=['stage', 'updated_at'])
        return update


class FieldSerializer(serializers.ModelSerializer):
    satellite_data = FieldSatelliteDataSerializer(read_only=True)
    assigned_agent_details = AgentSerializer(source='assigned_agent', read_only=True)
    updates_count = serializers.SerializerMethodField()

    class Meta:
        model = Field
        fields = [
            'id', 'name', 'crop_type', 'planting_date', 'stage', 
            'latitude', 'longitude', 'status', 'assigned_agent', 
            'assigned_agent_details', 'created_by', 'created_at', 
            'updated_at', 'satellite_data', 'updates_count'
        ]
        read_only_fields = ['status', 'created_by', 'created_at', 'updated_at']

    def get_updates_count(self, obj):
        return obj.updates.count()


class FieldAssignSerializer(serializers.Serializer):
    agent_id = serializers.IntegerField(required=True)
