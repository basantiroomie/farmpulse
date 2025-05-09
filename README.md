# FarmPulse: IoT Cattle Health Monitoring System

![FarmPulse Logo](./src/assets/farmpulse-logo.svg)

FarmPulse is an advanced IoT-based cattle health monitoring system that enables real-time tracking of vital health metrics, early detection of health issues, and specialized monitoring for pregnant cattle. The system uses wearable IoT sensors to collect data, with a central dashboard providing real-time visualization and alerts.

## Table of Contents
- [System Architecture](#system-architecture)
- [Features](#features)
- [Health Metrics](#health-metrics)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [Usage](#usage)
  - [Dashboard](#dashboard)
  - [Cattle Management](#cattle-management)
  - [Alert Systems](#alert-systems)
  - [Reports](#reports)
- [ESP32 Simulation](#esp32-simulation)
  - [Basic Usage](#basic-usage)
  - [Simulation Scenarios](#simulation-scenarios)
  - [Custom Configurations](#custom-configurations)
  - [Data Logging](#data-logging)
- [API Reference](#api-reference)
- [Dependencies](#dependencies)
- [License](#license)

## System Architecture

FarmPulse is built using a modern tech stack with a focus on real-time data processing and visualization:

```
┌─────────────┐      ┌──────────────┐      ┌────────────────┐
│ ESP32 IoT   │      │              │      │                │
│ Sensors     │◄────►│  WebSocket   │◄────►│  Web Frontend  │
│             │      │  Server      │      │  (React/Vite)  │
└─────────────┘      │              │      │                │
                     └──────┬───────┘      └────────────────┘
                            │
                     ┌──────▼───────┐      ┌────────────────┐
                     │              │      │                │
                     │  Express.js  │◄────►│  MongoDB       │
                     │  Backend     │      │  (Device Reg.) │
                     │              │      │                │
                     └──────┬───────┘      └────────────────┘
                            │
                     ┌──────▼───────┐      ┌────────────────┐
                     │              │      │                │
                     │  Anomaly     │◄────►│  InfluxDB      │
                     │  Detection   │      │  (Time Series) │
                     │              │      │                │
                     └──────────────┘      └────────────────┘
```

- **ESP32 IoT Sensors**: Wearable devices attached to cattle to collect health metrics
- **WebSocket Server**: Provides real-time bidirectional communication between sensors and frontend
- **Express.js Backend**: RESTful API for data access and management
- **MongoDB**: Stores device registration, animal records, and user data
- **InfluxDB**: Time-series database for storing sensor readings
- **Anomaly Detection**: Machine learning algorithms to identify potential health issues
- **Web Frontend**: React application with real-time dashboard for monitoring cattle health

## Features

- **Real-time Health Monitoring**: Track temperature, heart rate, activity levels, and more in real-time
- **Fetal Monitoring**: Specialized tracking for pregnant cattle with fetal heart rate monitoring
- **Anomaly Detection**: AI-powered analysis to identify potential health issues before they become critical
- **Mobile-Friendly Dashboard**: Access data from anywhere on any device
- **Alert System**: Receive notifications for anomalies or concerning health trends
- **Historical Data Analysis**: View trends and patterns in health metrics over time
- **Herd Management**: Track entire herds and individual animals with detailed profiles
- **ROI Calculator**: Estimate cost savings from implementing the FarmPulse system

## Health Metrics

FarmPulse monitors the following key health metrics:

| Metric             | Normal Range       | Warning Range      | Critical Range    |
|--------------------|--------------------|--------------------|--------------------|
| Temperature        | 38.0°C - 39.0°C    | 39.1°C - 40.0°C    | >40.0°C or <38.0°C |
| Heart Rate         | 60 - 80 bpm        | 81 - 90 bpm        | >90 bpm or <60 bpm |
| Activity Level     | 7 - 10 (scale)     | 4 - 6.9 (scale)    | <4 (scale)         |
| Fetal Heart Rate*  | 160 - 200 bpm      | 150 - 160 bpm      | >200 bpm or <150 bpm |

*For pregnant cattle only

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (v4.4 or higher)
- InfluxDB (v2.0 or higher)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd farmpulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/farmpulse
   INFLUXDB_URL=http://localhost:8086
   INFLUXDB_TOKEN=your_influx_token
   INFLUXDB_ORG=your_organization
   INFLUXDB_BUCKET=farmpulse
   DEVICE_API_KEY=your_default_device_key
   ```

4. Start the backend server:
   ```bash
   npm run backend
   ```

### Frontend Setup

1. In a new terminal, start the frontend development server:
   ```bash
   npm run dev
   ```

2. Access the frontend at:
   ```
   http://localhost:5173
   ```

### Database Setup

1. Start MongoDB:
   ```bash
   mongod --dbpath /path/to/data/directory
   ```

2. Start InfluxDB (according to your installation method)

3. The application will automatically create required database structures at startup

## Usage

### Dashboard

The main dashboard provides a comprehensive overview of your herd's health:

1. Navigate to `http://localhost:5173/dashboard` in your browser
2. Select an animal from the dropdown menu to view detailed metrics
3. Monitor real-time health data including temperature, heart rate, and activity level
4. View alerts and notifications for any concerning health trends

### Cattle Management

Add and manage cattle in your herd:

1. Navigate to `http://localhost:5173/admin`
2. Click on "Animal Management" 
3. Use the "Add Animal" button to register new cattle
4. Fill in details including ID, name, breed, date of birth, and gender

### Alert Systems

Configure alerts for health anomalies:

1. Navigate to `http://localhost:5173/admin`
2. Click on "Alert Configuration"
3. Set threshold values for temperature, heart rate, activity, and fetal heart rate
4. Configure notification methods (dashboard, email, SMS)

### Reports

Generate and view reports on herd health:

1. Navigate to `http://localhost:5173/admin`
2. Click on "Reports"
3. Select report type, date range, and animals to include
4. Export reports in CSV or PDF format

## ESP32 Simulation

For testing without physical IoT devices, FarmPulse includes an ESP32 simulation tool.

### Basic Usage

1. Open a terminal and navigate to the project directory
2. Run the simulator:
   ```bash
   npm run simulate
   ```
   or directly:
   ```bash
   node src/backend/tools/enhancedSimulateData.js
   ```

3. From the main menu, select "Configure simulation" to set up your simulation parameters
4. Select "Start simulation" to begin sending simulated sensor data

### Simulation Scenarios

The simulator includes several pre-configured scenarios:

- **Normal**: Simulates a healthy animal with normal vital signs
- **Fever**: Simulates an animal with elevated temperature and heart rate
- **Low Activity**: Simulates an animal with reduced movement/activity
- **High Heart Rate**: Simulates an animal with an elevated heart rate
- **Custom**: Configure your own custom values for all metrics

### Custom Configurations

Customize the simulation with the following options:

- **Connection Settings**: Configure WebSocket URL, device ID, API key, and data interval
- **Sensor Settings**: Select which sensors to simulate (temperature, activity, heart rate, etc.)
- **Scenario Settings**: Choose from preset scenarios or configure custom values
- **Output Settings**: Configure logging level and data export options

### Data Logging

The simulator can log data to JSON files for later analysis:

1. From the main menu, select "Configure simulation" then "Output Settings"
2. Enable "Save Data to File"
3. Start the simulation
4. Data will be saved in `src/backend/tools/logs/` directory

## API Reference

### WebSocket API

The WebSocket server accepts connections at:
```
ws://localhost:3001
```

Query parameters:
- `type`: Client type (`dashboard` or `device` or `simulator`)
- `deviceId`: ID of the connecting device (for device connections)
- `apiKey`: API key for authentication (for device connections)
- `animalId`: Animal ID to monitor (for dashboard connections)

Message types:
- `sensorData`: Contains sensor readings
- `connection`: Connection status
- `error`: Error message
- `simulationStatus`: Simulation status

### REST API

The backend provides the following REST endpoints:

#### Animals

- `GET /api/animals`: Get all animals
- `GET /api/animals/:id`: Get a specific animal
- `POST /api/animals`: Create a new animal
- `PUT /api/animals/:id`: Update an animal
- `DELETE /api/animals/:id`: Delete an animal

#### Health Data

- `GET /api/animals/:id/health`: Get health data for a specific animal
- `GET /api/animals/:id/pregnancy`: Get pregnancy data for a specific animal
- `GET /api/animals/:id/pregnancy-stats`: Get pregnancy statistics for a specific animal
- `GET /api/animals/:id/all-data`: Get all data for a specific animal

#### Devices

- `GET /api/devices`: Get all registered devices
- `POST /api/devices`: Register a new device
- `PUT /api/devices/:id`: Update a device
- `DELETE /api/devices/:id`: Delete a device

## Dependencies

### Backend
- Express.js: Web server framework
- WebSocket: Real-time communication
- InfluxDB Client: Time-series database client
- MongoDB: Document database
- Better-SQLite3: Local database for testing
- Dotenv: Environment variable management

### Frontend
- React: UI library
- Vite: Build tool
- TypeScript: Type-safe JavaScript
- Tailwind CSS: Utility-first CSS framework
- shadcn/ui: UI component library
- Recharts: Charting library
- React Router: Client-side routing

## License

This project is licensed under the MIT License - see the LICENSE file for details.
