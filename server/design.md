## Auth System
Supported Roles: Admin, Agent
Role responsibilities:
    Agent: Create Fields, Manage Field, updating the stage of a field, Adding notes to fields
    Admin: View all fields, monitor updates across agents(view all updates and take action on them), assign a field to an agent



## Core Business Logic
Creating and Managing Fields:
1. Create a field: using location(gps tracking to get field location, and bouding box): can be done by anyone admin, superuser, and agent: a field must have at minimum: Name, croptype, planting date, and current state(planted, growing, ready, harvested at minimum further stages can be added)
2. Assign a field to an agent: must be done by an admin
3. Add updates to the field: update stage of the field, add notes and observations to the field: updates can be added by anyone, however, agents only have access to their assigned fields
4. Associate a field status based on data (derive status based on biophysical indicators, NDVI, NDWI, LAI, BioMass): once field is added, fetch data from satellite data provider, to derive NDVI, NDWI, and NDBI, LAI, Biomass, to determine the status/health of the field (Active (if plants still on the field), At risk (high water stress), Completed(no crops on field) and many others based on heursistics)
