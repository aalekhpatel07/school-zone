from typing import Optional, Dict
from dataclasses import dataclass
from fastapi import FastAPI
from py2neo.pep249 import connect
from datetime import datetime, date
import logging


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()


NEO4J_AUTH_USER = "neo4j"
NEO4J_AUTH_PASS = "test"
NEO4J_HOST_BOLT = "bolt://beast:7687"

SCHOOL_ZONE_LAYER_NAME = "geo_export_3527abaf-6650-4a1e-964f-31a0968ab530"

con = connect(NEO4J_HOST_BOLT, auth=(NEO4J_AUTH_USER, NEO4J_AUTH_PASS))


def build_query(latitude: float, longitude: float, distanceInKm: float = 0.6):
    """Build the cypher query of school zones around a coordinate.
    """
    return f"CALL spatial.withinDistance('{SCHOOL_ZONE_LAYER_NAME}', {{ latitude: {latitude: .8f}, longitude: {longitude: .8f} }}, {distanceInKm: .8f})"


@dataclass
class SchoolZone:
    """A representation of a school zone provided by the Open Data APIs Winnipeg."""
    school: str
    ID: int
    speedLimit: int
    legislationLink: str
    street: str
    effective_time: str
    effective_days: str
    effective_months: str
    is_active: bool
    reasons: Optional[Dict[str, str]]
    distance: float


@dataclass
class LatLonTime:
    latitude: float
    longitude: float
    timestamp: float


app = FastAPI()


@app.get("/", response_model=SchoolZone, tags=["school zone"], summary="Search for school zones.", response_description="The closest School Zone")
async def get_closest_school_zone(latitude: float, longitude: float, radiusInKm: float = 0.1) -> SchoolZone:
    """
    Get the closest school to given coordinates.
    
    - **latitude**: The latitude of the coordinate of interest.
    - **longitude**: The longitude of the coordinate of interest.
    - **radiusInKm**: The radius (in km) of search around the coordinate of interest.

    """
    cursor = con.cursor()
    # query = build_query(49.8811024983, -97.1492558726592)
    query = build_query(latitude, longitude, distanceInKm=radiusInKm)
    result = cursor.execute(query).fetchone()

    if result is None:
        return None
    result, distance = result[0][2], float(result[1])
    logging.debug("distance: %.4f , result: %s", result, distance)
    
    effective_time = result['effectiv_2']
    effective_days, effective_months = result['effective_'].split(' ')
    
    is_active = True
    reasons = dict()

    # Skip Saturdays and Sundays.
    if date.today().weekday() in (5, 6):
        is_active = False
        reasons['out_of_effective_days_range'] = "Invalid during weekends."
    
    # Skip months outside June-Sept.
    if date.today().month not in (5, 6, 7, 8):
        is_active = False
        reasons['out_of_effective_month_range'] = "Invalid if not from June, July, August, or September."
    
    # Skip time outside 07:00-17:30
    current_time = datetime.now()
    
    if current_time.hour < 7 or current_time.hour > 17.5:
        is_active = False
        reasons['out_of_effective_time_range'] = "Invalid outside 07:00 - 17:30."


    return SchoolZone(
            school=result['school'], 
            ID = result['ID'], 
            speedLimit = result['speed_limi'], 
            legislationLink = result['legislatio'],
            street=result['street_nam'],
            effective_time = effective_time,
            effective_days = effective_days,
            effective_months = effective_months,
            is_active = is_active,
            reasons=reasons,
            distance=distance
        )

