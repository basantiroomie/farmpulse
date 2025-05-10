import { WebSocketServer } from 'ws';
import { validateApiKey } from '../middleware/auth.js';
import { validateSensorData, generateSimulatedSensorData } from '../utils/sensorValidation.js';
import { writeApi, Point } from '../db/influxConfig.js';
import { db } from '../db/database.js';
import { processAnomaly } from '../ml/anomalyDetection.js';
import { processFetusHeartRate } from '../ml/pregnancyPrediction.js';
import http from 'http';

// Connected clients map (for broadcasting)
const clients = new Map();
// Active simulations map
const simulations = new Map();

/**
 * Initialize WebSocket server
 * @param {http.Server} server - HTTP server instance
 */
export function initWebSocketServer(server) {
  const wss = new WebSocketServer({ server });
  
  console.log('WebSocket server initialized on port', server.address()?.port || 'unknown');
  
  // Log details about the server
  console.log(`WebSocket path: ws://localhost:${server.address()?.port || '3001'}`);
  
  wss.on('connection', async (ws, req) => {
    // Log connection details
    console.log(`WebSocket connection received from ${req.socket.remoteAddress}`);
    console.log(`Connection URL: ${req.url}`);
    
    // Extract query parameters
    const url = new URL(req.url, 'http://localhost');
    const deviceId = url.searchParams.get('deviceId');
    const apiKey = url.searchParams.get('apiKey');
    const clientType = url.searchParams.get('type') || 'device';
    
    console.log(`Client type: ${clientType}, Device ID: ${deviceId || 'N/A'}`);
    
    // Dashboard clients don't require authentication
    if (clientType === 'dashboard') {
      console.log('Dashboard client connected');
      ws.clientType = 'dashboard';
      
      // Store client with animal ID if provided
      const monitoringAnimalId = url.searchParams.get('animalId');
      if (monitoringAnimalId) {
        ws.monitoringAnimalId = monitoringAnimalId;
      }
      
      // Add client to connected clients
      const clientId = Date.now().toString();
      ws.id = clientId;
      clients.set(clientId, ws);
      ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
      
      // Send initial simulation status
      ws.send(JSON.stringify({
        type: 'simulationStatus',
        simulations: Array.from(simulations.keys())
      }));
      
    } else if (clientType === 'device' || clientType === 'simulator') {
      // Validate API key for device connections
      if (!deviceId || !apiKey) {
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Missing deviceId or apiKey'
        }));
        ws.close();
        return;
      }
      
      // Authenticate the device
      const authResult = await validateApiKey(deviceId, apiKey);
      
      if (!authResult.valid) {
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Authentication failed'
        }));
        ws.close();
        return;
      }
      
      console.log(`Device connected: ${deviceId}`);
      
      // Store client info
      ws.deviceId = deviceId;
      ws.animalId = authResult.animalId;
      ws.clientType = 'device';
      
      // Add to clients map
      clients.set(deviceId, ws);
      
      // Let the client know it's connected
      ws.send(JSON.stringify({ 
        type: 'connection', 
        status: 'connected',
        deviceId,
        animalId: authResult.animalId || null
      }));
      
      if (clientType === 'simulator') {
        ws.clientType = 'simulator';
      }
    }
    
    // Handle messages from clients
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        
        // Handle different message types
        switch (data.type) {
          case 'sensorData':
            // Process incoming sensor data
            await handleSensorData(ws, data);
            break;
            
          case 'startSimulation':
            // Start a simulation for a specific animal
            if (data.animalId) {
              startSimulation(data.animalId, data.interval || 5000);
              ws.send(JSON.stringify({ 
                type: 'simulationStarted', 
                animalId: data.animalId 
              }));
              
              // Broadcast simulation start to all dashboard clients
              broadcastToDashboards({
                type: 'simulationStatus',
                simulations: Array.from(simulations.keys())
              });
            }
            break;
            
          case 'stopSimulation':
            // Stop simulation for a specific animal or all simulations
            if (data.animalId) {
              stopSimulation(data.animalId);
              ws.send(JSON.stringify({ 
                type: 'simulationStopped', 
                animalId: data.animalId 
              }));
            } else if (data.all) {
              stopAllSimulations();
              ws.send(JSON.stringify({ 
                type: 'simulationStopped', 
                all: true 
              }));
            }
            
            // Broadcast simulation stop to all dashboard clients
            broadcastToDashboards({
              type: 'simulationStatus',
              simulations: Array.from(simulations.keys())
            });
            break;
          
          case 'getSimulationStatus':
            // Send current simulation status
            ws.send(JSON.stringify({
              type: 'simulationStatus',
              simulations: Array.from(simulations.keys())
            }));
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Error processing message' 
        }));
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      if (ws.clientType === 'dashboard') {
        clients.delete(ws.id);
        console.log('Dashboard client disconnected');
      } else if (ws.clientType === 'device' || ws.clientType === 'simulator') {
        clients.delete(ws.deviceId);
        console.log(`Device disconnected: ${ws.deviceId}`);
      }
    });
  });
  
  return wss;
}

