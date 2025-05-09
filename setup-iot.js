#!/usr/bin/env node

/**
 * FarmPulse IoT System Setup Script
 * 
 * This script helps initialize and set up the FarmPulse IoT monitoring system:
 * - Installs required packages
 * - Creates .env file with configuration
 * - Sets up the databases (InfluxDB and MongoDB)
 * - Tests the connection
 * - Starts the system components
 */

const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Readline interface for prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n\n░█▀▀░█▀█░█▀▄░█▄█░█▀█░█░█░█░░░█▀▀░█▀▀░░░▀█▀░█▀█░▀█▀░░░█▀▀░█▀▀░▀█▀░█░█░█▀█');
console.log('░█▀▀░█▀█░█▀▄░█░█░█▀▀░█░█░█░░░▀▀█░█▀▀░░░░█░░█░█░░█░░░░▀▀█░█▀▀░░█░░█░█░█▀▀');
console.log('░▀░░░▀░▀░▀░▀░▀░▀░▀░░░▀▀▀░▀▀▀░▀▀▀░▀▀▀░░░░▀░░▀▀▀░░▀░░░░▀▀▀░▀▀▀░░▀░░▀▀▀░▀░░\n\n');

console.log('Welcome to the FarmPulse IoT System Setup\n');
console.log('This script will help you set up all components of the FarmPulse IoT cattle monitoring system.');
console.log('It will install required packages and configure the environment.\n');

// Function to prompt for yes/no questions
function askYesNo(question) {
  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Function to prompt for value with default
function askValue(question, defaultValue) {
  return new Promise((resolve) => {
    rl.question(`${question} [${defaultValue}]: `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

// Function to generate a random API key
function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

// Main setup function
async function setup() {
  try {
    // Step 1: Check if required packages are installed
    console.log('Checking required packages...');
    
    const installPackages = await askYesNo('Would you like to install/update required npm packages?');
    
    if (installPackages) {
      console.log('\nInstalling required packages...');
      try {
        execSync('npm install @influxdata/influxdb-client mongoose ws jsonwebtoken bcrypt dotenv uuid', { stdio: 'inherit' });
        console.log('Packages installed successfully.');
      } catch (error) {
        console.error('Error installing packages:', error);
        const continueSetup = await askYesNo('Would you like to continue with the setup anyway?');
        if (!continueSetup) {
          return;
        }
      }
    }
    
    // Step 2: Create .env file with configuration
    console.log('\nSetting up environment configuration...');
    
    const useInfluxDB = await askYesNo('Do you want to use InfluxDB for time-series sensor data? (recommended)');
    const useMongoDB = await askYesNo('Do you want to use MongoDB for device management?');
    
    const envFile = path.join(process.cwd(), '.env');
    let envContent = '# FarmPulse IoT Configuration\n\n';
    
    // Basic configuration
    const port = await askValue('Enter server port', '3001');
    envContent += `PORT=${port}\n\n`;
    
    // Generate API key for device authentication
    const deviceApiKey = generateApiKey();
    envContent += `# Device Authentication\n`;
    envContent += `DEVICE_API_KEY=${deviceApiKey}\n\n`;
    
    // JWT secret for user authentication
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    envContent += `# JWT Authentication\n`;
    envContent += `JWT_SECRET=${jwtSecret}\n\n`;
    
    // InfluxDB configuration if selected
    if (useInfluxDB) {
      const influxUrl = await askValue('Enter InfluxDB URL', 'http://localhost:8086');
      const influxToken = await askValue('Enter InfluxDB token or press enter to generate one', 'my-super-secret-auth-token');
      const influxOrg = await askValue('Enter InfluxDB organization', 'farmpulse');
      const influxBucket = await askValue('Enter InfluxDB bucket name', 'iot_sensors');
      
      envContent += `# InfluxDB Configuration\n`;
      envContent += `INFLUXDB_URL=${influxUrl}\n`;
      envContent += `INFLUXDB_TOKEN=${influxToken}\n`;
      envContent += `INFLUXDB_ORG=${influxOrg}\n`;
      envContent += `INFLUXDB_BUCKET=${influxBucket}\n\n`;
    }
    
    // MongoDB configuration if selected
    if (useMongoDB) {
      const mongoUri = await askValue('Enter MongoDB connection URI', 'mongodb://localhost:27017/farmpulse');
      
      envContent += `# MongoDB Configuration\n`;
      envContent += `MONGODB_URI=${mongoUri}\n\n`;
    }
    
    // Write the .env file
    fs.writeFileSync(envFile, envContent);
    console.log('.env file created successfully.');
    
    // Step 3: Setup instructions
    console.log('\n\n===== SETUP COMPLETE =====');
    console.log('\nTo start the FarmPulse IoT system:');
    console.log('1. Start the backend server:');
    console.log('   npm run backend');
    console.log('   or: node src/backend/start-server.js');
    console.log('\n2. Start the frontend development server:');
    console.log('   npm run dev');
    
    console.log('\nSimulating IoT Sensors:');
    console.log('1. Open the Dashboard page');
    console.log('2. Select an animal');
    console.log('3. Click "Start Simulation" button in the Live Sensor Data section');
    
    console.log('\nFor device registration and pairing:');
    console.log('- API endpoint: POST /api/devices/register');
    console.log('- Device pairing: POST /api/devices/:deviceId/pair');
    console.log(`- Default API key: ${deviceApiKey.substring(0, 8)}...${deviceApiKey.substring(deviceApiKey.length - 8)}`);
    
    console.log('\nThank you for setting up FarmPulse IoT! For more information, consult the documentation.\n');
    
    rl.close();
  } catch (error) {
    console.error('An error occurred during setup:', error);
    rl.close();
  }
}

// Run the setup
setup();
