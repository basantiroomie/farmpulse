# FarmPulse: Complete Setup & WebSocket Connection Guide

This guide covers all steps for setting up and running the FarmPulse IoT cattle monitoring system, with special focus on ensuring proper WebSocket connectivity between the frontend and backend.

## Step 1: Install Dependencies

```bash
cd /Users/bhaskar/Desktop/Northeast/farmpulse
npm install
```

## Step 2: Set Up Environment

Create a `.env` file in the root directory with the following content:

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/farmpulse
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=my-super-secret-auth-token
INFLUXDB_ORG=farmpulse
INFLUXDB_BUCKET=iot_sensors
USE_SQLITE=true
```

The `USE_SQLITE=true` setting allows the application to run without MongoDB.

## Step 3: Start the Backend Server

```bash
npm run backend
```

Look for the output:
```
WebSocket server initialized on port 3001
WebSocket path: ws://localhost:3001
```

This confirms the WebSocket server is running correctly.

## Step 4: Start the Frontend Development Server

In a new terminal:

```bash
npm run dev
```

This should start the Vite development server. Look for output indicating which port it's running on (usually 5173 or 8080).

## Step 5: Run the WebSocket Test

In another terminal, run:

```bash
npm run test:ws
```

From the menu, select "1. Test direct connection to backend" to verify that the WebSocket server is accessible directly.

## Step 6: Start the ESP32 Simulator

In another terminal:

```bash
npm run simulate:enhanced
```

When prompted, select these configuration options:

1. Connection Settings:
   - WebSocket URL: ws://localhost:3001
   - Device ID: DEV-SIMULATOR (or any name you prefer)
   - API Key: [Use default]
   - Animal ID: CATTLE001 (or any ID in your system)
   - Data interval: 5000 (5 seconds)

2. Sensor Settings:
   - Enable DHT11, MPU6050, HEALTH (at minimum)
   - Enable PREGNANCY if simulating pregnant cattle

3. Scenario:
   - Start with "Normal" to verify the baseline
   - Try "Fever" to test anomaly detection

4. Output Settings:
   - Log Level: normal or detailed

## Step 7: Open the Dashboard

1. Navigate to `http://localhost:8080` (or whichever port Vite is using)
2. Go to the Dashboard page
3. Select the same animal ID that you configured in the simulator

You should now see:
- A "Connected" status badge
- Real-time data flowing from the simulator
- Charts updating with new values
- Possible alerts if anomalies are detected

## Troubleshooting WebSocket Connection

If the dashboard shows "Disconnected":

1. **Check Console**: Open browser developer tools (F12) and look for WebSocket errors
2. **Verify Ports**: Ensure backend is on port 3001 and WebSocket URL in SensorDataMonitor.tsx uses this port
3. **Test Direct Connection**: Use the WebSocket test tool (`npm run test:ws`)
4. **Check Network**: Ensure no firewall is blocking WebSocket connections
5. **Restart Servers**: Stop and restart both the backend and frontend servers
6. **Try Different Browser**: Some browser extensions can interfere with WebSockets

## Advanced Debugging

If problems persist:

```bash
# Check if port 3001 is in use
lsof -i :3001

# Manually send a WebSocket message (requires wscat)
npm install -g wscat
wscat -c ws://localhost:3001?type=dashboard&animalId=CATTLE001
```

## Common Issues & Solutions

1. **"Failed to connect" error**:
   - Ensure backend server is running
   - Verify correct port in WebSocket URL
   - Check for typos in animal ID

2. **Connected but no data**:
   - Ensure simulator is running and connected
   - Verify simulator is using same animal ID as dashboard

3. **CORS errors**:
   - The direct WebSocket connection approach should avoid these
   - If using proxy, ensure proxy is configured correctly

4. **"not-found" errors**:
   - Verify animal ID exists in your system
   - Check database initialization

By carefully following these steps and troubleshooting tips, you should be able to successfully run the FarmPulse system with proper WebSocket connectivity.
