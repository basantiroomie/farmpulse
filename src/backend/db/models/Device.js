import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import MockDevice from './MockDevice.js';

// Flag to track if we're using MongoDB or the mock implementation
let usingMockImplementation = false;

const DeviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  animalId: {
    type: String,
    ref: 'Animal',
    required: false // Not required for devices that aren't attached to animals yet
  },
  apiKey: {
    type: String,
    required: true
  },
  sensorTypes: [{
    type: String,
    enum: ['DHT11', 'MPU6050', 'MICROPHONE', 'OTHER'],
    required: true
  }],
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'],
    default: 'ACTIVE'
  },
  lastConnected: {
    type: Date,
    default: null
  },
  location: {
    type: String,
    default: 'Unknown'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
});

// Middleware to hash apiKey before saving
DeviceSchema.pre('save', async function(next) {
  // Only hash the apiKey if it has been modified or is new
  if (!this.isModified('apiKey')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.apiKey = await bcrypt.hash(this.apiKey, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare apiKey for authentication
DeviceSchema.methods.validateApiKey = async function(apiKey) {
  return await bcrypt.compare(apiKey, this.apiKey);
};

let Device;

try {
  // Try to create the Mongoose model
  Device = mongoose.model('Device', DeviceSchema);
} catch (error) {
  // If there's an error (likely because MongoDB isn't connected),
  // Set the flag so we know to use the mock implementation
  usingMockImplementation = true;
  console.log('\x1b[33m%s\x1b[0m', '⚠️ Using mock implementation for Device model (MongoDB not available)');
  
  // Use our mock implementation
  Device = MockDevice;
}

export default Device;
export { usingMockImplementation };
