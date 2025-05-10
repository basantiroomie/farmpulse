#!/usr/bin/env node

/**
 * WebSocket Server Connection Test Utility
 * 
 * This script helps debug WebSocket connection issues by:
 * 1. Testing direct connection to the WebSocket server
 * 2. Logging detailed connection information and errors
 * 3. Attempting various connection configurations
 */

import WebSocket from 'ws';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== WebSocket Connection Test Utility ===');
console.log('This utility will help debug WebSocket connection issues');

// Default test parameters
const DEFAULT_PARAMS = {
  host: 'localhost',
  port: 3001,
  path: '/',
  useProxy: false,
  queryParams: {
    type: 'dashboard',
    animalId: 'A12348'
  }
};

// Generate WebSocket URL from parameters
function generateWsUrl(params) {
  const baseUrl = `ws://${params.host}:${params.port}${params.path}`;
  
  // Add query parameters
  const queryString = Object.entries(params.queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

// Test WebSocket connection
function testConnection(params) {
  const url = generateWsUrl(params);
  console.log(`\nAttempting to connect to: ${url}`);
  
  const ws = new WebSocket(url);
  
  ws.on('open', () => {
    console.log('\n✅ Connection successful!');
    console.log('Connection details:');
    console.log(`  URL: ${url}`);
    console.log(`  readyState: ${ws.readyState}`);
    
    // Test sending a message
    const testMessage = JSON.stringify({
      type: 'test',
      message: 'WebSocket connection test',
      timestamp: new Date().toISOString()
    });
    
    try {
      ws.send(testMessage);
      console.log('  Test message sent successfully');
    } catch (error) {
      console.error('  Failed to send test message:', error.message);
    }
    
    console.log('\nWaiting for messages from server...');
    console.log('(Press Ctrl+C to exit)');
  });
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('\nReceived message from server:');
      console.log(JSON.stringify(message, null, 2));
    } catch (error) {
      console.log('\nReceived raw message from server:');
      console.log(data.toString());
    }
  });
  
  ws.on('error', (error) => {
    console.error('\n❌ Connection error:');
    console.error(`  Code: ${error.code || 'N/A'}`);
    console.error(`  Message: ${error.message || 'No error message'}`);
    
    // Provide recommendations based on error
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔍 Troubleshooting suggestions:');
      console.log('  1. Ensure the WebSocket server is running');
      console.log('  2. Check if the port is correct');
      console.log('  3. Make sure there are no firewall or network issues');
    }
  });
  
  ws.on('close', (code, reason) => {
    console.log('\n🔄 Connection closed');
    console.log(`  Code: ${code}`);
    console.log(`  Reason: ${reason || 'No reason provided'}`);
    
    // Exit process after connection closes
    process.exit(0);
  });
}

// Main menu for interactive testing
function showMainMenu() {
  console.log('\n=== WebSocket Test Menu ===');
  console.log('1. Test direct connection to backend');
  console.log('2. Test connection through Vite proxy');
  console.log('3. Configure test parameters');
  console.log('4. Exit');
  
  rl.question('\nSelect an option (1-4): ', (answer) => {
    switch (answer) {
      case '1':
        testConnection(DEFAULT_PARAMS);
        break;
      case '2':
        testConnection({
          ...DEFAULT_PARAMS,
          host: 'localhost',
          port: 8080,
          path: '/ws',
          useProxy: true
        });
        break;
      case '3':
        configureParams();
        break;
      case '4':
        console.log('Exiting...');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('Invalid option');
        showMainMenu();
    }
  });
}

// Configure test parameters
function configureParams() {
  console.log('\n=== Configure Test Parameters ===');
  
  rl.question(`Host [${DEFAULT_PARAMS.host}]: `, (host) => {
    const newHost = host || DEFAULT_PARAMS.host;
    
    rl.question(`Port [${DEFAULT_PARAMS.port}]: `, (port) => {
      const newPort = parseInt(port) || DEFAULT_PARAMS.port;
      
      rl.question(`Path [${DEFAULT_PARAMS.path}]: `, (path) => {
        const newPath = path || DEFAULT_PARAMS.path;
        
        rl.question(`Type [${DEFAULT_PARAMS.queryParams.type}]: `, (type) => {
          const newType = type || DEFAULT_PARAMS.queryParams.type;
          
          rl.question(`Animal ID [${DEFAULT_PARAMS.queryParams.animalId}]: `, (animalId) => {
            const newAnimalId = animalId || DEFAULT_PARAMS.queryParams.animalId;
            
            // Update parameters
            DEFAULT_PARAMS.host = newHost;
            DEFAULT_PARAMS.port = newPort;
            DEFAULT_PARAMS.path = newPath;
            DEFAULT_PARAMS.queryParams.type = newType;
            DEFAULT_PARAMS.queryParams.animalId = newAnimalId;
            
            console.log('\nParameters updated successfully!');
            showMainMenu();
          });
        });
      });
    });
  });
}

// Start the script
showMainMenu();
