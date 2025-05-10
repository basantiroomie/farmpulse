#!/usr/bin/env node

/**
 * ESP32 Sensor Data Simulator
 * This script simulates IoT sensor data from ESP32 devices
 * for testing the FarmPulse system without actual hardware.
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

// Print banner
console.log('\n\n░█▀▀░█▀█░█▀▄░█▄█░█▀█░█░█░█░░░█▀▀░█▀▀░░░█▀▀░▀█▀░█▄█░█░█░█░░░█▀█░▀█▀░█▀█░█▀▄');
console.log('░█▀▀░█▀█░█▀▄░█░█░█▀▀░█░█░█░░░▀▀█░█▀▀░░░▀▀█░░█░░█░█░█░█░█░░░█▀█░░█░░█░█░█▀▄');
console.log('░▀░░░▀░▀░▀░▀░▀░▀░▀░░░▀▀▀░▀▀▀░▀▀▀░▀▀▀░░░▀▀▀░░▀░░▀░▀░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀░▀\n\n');
console.log('ESP32 Sensor Data Simulator for FarmPulse IoT System\n');

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
  console.log(`Include pregnancy data: ${config.withPregnancy}`);
  
  // Return to main menu
  console.log('\nPress Enter to return to the main menu...');
  rl.question('', () => {
    showMainMenu();
  });
}

// Configure the simulation
function configureSimulation() {
  console.log('\n===== CONFIGURE SIMULATION =====');
  
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
            
            rl.question(`Include pregnancy data? (y/n) [${config.withPregnancy ? 'y' : 'n'}]: `, (withPregnancy) => {
              config.withPregnancy = withPregnancy.toLowerCase() === 'y' || 
                                    (withPregnancy === '' && config.withPregnancy);
              
              if (config.withPregnancy && !config.sensorTypes.includes('PREGNANCY')) {
                config.sensorTypes.push('PREGNANCY');
              } else if (!config.withPregnancy && config.sensorTypes.includes('PREGNANCY')) {
                config.sensorTypes = config.sensorTypes.filter(t => t !== 'PREGNANCY');
              }
              
              console.log('\nConfiguration updated successfully!');
              showMainMenu();
            });
          });
        });
      });
    });
  });
}

// Start the simulation
function startSimulation() {
  console.log('\n===== STARTING SIMULATION =====');
  console.log(`Connecting to ${config.wsUrl}...`);
  
  // Create WebSocket connection
  ws = new WebSocket(`${config.wsUrl}?type=simulator&deviceId=${config.deviceId}&apiKey=${config.apiKey}`);
  
  // WebSocket event handlers
  ws.on('open', () => {
    console.log('Connected to WebSocket server!');
    isConnected = true;
    
    // Start sending data periodically
    console.log(`Sending simulated data every ${config.interval}ms. Press Ctrl+C to stop.`);
    
    simulationInterval = setInterval(() => {
      try {
        // Generate simulated data
        const data = generateSimulatedSensorData(
          config.animalId, 
          config.withPregnancy ? 
            [...config.sensorTypes, 'PREGNANCY'] : 
            config.sensorTypes.filter(t => t !== 'PREGNANCY')
        );
        
        // Add additional fields
        data.deviceId = config.deviceId;
        data.type = 'sensorData';
        
        // Send data
        ws.send(JSON.stringify(data));
        console.log(`Data sent at ${new Date().toLocaleTimeString()}`);
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
      
      console.log(`Received from server: ${message.type}`);
      
      if (message.type === 'error') {
        console.error(`Error from server: ${message.message}`);
      }
    } catch (error) {
      console.error('Error parsing server message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
    isConnected = false;
    
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
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

// Show simulation controls
function showSimulationControls() {
  console.log('\n===== SIMULATION CONTROLS =====');
  console.log('1. Stop simulation');
  console.log('2. Send a single reading');
  console.log('3. Change interval');
  
  rl.question('\nSelect an option (1-3): ', (answer) => {
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
      default:
        console.log('Invalid option. Please try again.');
        showSimulationControls();
    }
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
    const data = generateSimulatedSensorData(
      config.animalId, 
      config.withPregnancy ? 
        [...config.sensorTypes, 'PREGNANCY'] : 
        config.sensorTypes.filter(t => t !== 'PREGNANCY')
    );
    
    // Add additional fields
    data.deviceId = config.deviceId;
    data.type = 'sensorData';
    
    // Send data
    ws.send(JSON.stringify(data));
    console.log(`Single reading sent at ${new Date().toLocaleTimeString()}`);
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
            const data = generateSimulatedSensorData(
              config.animalId, 
              config.withPregnancy ? 
                [...config.sensorTypes, 'PREGNANCY'] : 
                config.sensorTypes.filter(t => t !== 'PREGNANCY')
            );
            
            // Add additional fields
            data.deviceId = config.deviceId;
            data.type = 'sensorData';
            
            // Send data
            ws.send(JSON.stringify(data));
            console.log(`Data sent at ${new Date().toLocaleTimeString()}`);
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
  
  rl.close();
  setTimeout(() => process.exit(0), 500);
}
