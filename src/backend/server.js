// server.js

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

import animalRoutes from './api/animalRoutes.js';
import deviceRoutes from './api/deviceRoutes.js';
import reportRoutes from './api/reportRoutes.js';
import sensorRoutes from './api/sensorRoutes.js';

// Load environment variables
dotenv.config();

// Initialize databases (side-effects)
import './db/database.js';
import { writeApi } from './db/influxConfig.js';
import { connectMongoDB } from './db/mongoConfig.js';

// Initialize WebSocket server
import { initWebSocketServer } from './websocket/wsServer.js';

const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', animalRoutes);
app.use('/api', deviceRoutes);
app.use('/api', sensorRoutes);
app.use('/api', reportRoutes);  // Mount CSV/PDF export endpoints

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Initialize WebSocket server
initWebSocketServer(server);

// Connect to MongoDB (non-blocking)
connectMongoDB()
  .then((connected) => {
    if (connected) {
      console.log('✅ MongoDB connected successfully.');
    }
  })
  .catch((err) => {
    console.error('Unexpected MongoDB connection error:', err);
  });

// Graceful shutdown for InfluxDB
const cleanup = async () => {
  console.log('Closing InfluxDB connection...');
  try {
    await writeApi.close();
    console.log('InfluxDB connection closed');
    process.exit(0);
  } catch (e) {
    console.error('Error closing InfluxDB:', e);
    process.exit(1);
  }
};
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
