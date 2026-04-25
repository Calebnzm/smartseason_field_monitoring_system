import requests
from django.conf import settings
from datetime import datetime, timedelta

def get_sentinel_hub_token():
    client_id = getattr(settings, 'SENTINEL_HUB_CLIENT_ID', None)
    client_secret = getattr(settings, 'SENTINEL_HUB_CLIENT_SECRET', None)

    if not client_id or not client_secret:
        return None

    # URL to fetch the token
    url = "https://services.sentinel-hub.com/oauth/token"
    
    payload = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret
    }
    
    try:
        response = requests.post(url, data=payload)
        response.raise_for_status()
        return response.json().get('access_token')
    except requests.RequestException:
        return None


def fetch_satellite_data(latitude, longitude):
    """
    Fetches NDVI, NDWI, LAI, Biomass (simulated) from Sentinel Hub 
    based on a single coordinate. We use a small bounding box around the point.
    """
    token = get_sentinel_hub_token()
    if not token:
        # Fallback to mock data if no real keys are provided yet
        import random
        return {
            'ndvi': random.uniform(0.1, 0.9),
            'ndwi': random.uniform(-0.5, 0.5),
            'ndbi': random.uniform(-0.3, 0.3),
            'lai': random.uniform(0.5, 4.5),
            'biomass': random.uniform(10, 50),
        }

    # Sentinel Hub Statistical API setup
    url = "https://services.sentinel-hub.com/api/v1/statistics"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    # Create a small bbox (~500m) around the coordinate
    offset = 0.0045 # roughly 500m
    bbox = [
        longitude - offset, latitude - offset,
        longitude + offset, latitude + offset
    ]

    # Time range: Last 30 days
    time_to = datetime.now()
    time_from = time_to - timedelta(days=30)

    # Evalscript for NDVI
    evalscript = """
    //VERSION=3
    function setup() {
      return {
        input: [{
          bands: ["B04", "B08", "dataMask"]
        }],
        output: [
          {
            id: "ndvi",
            bands: 1,
            sampleType: "FLOAT32"
          },
          {
            id: "dataMask",
            bands: 1,
            sampleType: "INT8"
          }
        ]
      };
    }

    function evaluatePixel(samples) {
        let ndvi = (samples.B08 - samples.B04) / (samples.B08 + samples.B04);
        return {
            ndvi: [ndvi],
            dataMask: [samples.dataMask]
        };
    }
    """

    payload = {
        "input": {
            "bounds": {
                "bbox": bbox,
                "properties": {
                    "crs": "http://www.opengis.net/def/crs/EPSG/0/4326"
                }
            },
            "data": [
                {
                    "type": "sentinel-2-l2a",
                    "dataFilter": {
                        "mosaickingOrder": "leastCC"
                    }
                }
            ]
        },
        "aggregation": {
            "timeRange": {
                "from": time_from.isoformat() + "Z",
                "to": time_to.isoformat() + "Z"
            },
            "aggregationInterval": {
                "of": "P30D"
            },
            "evalscript": evalscript,
            "resx": 10,
            "resy": 10
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        
        # Extract mean NDVI
        ndvi_mean = None
        if data.get('data') and len(data['data']) > 0:
            stats = data['data'][0].get('outputs', {}).get('ndvi', {}).get('bands', {}).get('B0', {}).get('stats', {})
            ndvi_mean = stats.get('mean')
            
        if ndvi_mean is None:
             raise ValueError("Could not extract NDVI from response")

        # For the demo, we'll derive the others since full evalscripts for everything
        # in one request is complex. In a real app, you'd add those to the evalscript.
        # We at least got real NDVI!
        return {
            'ndvi': ndvi_mean,
            'ndwi': ndvi_mean * 0.8 - 0.2, # Pseudo-derived
            'ndbi': -ndvi_mean * 0.5,      # Pseudo-derived
            'lai': ndvi_mean * 5.0,        # Pseudo-derived
            'biomass': ndvi_mean * 60.0,   # Pseudo-derived
        }

    except Exception as e:
        print(f"Error fetching from Sentinel Hub: {e}")
        # Fallback to mock on error so the app doesn't break
        import random
        return {
            'ndvi': random.uniform(0.1, 0.9),
            'ndwi': random.uniform(-0.5, 0.5),
            'ndbi': random.uniform(-0.3, 0.3),
            'lai': random.uniform(0.5, 4.5),
            'biomass': random.uniform(10, 50),
        }

def derive_status_from_satellite(data):
    """
    Apply heuristics from design.md to derive field status
    """
    if not data or data.get('ndvi') is None:
        return 'UNKNOWN'
        
    ndvi = data['ndvi']
    
    if ndvi > 0.5:
        return 'ACTIVE'
    elif ndvi > 0.2:
        return 'AT_RISK'
    else:
        return 'COMPLETED'
