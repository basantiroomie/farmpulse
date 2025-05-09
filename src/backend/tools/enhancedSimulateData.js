#!/usr/bin/env node

/**
 * Enhanced ESP32 Sensor Data Simulator for FarmPulse
 * This script simulates IoT sensor data from ESP32 devices
 * for testing the FarmPulse system without actual hardware.
 * 
 * Features:
 * - Simulation of all sensor types (temperature, heart rate, activity, fetal monitoring)
 * - Different simulation scenarios (normal, fever, low activity, etc.)
 * - Custom value configuration
 * - Data logging and export options
 * - WebSocket authentication with the server
 */

import { generateSimulatedSensorData } from '../utils/sensorValidation.js';
import WebSocket from 'ws';
import readline from 'readline';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Default configuration
const DEFAULT_CONFIG = {
  wsUrl: `ws://localhost:${process.env.PORT || 3001}`,
  deviceId: 'DEV-SIMULATOR',
  apiKey: process.env.DEVICE_API_KEY || 'default-key',
  animalId: null,
  interval: 5000, // 5 seconds
  sensorTypes: ['DHT11', 'MPU6050', 'MICROPHONE', 'HEALTH'],
  withPregnancy: false,
  scenarioMode: 'normal', // 'normal', 'fever', 'lowActivity', 'highHeartRate', 'custom'
  customValues: {
    temperature: 38.5,
    heart_rate: 70,
    activity: 7,
    fetal_heart_rate: 175
  },
  saveToFile: false,
  logLevel: 'normal' // 'minimal', 'normal', 'detailed'
};

// Command line interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// WebSocket client instance
let ws = null;
let simulationInterval = null;
let isConnected = false;
let config = { ...DEFAULT_CONFIG };
let dataLogFile = null;

// Print banner
console.log('\n\n░█▀▀░█▀█░█▀▄░█▄█░█▀█░█░█░█░░░█▀▀░█▀▀░░░█▀▀░▀█▀░█▄█░█░█░█░░░█▀█░▀█▀░█▀█░█▀▄');
console.log('░█▀▀░█▀█░█▀▄░█░█░█▀▀░█░█░█░░░▀▀█░█▀▀░░░▀▀█░░█░░█░█░█░█░█░░░█▀█░░█░░█░█░█▀▄');
console.log('░▀░░░▀░▀░▀░▀░▀░▀░▀░░░▀▀▀░▀▀▀░▀▀▀░▀▀▀░░░▀▀▀░░▀░░▀░▀░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀░▀\n\n');
console.log('Enhanced ESP32 Sensor Data Simulator for FarmPulse IoT System\n');

// Start the application
showMainMenu();

// Main menu
function showMainMenu() {
  console.log('\n===== ESP32 SIMULATOR MENU =====');
  console.log('1. Start simulation');
  console.log('2. Configure simulation');
  console.log('3. Show current configuration');
  console.log('4. Exit');
  
  rl.question('\nSelect an option (1-4): ', (answer) => {
    switch (answer) {
      case '1':
        startSimulation();
        break;
      case '2':
        configureSimulation();
        break;
      case '3':
        showCurrentConfig();
        break;
      case '4':
        exitProgram();
        break;
      default:
        console.log('Invalid option. Please try again.');
        showMainMenu();
    }
  });
}

