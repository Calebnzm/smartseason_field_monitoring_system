from django.contrib import admin
from .models import Field, FieldUpdate, FieldSatelliteData

@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ('name', 'crop_type', 'stage', 'status', 'assigned_agent', 'created_by')
    list_filter = ('stage', 'status', 'crop_type')
    search_fields = ('name', 'crop_type')

@admin.register(FieldUpdate)
class FieldUpdateAdmin(admin.ModelAdmin):
    list_display = ('field', 'author', 'stage', 'created_at')
    list_filter = ('stage',)
    
@admin.register(FieldSatelliteData)
class FieldSatelliteDataAdmin(admin.ModelAdmin):
    list_display = ('field', 'ndvi', 'ndwi', 'fetched_at')
