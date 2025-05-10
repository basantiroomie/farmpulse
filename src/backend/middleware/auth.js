import jwt from 'jsonwebtoken';
import Device from '../db/models/Device.js';
import dotenv from 'dotenv';

dotenv.config();

// JWT auth middleware for user authentication
export const jwtAuth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    
    // Check if no token
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No authentication token, authorization denied' 
      });
    }
    
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'default-jwt-secret');
    
    if (!verified) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token verification failed, authorization denied' 
      });
    }
    
    // Add user from payload
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Invalid authentication token' 
    });
  }
};

// API key auth middleware for device authentication
export const apiKeyAuth = async (req, res, next) => {
  try {
    // Get API key from header
    const apiKey = req.header('x-api-key');
    const deviceId = req.header('x-device-id');
    
    // Check if no API key or device ID
    if (!apiKey || !deviceId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Missing authentication credentials' 
      });
    }
    
    // Find device
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      return res.status(404).json({ 
        success: false, 
        error: 'Device not found' 
      });
    }
    
    // Validate API key
    const isValid = await device.validateApiKey(apiKey);
    
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid API key' 
      });
    }
    
    // Update last connected timestamp
    device.lastConnected = new Date();
    await device.save();
    
    // Add device to request
    req.device = {
      deviceId: device.deviceId,
      name: device.name,
      animalId: device.animalId,
      sensorTypes: device.sensorTypes,
      status: device.status
    };
    
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Authentication error' 
    });
  }
};

// Simpler API key check for WebSocket connections
export const validateApiKey = async (deviceId, apiKey) => {
  try {
    // Check if static API key from environment
    const staticApiKey = process.env.DEVICE_API_KEY;
    if (staticApiKey && apiKey === staticApiKey) {
      return { 
        valid: true, 
        deviceId: deviceId || 'SIMULATED' 
      };
    }
    
    // If no device ID, fail
    if (!deviceId) return { valid: false };
    
    // Find device
    const device = await Device.findOne({ deviceId });
    
    if (!device) return { valid: false };
    
    // Validate API key
    const isValid = await device.validateApiKey(apiKey);
    
    if (!isValid) return { valid: false };
    
    // Update last connected timestamp
    device.lastConnected = new Date();
    await device.save();
    
    // Return device info
    return {
      valid: true,
      deviceId: device.deviceId,
      animalId: device.animalId,
      sensorTypes: device.sensorTypes
    };
  } catch (error) {
    console.error('API key validation error:', error);
    return { valid: false };
  }
};