/**
 * Handle incoming sensor data from WebSocket
 */
async function handleSensorData(ws, data) {
  try {
    const { deviceId, animalId, readings, timestamp } = data;
    
    // Validate the incoming sensor data
    const validationResults = validateSensorData(readings);
    if (!validationResults.valid) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Invalid sensor data: ${validationResults.error}`
      }));
      return;
    }
    
    // Process and store data in InfluxDB
    const measurementTime = timestamp ? new Date(timestamp) : new Date();
    
    let anomalyDetected = false;
    let fetalHealthData = null;
    
    // Process each sensor reading
    for (const reading of readings) {
      const { sensorType, values } = reading;
      
      // Create a point for InfluxDB with all values
      const point = new Point('sensor_readings')
        .tag('deviceId', deviceId)
        .tag('sensorType', sensorType);
      
      if (animalId) {
        point.tag('animalId', animalId);
      }
      
      // Add all values as fields
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'number') {
          point.floatField(key, value);
        } else if (typeof value === 'boolean') {
          point.booleanField(key, value);
        } else if (typeof value === 'string') {
          point.stringField(key, value);
        }
      });
      
      point.timestamp(measurementTime);
      writeApi.writePoint(point);

      // If we have valid health data and associated animal, store in SQLite too
      if (animalId && (sensorType === 'DHT11' || sensorType === 'HEALTH')) {
        // Extract temperature, heart rate, etc.
        const temperature = values.temperature;
        const heartRate = values.heart_rate || values.heartRate;
        const activity = values.activity;
        
        if (temperature || heartRate || activity) {
          const dateStr = measurementTime.toISOString().split('T')[0];
          
          // Store in health_data table
          const insertHealthData = db.prepare(
            'INSERT INTO health_data (animal_id, date, heart_rate, temperature, activity) VALUES (?, ?, ?, ?, ?)'
          );
          
          insertHealthData.run(
            animalId,
            dateStr,
            heartRate || null,
            temperature || null,
            activity || null
          );

          // Check for anomalies
          try {
            const anomalyResult = await processAnomaly({
              animalId,
              temperature,
              heartRate,
              activity,
              timestamp: dateStr
            });
            
            if (anomalyResult.isAnomaly) {
              anomalyDetected = true;
            }
          } catch (err) {
            console.log('Anomaly detection not available yet:', err.message);
          }
        }
      }
      
      // If we have pregnancy data, process it
      if (animalId && (sensorType === 'PREGNANCY' || values.fetal_heart_rate || values.fetalHeartRate)) {
        const fetalHeartRate = values.fetal_heart_rate || values.fetalHeartRate;
        
        if (fetalHeartRate) {
          // Check pregnancy status
          const pregnancyData = db.prepare('SELECT * FROM pregnancy_data WHERE animal_id = ?').get(animalId);
          
          if (pregnancyData && pregnancyData.status === 'Confirmed') {
            const dateStr = measurementTime.toISOString().split('T')[0];
            
            // Store in pregnancy_stats table
            const insertPregnancyStats = db.prepare(
              'INSERT INTO pregnancy_stats (animal_id, date, temperature, heart_rate, fetal_heart_rate, activity, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
            );
            
            // Look for other metrics to include
            const temperature = readings.find(r => r.sensorType === 'DHT11' || r.sensorType === 'HEALTH')?.values?.temperature;
            const heartRate = readings.find(r => r.sensorType === 'HEALTH')?.values?.heart_rate;
            const activity = readings.find(r => r.sensorType === 'MPU6050' || r.sensorType === 'HEALTH')?.values?.activity;
            
            insertPregnancyStats.run(
              animalId, 
              dateStr, 
              temperature || null, 
              heartRate || null, 
              fetalHeartRate, 
              activity || null, 
              'Sensor reading'
            );
            
            // Use ML to process fetal heart rate data
            try {
              fetalHealthData = await processFetusHeartRate({
                animalId,
                fetalHeartRate,
                gestationDays: pregnancyData.gestation_days,
                timestamp: dateStr
              });
            } catch (err) {
              console.log('Pregnancy prediction not available yet:', err.message);
            }
          }
        }
      }
    }

    // Flush data to InfluxDB
    await writeApi.flush();

    // Send response back to the device
    ws.send(JSON.stringify({
      type: 'dataReceived',
      timestamp: new Date().toISOString(),
      anomalyDetected,
      fetalHealthData
    }));
    
    // Broadcast data to dashboard clients
    broadcastSensorData(animalId, {
      deviceId,
      animalId,
      readings,
      timestamp: measurementTime.toISOString(),
      anomalyDetected,
      fetalHealthData
    });
    
  } catch (error) {
    console.error('Error processing sensor data:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: error.message || 'Error processing sensor data'
    }));
  }
}

/**
 * Broadcast sensor data to dashboard clients
 */
function broadcastSensorData(animalId, data) {
  clients.forEach((client) => {
    if (client.clientType === 'dashboard') {
      // If the client is monitoring a specific animal, only send data for that animal
      if (client.monitoringAnimalId) {
        if (client.monitoringAnimalId === animalId) {
          client.send(JSON.stringify({
            type: 'sensorData',
            ...data
          }));
        }
      } else {
        // Otherwise send to all dashboard clients
        client.send(JSON.stringify({
          type: 'sensorData',
          ...data
        }));
      }
    }
  });
}

/**
 * Broadcast message to all dashboard clients
 */
function broadcastToDashboards(message) {
  clients.forEach((client) => {
    if (client.clientType === 'dashboard') {
      client.send(JSON.stringify(message));
    }
  });
}

/**
 * Start a simulation for an animal
 */
function startSimulation(animalId, interval = 5000) {
  // Stop existing simulation for this animal if it exists
  if (simulations.has(animalId)) {
    clearInterval(simulations.get(animalId));
  }
  
  // Start new simulation
  const intervalId = setInterval(() => {
    // Generate simulated data
    const sensorTypes = ['DHT11', 'MPU6050', 'MICROPHONE', 'HEALTH'];
    
    // Add pregnancy data if the animal is pregnant
    const pregnancyData = db.prepare('SELECT * FROM pregnancy_data WHERE animal_id = ?').get(animalId);
    if (pregnancyData && pregnancyData.status === 'Confirmed') {
      sensorTypes.push('PREGNANCY');
    }
    
    const data = generateSimulatedSensorData(animalId, sensorTypes);
    
    // Process the simulated data as if it came from a real device
    broadcastSensorData(animalId, data);
    
    // Also store the data
    try {
      const deviceClient = clients.get(`DEV-${animalId.substring(1)}`) || { send: () => {} };
      handleSensorData(deviceClient, data);
    } catch (error) {
      console.error(`Error in simulation for ${animalId}:`, error);
    }
  }, interval);
  
  // Store the interval ID
  simulations.set(animalId, intervalId);
  console.log(`Simulation started for animal ${animalId} at ${interval}ms intervals`);
}

/**
 * Stop a simulation for an animal
 */
function stopSimulation(animalId) {
  if (simulations.has(animalId)) {
    clearInterval(simulations.get(animalId));
    simulations.delete(animalId);
    console.log(`Simulation stopped for animal ${animalId}`);
    return true;
  }
  return false;
}

/**
 * Stop all simulations
 */
function stopAllSimulations() {
  simulations.forEach((intervalId, animalId) => {
    clearInterval(intervalId);
    console.log(`Simulation stopped for animal ${animalId}`);
  });
  simulations.clear();
}

/**
 * Get all active simulations
 */
export function getActiveSimulations() {
  return Array.from(simulations.keys());
}