// Show current configuration
function showCurrentConfig() {
  console.log('\n===== CURRENT CONFIGURATION =====');
  console.log(`WebSocket URL: ${config.wsUrl}`);
  console.log(`Device ID: ${config.deviceId}`);
  console.log(`API Key: ${config.apiKey.substring(0, 3)}...${config.apiKey.substring(config.apiKey.length - 3)}`);
  console.log(`Animal ID: ${config.animalId || 'None (standalone sensor)'}`);
  console.log(`Data interval: ${config.interval}ms`);
  console.log(`Sensor types: ${config.sensorTypes.join(', ')}`);
  console.log(`Include pregnancy data: ${config.withPregnancy ? 'Yes' : 'No'}`);
  console.log(`Scenario mode: ${config.scenarioMode}`);
  console.log(`Log level: ${config.logLevel}`);
  console.log(`Save to file: ${config.saveToFile ? 'Yes' : 'No'}`);
  
  if (config.scenarioMode === 'custom') {
    console.log('\nCustom Values:');
    console.log(`- Temperature: ${config.customValues.temperature}°C`);
    console.log(`- Heart Rate: ${config.customValues.heart_rate} bpm`);
    console.log(`- Activity: ${config.customValues.activity} (scale 0-10)`);
    if (config.withPregnancy) {
      console.log(`- Fetal Heart Rate: ${config.customValues.fetal_heart_rate} bpm`);
    }
  }
  
  // Return to main menu
  console.log('\nPress Enter to return to the main menu...');
  rl.question('', () => {
    showMainMenu();
  });
}

// Configure the simulation
function configureSimulation() {
  console.log('\n===== CONFIGURE SIMULATION =====');
  
  // Display configuration menu
  console.log('1. Connection Settings');
  console.log('2. Sensor Settings');
  console.log('3. Scenario Settings');
  console.log('4. Output Settings');
  console.log('5. Return to Main Menu');

  rl.question('\nSelect option (1-5): ', (answer) => {
    switch (answer) {
      case '1':
        configureConnectionSettings();
        break;
      case '2':
        configureSensorSettings();
        break;
      case '3':
        configureScenarioSettings();
        break;
      case '4':
        configureOutputSettings();
        break;
      case '5':
        showMainMenu();
        break;
      default:
        console.log('Invalid option. Please try again.');
        configureSimulation();
    }
  });
}

// Configure connection settings (WebSocket URL, device ID, API key, etc.)
function configureConnectionSettings() {
  console.log('\n===== CONNECTION SETTINGS =====');
  
  rl.question(`WebSocket URL [${config.wsUrl}]: `, (wsUrl) => {
    config.wsUrl = wsUrl || config.wsUrl;
    
    rl.question(`Device ID [${config.deviceId}]: `, (deviceId) => {
      config.deviceId = deviceId || config.deviceId;
      
      rl.question(`API Key [${config.apiKey}]: `, (apiKey) => {
        config.apiKey = apiKey || config.apiKey;
        
        rl.question(`Animal ID [${config.animalId || 'None'}]: `, (animalId) => {
          config.animalId = animalId || config.animalId;
          
          rl.question(`Data interval in ms [${config.interval}]: `, (interval) => {
            config.interval = parseInt(interval) || config.interval;
            
            console.log('\nConnection settings updated successfully!');
            configureSimulation();
          });
        });
      });
    });
  });
}

