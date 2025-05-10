// A simple in-memory mock implementation of the Device model to use when MongoDB isn't available
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

class MockDeviceModel {
  constructor() {
    this.devices = [];
    this.initialized = false;
  }

  // Initialize with some sample data
  async initialize() {
    if (this.initialized) return;
    
    // Add some sample devices
    await this.create({
      deviceId: 'DEVICE001',
      name: 'ESP32 Sensor Pack 1',
      animalId: 'CATTLE001',
      apiKey: 'test-api-key-1',
      sensorTypes: ['DHT11', 'MPU6050'],
      status: 'ACTIVE'
    });

    await this.create({
      deviceId: 'DEVICE002',
      name: 'ESP32 Sensor Pack 2',
      animalId: 'CATTLE002',
      apiKey: 'test-api-key-2',
      sensorTypes: ['DHT11', 'MPU6050'],
      status: 'ACTIVE'
    });
    
    console.log('\x1b[36m%s\x1b[0m', '📱 Mock device data initialized with sample devices');
    this.initialized = true;
  }

  // Mock find method
  async find(query = {}) {
    await this.initialize();
    return this.devices.map(device => {
      const { apiKey, ...deviceWithoutApiKey } = device;
      return deviceWithoutApiKey;
    });
  }

  // Mock findOne method
  async findOne(query = {}) {
    await this.initialize();
    const device = this.devices.find(d => 
      (query.deviceId && d.deviceId === query.deviceId) ||
      (query._id && d._id === query._id)
    );
    
    if (!device) return null;
    
    // Clone to avoid mutations affecting the stored data
    return { ...device };
  }

  // Mock create method
  async create(deviceData) {
    const salt = await bcrypt.genSalt(10);
    const hashedApiKey = await bcrypt.hash(deviceData.apiKey, salt);
    
    const newDevice = {
      _id: uuidv4(),
      ...deviceData,
      apiKey: hashedApiKey,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastConnected: null,
      metadata: deviceData.metadata || {}
    };
    
    this.devices.push(newDevice);
    return { ...newDevice };
  }

  // Mock findByIdAndUpdate method
  async findByIdAndUpdate(id, update) {
    await this.initialize();
    const deviceIndex = this.devices.findIndex(d => d._id === id);
    
    if (deviceIndex === -1) return null;
    
    this.devices[deviceIndex] = {
      ...this.devices[deviceIndex],
      ...update,
      updatedAt: new Date()
    };
    
    return { ...this.devices[deviceIndex] };
  }

  // Mock findByIdAndDelete method
  async findByIdAndDelete(id) {
    await this.initialize();
    const deviceIndex = this.devices.findIndex(d => d._id === id);
    
    if (deviceIndex === -1) return null;
    
    const deletedDevice = this.devices[deviceIndex];
    this.devices.splice(deviceIndex, 1);
    
    return { ...deletedDevice };
  }
}

// Create a singleton instance
const MockDevice = new MockDeviceModel();

// Add method to validate API key
MockDevice.validateApiKey = async function(storedApiKey, providedApiKey) {
  return await bcrypt.compare(providedApiKey, storedApiKey);
};

// Export the mock device
export { MockDevice as default };
