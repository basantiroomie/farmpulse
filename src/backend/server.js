import express from 'express';
import cors from 'cors';
import path from 'path';
import animalRoutes from './api/animalRoutes.js';  // Note .js extension

// Initialize the database
import './db/database.js';  // Note .js extension

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', animalRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

export default app;  // ES Module export