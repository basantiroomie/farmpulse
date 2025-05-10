# ESP32 Simulator Configuration Guide

This guide explains how to configure and use the ESP32 simulator to generate test data for the FarmPulse cattle health monitoring system.

## Overview

The ESP32 simulator mimics the behavior of actual ESP32 devices with connected sensors, sending realistic health data to the WebSocket server. This is useful for:

1. Testing the system without physical hardware
2. Demonstrating the platform's capabilities
3. Development and debugging of the dashboard
4. Testing different health scenarios (normal, fever, etc.)

## Simulator Setup

### Prerequisites

- Backend server must be running (`npm run backend`)
- WebSocket server must be initialized on port 3001

### Starting the Simulator

```bash
npm run simulate:enhanced
```

## Configuration Options

The simulator will prompt you to configure several parameters:

### 1. Connection Settings

```
=== ESP32 Simulator Configuration ===

WebSocket URL [ws://localhost:3001]: 
Device ID [DEV-SIMULATOR]: 
API Key [simulator-key-123]: 
Animal ID to monitor [CATTLE001]: A12348
Data interval (ms) [5000]: 
```

- **WebSocket URL**: Keep the default `ws://localhost:3001` (must match your backend server port)
- **Device ID**: A unique identifier for this simulated device
- **API Key**: Authentication key (any value will work in development)
- **Animal ID**: Must match an existing animal in your system (e.g., A12345, A12346, A12347)
- **Data interval**: Time between data transmissions in milliseconds (5000 = 5 seconds)

### 2. Sensor Configuration

```
=== Sensor Configuration ===
Enable DHT11 (Temperature/Humidity)? (Y/n): Y
Enable MPU6050 (Accelerometer/Gyro)? (Y/n): Y
Enable MICROPHONE sensor? (Y/n): Y
Enable HEALTH metrics? (Y/n): Y
Enable PREGNANCY monitoring? (y/N): Y
```

- **DHT11**: Simulates temperature and humidity sensors
- **MPU6050**: Simulates accelerometer and gyroscope (for activity monitoring)
- **MICROPHONE**: Simulates audio level detection
- **HEALTH**: Consolidates vital health metrics
- **PREGNANCY**: Enables fetal heart rate simulation (only relevant for pregnant cattle)

### 3. Simulation Scenario

```
=== Simulation Scenario ===
Select a scenario:
1. Normal (all readings within normal range)
2. Fever (elevated temperature)
3. Low Activity (reduced movement)
4. Tachycardia (elevated heart rate)
5. Pregnancy Concern (abnormal fetal heart rate)
6. Custom (configure your own parameters)

Select scenario [1]: 
```

Choose the scenario that matches your testing needs:

- **Normal**: For verifying baseline system functionality
- **Fever**: To test temperature anomaly detection
- **Low Activity**: To test activity monitoring and alerts
- **Tachycardia**: To test heart rate anomaly detection
- **Pregnancy Concern**: To test fetal monitoring alerts
- **Custom**: For advanced testing with manual parameter configuration

### 4. Custom Parameters (if Custom scenario selected)

If you select the Custom scenario, you'll be prompted to set specific parameter ranges:

```
=== Custom Parameter Configuration ===
Temperature range (°C) [38.0-39.0]: 40.1-41.2
Heart rate range (bpm) [60-80]: 
Activity level range (0-10) [7-10]: 
Fetal heart rate range (bpm) [160-200]: 
```

### 5. Output Settings

```
=== Output Settings ===
Log Level:
1. Minimal (errors only)
2. Normal (basic info)
3. Detailed (all data and events)
4. Debug (everything including raw data)

Select log level [2]: 
```

- **Minimal**: Only errors and critical information
- **Normal**: Basic connection and data transmission info
- **Detailed**: Full data payloads and server responses
- **Debug**: Everything including internal simulator state

## Verifying Connection

Once configured, the simulator will attempt to connect to the WebSocket server:

```
Connecting to WebSocket server at ws://localhost:3001...
WebSocket connected!
Device authenticated: DEV-SIMULATOR
Associated with animal: A12348
Starting data transmission at 5000ms intervals
```

## Simulated Data

The simulator will generate and send data at the configured interval:

```
Sending sensor data at 2023-05-10T14:32:45.123Z
  Temperature: 38.7°C
  Humidity: 62%
  Heart Rate: 72 bpm
  Activity Level: 8.3
  Fetal Heart Rate: 182 bpm
  Audio Level: 32 dB
Data received by server:
  Timestamp: 2023-05-10T14:32:45.456Z
  Anomaly Detected: false
```

## Troubleshooting

### Connection Issues

If the simulator fails to connect:

1. Verify the backend server is running
2. Check the WebSocket URL (should be `ws://localhost:3001`)
3. Ensure the port is not blocked by any firewall
4. Try restarting both the backend and the simulator

### Authentication Failures

If you see authentication errors:

1. For development, any API key should work
2. Ensure the animal ID exists in the system

### No Data Appearing in Dashboard

If the dashboard doesn't show data:

1. Ensure the dashboard is monitoring the same animal ID as the simulator
2. Check the WebSocket connection status in the dashboard
3. Verify the WebSocket server is correctly forwarding messages

## Advanced Configuration

For advanced customization, you can edit the simulator code:

```bash
vim src/backend/tools/enhancedSimulateData.js
```

This allows you to:

1. Add custom sensor types
2. Modify data generation algorithms
3. Create new simulation scenarios
4. Adjust data transmission logic

## Example Use Cases

1. **Demo Mode**: Use normal scenario with all sensors, 2-second interval
2. **Anomaly Testing**: Use fever or tachycardia scenarios to verify alerts
3. **Pregnancy Monitoring**: Enable pregnancy sensor and use the pregnancy concern scenario
4. **System Stress Test**: Configure multiple simulator instances with different IDs
