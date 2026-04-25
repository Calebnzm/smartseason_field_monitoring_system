from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import Field, FieldUpdate, FieldSatelliteData
from .serializers import FieldSerializer, FieldUpdateSerializer, FieldAssignSerializer
from .permissions import IsAdminOrAssignedAgent
from .services.satellite import fetch_satellite_data, derive_status_from_satellite

User = get_user_model()


class FieldViewSet(viewsets.ModelViewSet):
    serializer_class = FieldSerializer
    permission_classes = [IsAdminOrAssignedAgent]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return Field.objects.all()
        # Agents only see their assigned fields
        return Field.objects.filter(assigned_agent=user)

    def perform_create(self, serializer):
        # Save the field first
        field = serializer.save(created_by=self.request.user)

        # Fetch satellite data and derive status immediately
        sat_data = fetch_satellite_data(field.latitude, field.longitude)
        
        derived_status = derive_status_from_satellite(sat_data)
        
        # Save satellite data
        FieldSatelliteData.objects.create(
            field=field,
            **sat_data
        )

        # Update field with derived status
        field.status = derived_status
        field.save(update_fields=['status'])


    @action(detail=True, methods=['post'], permission_classes=[])
    def assign(self, request, pk=None):
        """
        Admins can assign a field to an agent
        """
        if not (request.user.is_superuser or request.user.role == 'ADMIN'):
            return Response(
                {"detail": "Only admins can assign fields."},
                status=status.HTTP_403_FORBIDDEN
            )

        field = self.get_object()
        serializer = FieldAssignSerializer(data=request.data)
        
        if serializer.is_valid():
            agent_id = serializer.validated_data['agent_id']
            try:
                agent = User.objects.get(id=agent_id, role='AGENT')
                field.assigned_agent = agent
                field.save(update_fields=['assigned_agent', 'updated_at'])
                return Response({'status': 'Field assigned successfully'})
            except User.DoesNotExist:
                return Response(
                    {'error': 'Agent not found or user is not an agent'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=['get', 'post'])
    def updates(self, request, pk=None):
        """
        Get or add updates to a specific field.
        """
        field = self.get_object()

        if request.method == 'GET':
            updates = field.updates.all().order_by('-created_at')
            serializer = FieldUpdateSerializer(updates, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            serializer = FieldUpdateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(field=field, author=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