// Configure sensor settings (which sensors to include)
function configureSensorSettings() {
  console.log('\n===== SENSOR SETTINGS =====');
  
  const currentSensors = config.sensorTypes.join(', ');
  console.log(`Current sensors: ${currentSensors}`);
  
  console.log('\nSelect sensors to include:');
  console.log('1. DHT11 (Temperature/Humidity)');
  console.log('2. MPU6050 (Motion/Activity)');
  console.log('3. MICROPHONE (Sound)');
  console.log('4. HEALTH (Combined health metrics)');
  console.log('5. PREGNANCY (Fetal monitoring)');
  console.log('6. Toggle all');
  console.log('7. Continue');
  
  rl.question('\nEnter option (1-7): ', (option) => {
    if (option === '7') {
      console.log('\nSensor settings updated successfully!');
      configureSimulation();
      return;
    }
    
    if (option === '6') {
      // Include all or none
      if (config.sensorTypes.length >= 4) {
        // Currently has most sensors, so clear it
        config.sensorTypes = [];
        config.withPregnancy = false;
        console.log('All sensors disabled.');
      } else {
        // Currently has few sensors, so include all
        config.sensorTypes = ['DHT11', 'MPU6050', 'MICROPHONE', 'HEALTH'];
        console.log('All sensors enabled.');
      }
      configureSensorSettings();
      return;
    }
    
    // Toggle individual sensors
    let sensor;
    switch (option) {
      case '1': sensor = 'DHT11'; break;
      case '2': sensor = 'MPU6050'; break;
      case '3': sensor = 'MICROPHONE'; break;
      case '4': sensor = 'HEALTH'; break;
      case '5':
        config.withPregnancy = !config.withPregnancy;
        if (config.withPregnancy) {
          if (!config.sensorTypes.includes('PREGNANCY')) {
            config.sensorTypes.push('PREGNANCY');
          }
          console.log('Pregnancy monitoring enabled');
        } else {
          config.sensorTypes = config.sensorTypes.filter(t => t !== 'PREGNANCY');
          console.log('Pregnancy monitoring disabled');
        }
        configureSensorSettings();
        return;
      default:
        console.log('Invalid option.');
        configureSensorSettings();
        return;
    }
    
    // Toggle the sensor
    if (config.sensorTypes.includes(sensor)) {
      config.sensorTypes = config.sensorTypes.filter(t => t !== sensor);
      console.log(`${sensor} disabled.`);
    } else {
      config.sensorTypes.push(sensor);
      console.log(`${sensor} enabled.`);
    }
    
    configureSensorSettings();
  });
}

// Configure scenario settings (normal, fever, etc.)
function configureScenarioSettings() {
  console.log('\n===== SCENARIO SETTINGS =====');
  console.log('Select a simulation scenario:');
  console.log('1. Normal (healthy animal)');
  console.log('2. Fever (elevated temperature)');
  console.log('3. Low Activity (reduced movement)');
  console.log('4. High Heart Rate (elevated pulse)');
  console.log('5. Custom Values');
  console.log('6. Return to Configuration Menu');
  
  rl.question('\nEnter option (1-6): ', (option) => {
    switch (option) {
      case '1':
        config.scenarioMode = 'normal';
        console.log('Scenario set to Normal');
        configureSimulation();
        break;
      case '2':
        config.scenarioMode = 'fever';
        console.log('Scenario set to Fever');
        configureSimulation();
        break;
      case '3':
        config.scenarioMode = 'lowActivity';
        console.log('Scenario set to Low Activity');
        configureSimulation();
        break;
      case '4':
        config.scenarioMode = 'highHeartRate';
        console.log('Scenario set to High Heart Rate');
        configureSimulation();
        break;
      case '5':
        configureCustomValues();
        break;
      case '6':
        configureSimulation();
        break;
      default:
        console.log('Invalid option. Please try again.');
        configureScenarioSettings();
    }
  });
}

// Configure custom sensor values
function configureCustomValues() {
  console.log('\n===== CUSTOM VALUES =====');
  
  rl.question(`Temperature (°C) [${config.customValues.temperature}]: `, (temp) => {
    if (temp) config.customValues.temperature = parseFloat(temp);
    
    rl.question(`Heart Rate (bpm) [${config.customValues.heart_rate}]: `, (hr) => {
      if (hr) config.customValues.heart_rate = parseInt(hr);
      
      rl.question(`Activity level (0-10) [${config.customValues.activity}]: `, (act) => {
        if (act) config.customValues.activity = parseFloat(act);
        
        if (config.withPregnancy) {
          rl.question(`Fetal Heart Rate (bpm) [${config.customValues.fetal_heart_rate}]: `, (fhr) => {
            if (fhr) config.customValues.fetal_heart_rate = parseInt(fhr);
            
            config.scenarioMode = 'custom';
            console.log('Custom values set successfully!');
            configureSimulation();
          });
        } else {
          config.scenarioMode = 'custom';
          console.log('Custom values set successfully!');
          configureSimulation();
        }
      });
    });
  });
}

