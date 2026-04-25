from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Field(models.Model):
    STAGE_CHOICES = [
        ('PLANTED', 'Planted'),
        ('GROWING', 'Growing'),
        ('READY', 'Ready to Harvest'),
        ('HARVESTED', 'Harvested'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('WATER_STRESSED', 'Water Stressed'),
        ('COMPLETED', 'Completed'),
        ('UNKNOWN', 'Unknown'),
    ]

    name = models.CharField(max_length=255)
    crop_type = models.CharField(max_length=100)
    planting_date = models.DateField()
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='PLANTED')

    latitude = models.FloatField()
    longitude = models.FloatField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UNKNOWN')

    assigned_agent = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='assigned_fields',
        limit_choices_to={'role': 'AGENT'},
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_fields',
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.crop_type})"


class FieldUpdate(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='updates')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='field_updates')
    stage = models.CharField(max_length=20, choices=Field.STAGE_CHOICES, blank=True, null=True)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Update on {self.field.name} by {self.author}"


class FieldSatelliteData(models.Model):
    field = models.OneToOneField(Field, on_delete=models.CASCADE, related_name='satellite_data')
    ndvi = models.FloatField(null=True, blank=True)
    ndwi = models.FloatField(null=True, blank=True)
    fetched_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Satellite data for {self.field.name}"
