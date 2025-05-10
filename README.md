# FarmPulse: IoT Cattle Health Monitoring System

![FarmPulse Logo](./src/assets/farmpulse-logo.svg)

FarmPulse is an advanced IoT-based cattle health monitoring system that enables real-time tracking of vital health metrics, early detection of health issues, and specialized monitoring for pregnant cattle. The system uses wearable IoT sensors and ESP32 devices to collect data, with a central dashboard providing real-time visualization and alerts.

## Table of Contents
- [System Overview](#system-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Installation Steps](#installation-steps)
- [Usage Guide](#usage-guide)
  - [Dashboard](#dashboard)
  - [Real-time Monitoring](#real-time-monitoring)
  - [Simulation Tools](#simulation-tools)
- [WebSocket Connection](#websocket-connection)
- [ESP32 Integration](#esp32-integration)
  - [Hardware Setup](#hardware-setup)
  - [Device Registration](#device-registration)
- [Anomaly Detection](#anomaly-detection)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Available Scripts](#available-scripts)
- [License](#license)

## System Overview

FarmPulse revolutionizes cattle health monitoring by providing:

- **Real-time health tracking**: Monitor temperature, heart rate, activity levels, and other vital parameters
- **Pregnancy monitoring**: Special features for monitoring pregnant cattle including fetal heart rate
- **Anomaly detection**: AI-powered early warning system for health issues
- **WebSocket communication**: Real-time data flow from sensors to dashboard
- **Simulation capabilities**: Test the system without physical sensors

The system consists of:
1. **ESP32 sensors** (or simulator): Collect and transmit animal health data
2. **Backend server**: Process incoming sensor data and manage WebSocket connections
3. **Frontend dashboard**: Real-time visualization of health metrics and alerts
4. **Database systems**: Store and retrieve historical data

## Key Features

- **Live Sensor Data Display**: Real-time visualization of temperature, heart rate, activity level, and more
- **Anomaly Detection**: AI-powered analysis to flag potential health issues
- **Pregnancy Monitoring**: Special tracking for pregnant cattle, including fetal heart rate
- **Simulation Tools**: Built-in data simulation for testing and demonstration
- **WebSocket Communication**: Persistent connections for instant data updates
- **Multi-animal Support**: Monitor multiple animals simultaneously
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- **React**: UI framework
- **Vite**: Build tool and development server
- **TypeScript**: Type-safe JavaScript
- **ShadCN/UI**: UI component library
- **Lucide React**: Icons
- **Tailwind CSS**: Utility-first CSS framework

### Backend
- **Node.js**: Runtime environment
- **Express**: Web server framework
- **WebSocket**: Real-time communication
- **SQLite/MongoDB**: Data storage (configurable)
- **InfluxDB**: Time-series data storage

### IoT/Hardware
- **ESP32**: Microcontroller for sensor data collection
- **DHT11**: Temperature and humidity sensor
- **MPU6050**: Accelerometer for activity monitoring
- **Simulation tools**: Software for testing without physical hardware

## System Architecture

FarmPulse employs a modern, real-time architecture:

```
┌─────────────┐      ┌──────────────┐      ┌────────────────┐
│ ESP32 IoT   │      │              │      │                │
│ Sensors     │◄────►│  WebSocket   │◄────►│  Web Frontend  │
│ (or Sim)    │      │  Server      │      │  (React/Vite)  │
└─────────────┘      │              │      │                │
                     └──────┬───────┘      └────────────────┘
                            │
                     ┌──────▼───────┐      ┌────────────────┐
                     │              │      │                │
                     │  Express.js  │◄────►│  MongoDB/      │
                     │  Backend     │      │  SQLite        │
                     │              │      │                │
                     └──────┬───────┘      └────────────────┘
                            │
                     ┌──────▼───────┐      ┌────────────────┐
                     │              │      │                │
                     │  Anomaly     │◄────►│  InfluxDB      │
                     │  Detection   │      │  (Time Series) │
```

## Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **Git**
- **MongoDB** (optional, SQLite is used by default)
- **InfluxDB** (optional for time-series data)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/farmpulse.git
   cd farmpulse
   ```

2. Create a `.env` file in the root directory:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/farmpulse
   INFLUXDB_URL=http://localhost:8086
   INFLUXDB_TOKEN=my-super-secret-auth-token
   INFLUXDB_ORG=farmpulse
   INFLUXDB_BUCKET=iot_sensors
   USE_SQLITE=true
   ```

   > **Note**: Setting `USE_SQLITE=true` allows the application to run without MongoDB.

### Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the backend server**:
   ```bash
   npm run backend
   ```
   Look for output confirming WebSocket initialization:
   ```
   WebSocket server initialized on port 3001
   WebSocket path: ws://localhost:3001
   ```

3. **Start the frontend development server** (in a new terminal):
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to the URL shown in the terminal (usually http://localhost:8080)

## Usage Guide

### Dashboard

1. Navigate to http://localhost:8080 in your web browser
2. Select an animal from the dropdown menu (default samples: A12345, A12346, A12347)
3. View real-time sensor data in the dashboard

### Real-time Monitoring

The dashboard displays:

- **Temperature**: Current body temperature in Celsius
- **Heart Rate**: Beats per minute (BPM)
- **Activity Level**: Scale from 0-10 showing movement intensity
- **Humidity**: Environmental humidity percentage
- **Fetal Heart Rate**: For pregnant cattle
- **Audio Level**: Environmental sound detection

### Simulation Tools

FarmPulse includes a powerful simulator to test without physical hardware:

1. **Start the simulator**:
   ```bash
   npm run simulate:enhanced
   ```

2. **Configure simulation settings**:
   - WebSocket URL: ws://localhost:3001
   - Device ID: DEV-SIMULATOR (or any custom ID)
   - API Key: (use default)
   - Animal ID: CATTLE001 (or any ID in your system)
   - Data interval: 5000 (5 seconds)

3. **Select sensors to simulate**:
   - DHT11 (temperature/humidity)
   - MPU6050 (movement/activity)
   - HEALTH (vital signs)
   - PREGNANCY (fetal monitoring) - for pregnant cattle

4. **Choose simulation scenario**:
   - Normal: Baseline healthy readings
   - Fever: Elevated temperature
   - Distress: Abnormal vital signs
   - Low Activity: Reduced movement
   - Custom: Define your own parameters

## WebSocket Connection

FarmPulse uses WebSockets for real-time data communication. The system is configured to use:

- **Backend WebSocket Server**: ws://localhost:3001
- **Client Connection**: Direct connection from frontend to backend
- **Connection Types**:
  - Dashboard clients: `?type=dashboard&animalId=ANIMAL_ID`
  - Device/simulator clients: `?type=device&deviceId=DEVICE_ID&apiKey=API_KEY`

### Testing WebSocket Connection

Use the built-in WebSocket testing tool:
```bash
npm run test:ws
```

This tool helps diagnose connection issues between components.

## ESP32 Integration

### Hardware Setup

For physical ESP32 implementation:

1. **Required Components**:
   - ESP32 development board
   - DHT11 temperature sensor
   - MPU6050 accelerometer
   - Optional heart rate sensor
   - Power supply (battery for wearable use)

2. **ESP32 Firmware**:
   - Use the Arduino framework
   - Install required libraries (WiFi, WebSockets, DHT, etc.)
   - Configure to connect to your WiFi network
   - Set WebSocket URL to point to your server
   - Flash the firmware to the ESP32

### Device Registration

Each physical device needs to be registered:

1. Create a device in the system with a unique device ID
2. Associate the device with a specific animal
3. Generate an API key for authentication
4. Configure the ESP32 with these credentials

## Anomaly Detection

FarmPulse includes AI-powered anomaly detection:

- **Temperature Analysis**: Detects fever and hypothermia
- **Heart Rate Monitoring**: Alerts for tachycardia or bradycardia
- **Activity Analysis**: Identifies abnormal activity patterns
- **Pregnancy Monitoring**: Special algorithms for pregnant cattle

When an anomaly is detected, the system:

1. Displays an alert on the dashboard
2. Stores the anomaly in the database for review
3. Provides contextual information about the potential issue

## Troubleshooting

### Common Issues

#### WebSocket Connection Problems

- **Problem**: Dashboard shows "Disconnected"
- **Solution**: 
  1. Ensure backend server is running
  2. Check that WebSocket URL is configured correctly (`ws://localhost:3001`)
  3. Use `npm run test:ws` to diagnose connection issues

#### No Data Appearing

- **Problem**: Connected but no data shows
- **Solution**:
  1. Verify simulator is running and connected
  2. Ensure simulator and dashboard are using the same animal ID
  3. Check browser console for errors

#### Database Errors

- **Problem**: "Cannot connect to database" errors
- **Solution**:
  - For MongoDB issues: Ensure MongoDB is running or set `USE_SQLITE=true` in .env
  - For InfluxDB: Set up InfluxDB or the system will fall back to limited functionality

## Development

### Project Structure

```
farmpulse/
├── src/
│   ├── backend/            # Backend server code
│   │   ├── api/            # REST API routes
│   │   ├── db/             # Database configurations
│   │   ├── middleware/     # Auth and middleware
│   │   ├── ml/             # Anomaly detection and ML
│   │   ├── tools/          # Simulation and utilities
│   │   ├── utils/          # Helper functions
│   │   └── websocket/      # WebSocket server
│   ├── components/         # React components
│   │   ├── Dashboard/      # Dashboard components
│   │   └── ui/             # UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── pages/              # Page components
├── public/                 # Static assets
│   └── ...
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
└── README.md               # Project documentation
```

### Available Scripts

- `npm run dev`: Start frontend development server
- `npm run backend`: Start backend server
- `npm run start`: Start both frontend and backend
- `npm run build`: Build for production
- `npm run simulate`: Run basic simulator
- `npm run simulate:enhanced`: Run advanced simulator with scenarios
- `npm run test:ws`: Test WebSocket connectivity

## License

Copyright © 2025 FarmPulse Technologies

This project is licensed under the MIT License - see the LICENSE file for details.