// Configure output settings (logging, saving to file)
function configureOutputSettings() {
  console.log('\n===== OUTPUT SETTINGS =====');
  console.log('1. Log Level (minimal, normal, detailed)');
  console.log('2. Save Data to File');
  console.log('3. Return to Configuration Menu');
  
  rl.question('\nEnter option (1-3): ', (option) => {
    switch (option) {
      case '1':
        console.log('\nSelect Log Level:');
        console.log('1. Minimal (connection status only)');
        console.log('2. Normal (connection + periodic data summaries)');
        console.log('3. Detailed (full data output)');
        
        rl.question('\nSelect log level (1-3): ', (level) => {
          switch (level) {
            case '1': config.logLevel = 'minimal'; break;
            case '2': config.logLevel = 'normal'; break;
            case '3': config.logLevel = 'detailed'; break;
            default: console.log('Invalid option. Using normal log level.');
          }
          configureOutputSettings();
        });
        break;
      case '2':
        config.saveToFile = !config.saveToFile;
        console.log(`Save to file ${config.saveToFile ? 'enabled' : 'disabled'}`);
        configureOutputSettings();
        break;
      case '3':
        configureSimulation();
        break;
      default:
        console.log('Invalid option. Please try again.');
        configureOutputSettings();
    }
  });
}

// Start the simulation
function startSimulation() {
  console.log('\n===== STARTING SIMULATION =====');
  console.log(`Connecting to ${config.wsUrl}...`);
  
  // Create log file if needed
  if (config.saveToFile) {
    try {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const logDirectory = path.join(__dirname, 'logs');
      
      // Create logs directory if it doesn't exist
      if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
      }
      
      const logFilename = `sensor_data_${config.deviceId}_${timestamp}.json`;
      const logPath = path.join(logDirectory, logFilename);
      
      dataLogFile = fs.createWriteStream(logPath, { flags: 'a' });
      dataLogFile.write('[\n'); // Start JSON array
      
      console.log(`Logging data to ${logPath}`);
    } catch (err) {
      console.error('Error creating log file:', err);
      config.saveToFile = false;
    }
  }
  
  // Create WebSocket connection
  ws = new WebSocket(`${config.wsUrl}?type=simulator&deviceId=${config.deviceId}&apiKey=${config.apiKey}`);
  
  // WebSocket event handlers
  ws.on('open', () => {
    console.log('Connected to WebSocket server!');
    isConnected = true;
    
    // Start sending data periodically
    console.log(`Sending simulated data every ${config.interval}ms. Press Ctrl+C to stop.`);
    
    let firstDataPoint = true;
    simulationInterval = setInterval(() => {
      try {
        // Generate simulated data
        const data = generateSimulatedDataWithScenario();
        
        // Add additional fields
        data.deviceId = config.deviceId;
        data.type = 'sensorData';
        
        // Send data
        ws.send(JSON.stringify(data));
        
        // Log data based on log level
        if (config.logLevel === 'detailed') {
          console.log(JSON.stringify(data, null, 2));
        } else if (config.logLevel === 'normal') {
          logDataSummary(data);
        } else {
          // Minimal logging
          process.stdout.write('.');
        }
        
        // Save to file if configured
        if (config.saveToFile && dataLogFile) {
          // Add comma between entries except for the first one
          if (!firstDataPoint) {
            dataLogFile.write(',\n');
          } else {
            firstDataPoint = false;
          }
          dataLogFile.write(JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }, config.interval);
    
    // Show simulation controls
    showSimulationControls();
  });
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      if (config.logLevel !== 'minimal') {
        console.log(`Received from server: ${message.type}`);
      }
      
      if (message.type === 'error') {
        console.error(`Error from server: ${message.message}`);
      }
    } catch (error) {
      console.error('Error parsing server message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('\nDisconnected from WebSocket server');
    isConnected = false;
    
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
    }
    
    // Close log file if open
    if (dataLogFile) {
      dataLogFile.write('\n]'); // End JSON array
      dataLogFile.end();
      dataLogFile = null;
      console.log('Log file saved and closed.');
    }
    
    // Return to main menu after disconnection
    console.log('\nPress Enter to return to the main menu...');
    rl.question('', () => {
      showMainMenu();
    });
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    
    if (!isConnected) {
      console.log('Could not connect to the server. Please check your configuration.');
      showMainMenu();
    }
  });
}

