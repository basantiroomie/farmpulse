
# Cattle Health Monitoring Backend

This is the backend server for the Cattle Health Monitoring system. It provides a REST API for accessing and managing animal health data.

## Setup

1. Make sure Node.js is installed on your system
2. Navigate to the project root directory
3. Start the backend server:

```bash
node src/backend/start-server.js
```

## API Endpoints

- `GET /api/animals` - Get all animals
- `GET /api/animals/:id` - Get a specific animal by ID
- `GET /api/animals/:id/health` - Get health data for a specific animal
- `GET /api/animals/:id/pregnancy` - Get pregnancy data for a specific animal
- `GET /api/animals/:id/all-data` - Get all data for a specific animal

## Database

The system uses SQLite for data storage. The database file is created at `src/backend/db/data/cattle_health.db`.

## Sample Animals

The system is pre-populated with three sample animals:
- A12345 - Daisy (Holstein, Female) - showing signs of infection
- A12346 - Bella (Jersey, Female) - healthy
- A12347 - Max (Angus, Male) - showing mild health concerns
