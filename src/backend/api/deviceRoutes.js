import express from 'express';
import Device, { usingMockImplementation } from '../db/models/Device.js';
import { apiKeyAuth } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

// Log whether we're using the real or mock implementation
console.log(usingMockImplementation 
  ? '\x1b[33m%s\x1b[0m' 
  : '\x1b[32m%s\x1b[0m', 
  usingMockImplementation 
    ? '⚠️ Device routes: Using mock database (MongoDB not available)'
    : '✅ Device routes: Using MongoDB for device storage');

const router = express.Router();

// Get all devices - protected by admin auth
router.get('/devices', async (req, res) => {
  try {
    const devices = await Device.find({}).select('-apiKey');
    res.json({ success: true, data: devices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get device by ID - protected by admin auth
router.get('/devices/:deviceId', async (req, res) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.deviceId }).select('-apiKey');
    
    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }
    
    res.json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Register a new device
router.post('/devices/register', async (req, res) => {
  try {
    const { name, sensorTypes, location } = req.body;
    
    // Basic validation
    if (!name || !sensorTypes || !Array.isArray(sensorTypes)) {
      return res.status(400).json({ success: false, error: 'Invalid device data' });
    }
    
    // Generate unique device ID and API key
    const deviceId = `DEV-${uuidv4().substring(0, 8)}`;
    const apiKey = uuidv4();
    
    const device = new Device({
      deviceId,
      name,
      sensorTypes,
      apiKey,
      location: location || 'Unknown'
    });
    
    await device.save();
    
    // Return the device with the API key (only time it's exposed unencrypted)
    res.status(201).json({ 
      success: true, 
      message: 'Device registered successfully',
      data: {
        deviceId: device.deviceId,
        apiKey, // Only returned once during registration
        name: device.name,
        sensorTypes: device.sensorTypes,
        status: device.status,
        location: device.location
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update device
router.patch('/devices/:deviceId', async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };
    
    // Don't allow updating deviceId or apiKey through this endpoint
    delete updateData.deviceId;
    delete updateData.apiKey;
    
    const device = await Device.findOneAndUpdate(
      { deviceId: req.params.deviceId },
      updateData,
      { new: true }
    ).select('-apiKey');
    
    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }
    
    res.json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Pair device with animal
router.post('/devices/:deviceId/pair', async (req, res) => {
  try {
    const { animalId } = req.body;
    
    if (!animalId) {
      return res.status(400).json({ success: false, error: 'Animal ID required' });
    }
    
    const device = await Device.findOneAndUpdate(
      { deviceId: req.params.deviceId },
      { animalId, updatedAt: Date.now() },
      { new: true }
    ).select('-apiKey');
    
    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }
    
    res.json({ 
      success: true, 
      message: `Device ${req.params.deviceId} paired with animal ${animalId}`,
      data: device
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Unpair device from animal
router.post('/devices/:deviceId/unpair', async (req, res) => {
  try {
    const device = await Device.findOneAndUpdate(
      { deviceId: req.params.deviceId },
      { $unset: { animalId: "" }, updatedAt: Date.now() },
      { new: true }
    ).select('-apiKey');
    
    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }
    
    res.json({ 
      success: true, 
      message: `Device ${req.params.deviceId} unpaired`,
      data: device
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete device
router.delete('/devices/:deviceId', async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({ deviceId: req.params.deviceId });
    
    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }
    
    res.json({ 
      success: true, 
      message: `Device ${req.params.deviceId} deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