// Generate data according to selected scenario
function generateSimulatedDataWithScenario() {
  let baseTemp = 38.5; // default cattle temperature
  let baseHR = 70;     // default cattle heart rate
  let baseActivity = 7; // default activity level (0-10)
  let baseFHR = 175;   // default fetal heart rate
  
  // Adjust baseline according to scenario
  switch (config.scenarioMode) {
    case 'fever':
      baseTemp = 40.2; // Fever
      baseHR = 84;     // Elevated heart rate due to fever
      baseActivity = 4; // Reduced activity due to illness
      break;
    
    case 'lowActivity':
      baseTemp = 38.3;
      baseHR = 68;
      baseActivity = 2.5; // Very low activity
      break;
    
    case 'highHeartRate':
      baseTemp = 39.2; // Slight fever
      baseHR = 92;     // High heart rate
      baseActivity = 5;
      break;
    
    case 'custom':
      baseTemp = config.customValues.temperature;
      baseHR = config.customValues.heart_rate;
      baseActivity = config.customValues.activity;
      baseFHR = config.customValues.fetal_heart_rate;
      break;
      
    case 'normal':
    default:
      // Use defaults
      break;
  }
  
  // Override the sensor values before generating
  const originalGenerateSimulatedSensorData = generateSimulatedSensorData;
  
  // Create a custom override for the simulation
  const patchedGenerateData = (animalId, sensorTypes) => {
    // Get the base data from original function
    const data = originalGenerateSimulatedSensorData(animalId, sensorTypes);
    
    // Modify readings with our scenario values
    data.readings.forEach(reading => {
      if (reading.sensorType === 'HEALTH') {
        reading.values.temperature = baseTemp + ((Math.random() * 0.4) - 0.2); // Add small variation
        reading.values.heart_rate = baseHR + Math.floor((Math.random() * 8) - 4);
        reading.values.activity = baseActivity + ((Math.random() * 1) - 0.5);
      }
      
      if (reading.sensorType === 'DHT11') {
        reading.values.temperature = baseTemp + ((Math.random() * 0.4) - 0.2);
      }
      
      if (reading.sensorType === 'MPU6050') {
        // Activity level influences accelerometer readings
        const accelMagnitude = baseActivity * 0.2;
        reading.values.accelX = (Math.random() * 2 - 1) * accelMagnitude;
        reading.values.accelY = (Math.random() * 2 - 1) * accelMagnitude;
        reading.values.accelZ = 9.8 + (Math.random() * 0.4 - 0.2);
      }
      
      if (reading.sensorType === 'PREGNANCY') {
        reading.values.fetal_heart_rate = baseFHR + Math.floor((Math.random() * 14) - 7);
      }
    });
    
    return data;
  };
  
  return patchedGenerateData(
    config.animalId,
    config.withPregnancy ? 
      [...config.sensorTypes, 'PREGNANCY'] : 
      config.sensorTypes.filter(t => t !== 'PREGNANCY')
  );
}

// Log a summary of the data
function logDataSummary(data) {
  const timestamp = new Date().toLocaleTimeString();
  let summary = `Data sent at ${timestamp} | `;
  
  // Extract key metrics
  const healthReading = data.readings.find(r => r.sensorType === 'HEALTH');
  const pregnancyReading = data.readings.find(r => r.sensorType === 'PREGNANCY');
  
  if (healthReading) {
    summary += `Temp: ${healthReading.values.temperature.toFixed(1)}°C, `;
    summary += `HR: ${healthReading.values.heart_rate} bpm, `;
    summary += `Activity: ${healthReading.values.activity.toFixed(1)}`;
  }
  
  if (pregnancyReading) {
    summary += `, FHR: ${pregnancyReading.values.fetal_heart_rate} bpm`;
  }
  
  console.log(summary);
}

