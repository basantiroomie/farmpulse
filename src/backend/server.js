import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';
import animalRoutes from './api/animalRoutes.js';
import deviceRoutes from './api/deviceRoutes.js';
import sensorRoutes from './api/sensorRoutes.js';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Initialize databases
import './db/database.js';
import { connectMongoDB } from './db/mongoConfig.js';
import { writeApi } from './db/influxConfig.js';

// Initialize WebSocket server
import { initWebSocketServer } from './websocket/wsServer.js';

// Create express app and HTTP server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Routes
app.use('/api', animalRoutes);
app.use('/api', deviceRoutes);
app.use('/api', sensorRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Initialize WebSocket server
const wss = initWebSocketServer(server);

// Connect to MongoDB (non-blocking)
connectMongoDB()
  .then((connected) => {
    if (connected) {
      console.log('✅ MongoDB connected successfully.');
    }
    // If not connected, the error is already logged in connectMongoDB
  })
  .catch((err) => {
    // This should not happen as errors are caught in connectMongoDB
    console.error('Unexpected MongoDB connection error:', err);
  });

// Create an onExit handler to properly close connections
const cleanup = async () => {
  console.log('Closing InfluxDB connection...');
  writeApi.close().then(() => {
    console.log('InfluxDB connection closed');
    process.exit(0);
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
};

// Handle SIGTERM and SIGINT signals
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

export { app, server };  // ES Module export