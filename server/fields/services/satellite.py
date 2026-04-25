import random

def fetch_satellite_data(latitude, longitude):
    """
    Mock function that generates random NDVI and NDWI values.
    """
    return {
        'ndvi': random.uniform(0.1, 0.9),
        'ndwi': random.uniform(-0.5, 0.5),
    }

def derive_status_from_satellite(data):
    """
    Apply heuristics from design.md to derive field status
    """
    if not data or data.get('ndvi') is None or data.get('ndwi') is None:
        return 'UNKNOWN'
        
    ndvi = data['ndvi']
    ndwi = data['ndwi']
    
    if ndvi < 0.2:
        return 'COMPLETED'
    
    # If NDVI >= 0.2, the field is active, let's check for water stress
    if ndwi < -0.1:
        return 'WATER_STRESSED'
    else:
        return 'ACTIVE'