// Show simulation controls
function showSimulationControls() {
  console.log('\n===== SIMULATION CONTROLS =====');
  console.log('1. Stop simulation');
  console.log('2. Send a single reading');
  console.log('3. Change interval');
  console.log('4. Change scenario');
  
  rl.question('\nSelect an option (1-4): ', (answer) => {
    switch (answer) {
      case '1':
        stopSimulation();
        break;
      case '2':
        sendSingleReading();
        break;
      case '3':
        changeInterval();
        break;
      case '4':
        changeScenario();
        break;
      default:
        console.log('Invalid option. Please try again.');
        showSimulationControls();
    }
  });
}

// Change the simulation scenario during simulation
function changeScenario() {
  console.log('\n===== CHANGE SCENARIO =====');
  console.log('1. Normal (healthy animal)');
  console.log('2. Fever (elevated temperature)');
  console.log('3. Low Activity (reduced movement)');
  console.log('4. High Heart Rate (elevated pulse)');
  
  rl.question('\nSelect scenario (1-4): ', (scenario) => {
    switch (scenario) {
      case '1':
        config.scenarioMode = 'normal';
        console.log('Scenario changed to Normal');
        break;
      case '2':
        config.scenarioMode = 'fever';
        console.log('Scenario changed to Fever');
        break;
      case '3':
        config.scenarioMode = 'lowActivity';
        console.log('Scenario changed to Low Activity');
        break;
      case '4':
        config.scenarioMode = 'highHeartRate';
        console.log('Scenario changed to High Heart Rate');
        break;
      default:
        console.log('Invalid scenario. No changes made.');
    }
    
    showSimulationControls();
  });
}

// Stop the simulation
function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('Simulation stopped.');
  }
  
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  } else {
    showMainMenu();
  }
}

// Send a single reading
function sendSingleReading() {
  try {
    // Generate simulated data
    const data = generateSimulatedDataWithScenario();
    
    // Add additional fields
    data.deviceId = config.deviceId;
    data.type = 'sensorData';
    
    // Send data
    ws.send(JSON.stringify(data));
    
    if (config.logLevel === 'detailed') {
      console.log(JSON.stringify(data, null, 2));
    } else {
      logDataSummary(data);
    }
  } catch (error) {
    console.error('Error sending data:', error);
  }
  
  // Show controls again
  showSimulationControls();
}

// Change the simulation interval
function changeInterval() {
  rl.question(`Enter new interval in ms [${config.interval}]: `, (interval) => {
    const newInterval = parseInt(interval) || config.interval;
    
    if (newInterval !== config.interval) {
      config.interval = newInterval;
      
      if (simulationInterval) {
        clearInterval(simulationInterval);
        
        simulationInterval = setInterval(() => {
          try {
            // Generate simulated data
            const data = generateSimulatedDataWithScenario();
            
            // Add additional fields
            data.deviceId = config.deviceId;
            data.type = 'sensorData';
            
            // Send data
            ws.send(JSON.stringify(data));
            
            if (config.logLevel === 'detailed') {
              console.log(JSON.stringify(data, null, 2));
            } else if (config.logLevel === 'normal') {
              logDataSummary(data);
            } else {
              // Minimal logging
              process.stdout.write('.');
            }
            
            // Save to file if configured
            if (config.saveToFile && dataLogFile) {
              dataLogFile.write(',\n' + JSON.stringify(data));
            }
          } catch (error) {
            console.error('Error sending data:', error);
          }
        }, config.interval);
        
        console.log(`Interval updated to ${config.interval}ms`);
      }
    }
    
    showSimulationControls();
  });
}

// Exit the program
function exitProgram() {
  console.log('\nThank you for using the FarmPulse ESP32 Simulator!');
  
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }
  
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  
  if (dataLogFile) {
    dataLogFile.write('\n]'); // End JSON array
    dataLogFile.end();
  }
  
  rl.close();
  setTimeout(() => process.exit(0), 500);
}
