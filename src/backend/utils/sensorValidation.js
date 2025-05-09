/**
 * Validates sensor data from IoT devices
 * Supports DHT11 (temp/humidity), MPU6050 (accel/gyro), and microphone data
 */

// Define valid sensor types and their required fields
const sensorSpecs = {
  DHT11: {
    required: ['temperature', 'humidity'],
    validate: (values) => {
      // Validate temperature range: -40 to 80 °C for DHT11
      if (values.temperature < -40 || values.temperature > 80) {
        return { valid: false, error: 'Temperature out of range (-40 to 80 °C)' };
      }
      
      // Validate humidity range: 0 to 100%
      if (values.humidity < 0 || values.humidity > 100) {
        return { valid: false, error: 'Humidity out of range (0 to 100%)' };
      }
      
      return { valid: true };
    }
  },
  
  MPU6050: {
    required: ['accelX', 'accelY', 'accelZ', 'gyroX', 'gyroY', 'gyroZ', 'temperature'],
    validate: (values) => {
      // MPU6050 acceleration typical range ±2g (±19.6 m/s²)
      const accelRange = 19.6; 
      
      if (Math.abs(values.accelX) > accelRange || 
          Math.abs(values.accelY) > accelRange || 
          Math.abs(values.accelZ) > accelRange) {
        return { valid: false, error: 'Acceleration values out of range (±19.6 m/s²)' };
      }
      
      // MPU6050 gyro typical range ±250 degrees/second
      const gyroRange = 250;
      
      if (Math.abs(values.gyroX) > gyroRange || 
          Math.abs(values.gyroY) > gyroRange || 
          Math.abs(values.gyroZ) > gyroRange) {
        return { valid: false, error: 'Gyroscope values out of range (±250 deg/s)' };
      }
      
      // MPU6050 temperature range -40 to 85 °C
      if (values.temperature < -40 || values.temperature > 85) {
        return { valid: false, error: 'Temperature out of range (-40 to 85 °C)' };
      }
      
      return { valid: true };
    }
  },
  
  MICROPHONE: {
    required: ['audioLevel', 'frequency'],
    validate: (values) => {
      // Validate audio level (dB SPL): typical range 0-120 dB
      if (values.audioLevel < 0 || values.audioLevel > 120) {
        return { valid: false, error: 'Audio level out of range (0-120 dB)' };
      }
      
      // Validate frequency: typical animal sounds 20 Hz to 20 kHz
      if (values.frequency < 20 || values.frequency > 20000) {
        return { valid: false, error: 'Frequency out of range (20 Hz to 20 kHz)' };
      }
      
      return { valid: true };
    }
  },
  
  // Generic health data
  HEALTH: {
    required: ['heart_rate', 'temperature', 'activity'],
    validate: (values) => {
      // Validate heart rate: typical cattle range 40-120 BPM
      if (values.heart_rate && (values.heart_rate < 40 || values.heart_rate > 140)) {
        return { valid: false, error: 'Heart rate out of range (40-140 BPM)' };
      }
      
      // Validate temperature: typical cattle range 36.7-39.1 °C (extended to 42°C for fever)
      if (values.temperature && (values.temperature < 36 || values.temperature > 42)) {
        return { valid: false, error: 'Temperature out of range (36-42 °C)' };
      }
      
      return { valid: true };
    }
  },
  
  // Pregnancy-related data
  PREGNANCY: {
    required: ['fetal_heart_rate'],
    validate: (values) => {
      // Validate fetal heart rate: typical range 100-200 BPM
      if (values.fetal_heart_rate && (values.fetal_heart_rate < 100 || values.fetal_heart_rate > 200)) {
        return { valid: false, error: 'Fetal heart rate out of range (100-200 BPM)' };
      }
      
      return { valid: true };
    }
  },
  
  // Allow other sensor types without strict validation
  CUSTOM: {
    required: [],
    validate: () => ({ valid: true })
  }
};

/**
 * Validates sensor readings against expected formats and ranges
 * @param {Array} readings - Array of sensor readings
 * @returns {Object} - Validation result
 */
export function validateSensorData(readings) {
  if (!Array.isArray(readings)) {
    return { valid: false, error: 'Readings must be an array' };
  }
  
  for (const reading of readings) {
    // Check if reading has required fields
    const { sensorType, values } = reading;
    
    if (!sensorType || !values || typeof values !== 'object') {
      return { valid: false, error: 'Each reading must have sensorType and values object' };
    }
    
    // Get sensor specification or use CUSTOM if not found
    const spec = sensorSpecs[sensorType] || sensorSpecs.CUSTOM;
    
    // Check for required fields
    for (const field of spec.required) {
      if (values[field] === undefined || values[field] === null) {
        return { 
          valid: false, 
          error: `Missing required field: ${field} for sensor type: ${sensorType}` 
        };
      }
    }
    
    // Validate values using sensor-specific validation
    const validationResult = spec.validate(values);
    if (!validationResult.valid) {
      return validationResult;
    }
  }
  
  return { valid: true };
}

/**
 * Simulates sensor data for testing/demo purposes
 * @param {String} animalId - Animal ID to generate data for
 * @param {Array} sensorTypes - Types of sensors to simulate
 * @returns {Object} - Simulated sensor payload
 */
export function generateSimulatedSensorData(animalId, sensorTypes = ['DHT11', 'MPU6050', 'MICROPHONE']) {
  const readings = [];
  const deviceId = animalId ? `DEV-${animalId.substring(1)}` : 'DEV-SIMULATOR';
  
  // Get animal baseline data if available
  let baseTemp = 38.5; // default cattle temp
  let baseHR = 70;     // default cattle heart rate
  let baseActivity = 5; // default activity level (0-10)
  
  // Add randomness to make the data look realistic
  const tempVariance = (Math.random() * 0.6) - 0.3; // ±0.3°C
  const hrVariance = Math.floor((Math.random() * 10) - 5); // ±5 BPM
  const activityVariance = (Math.random() * 2) - 1; // ±1 activity level
  
  // Generate readings for each sensor type
  for (const sensorType of sensorTypes) {
    switch (sensorType) {
      case 'DHT11':
        readings.push({
          sensorType: 'DHT11',
          values: {
            temperature: baseTemp + tempVariance,
            humidity: 45 + (Math.random() * 10)
          }
        });
        break;
        
      case 'MPU6050':
        // Calculate activity level based on movement (0-10 scale)
        const activity = Math.max(0, Math.min(10, baseActivity + activityVariance));
        
        // More active = more movement
        const accelMagnitude = activity * 0.2; 
        
        readings.push({
          sensorType: 'MPU6050',
          values: {
            accelX: (Math.random() * 2 - 1) * accelMagnitude,
            accelY: (Math.random() * 2 - 1) * accelMagnitude,
            accelZ: 9.8 + (Math.random() * 0.4 - 0.2), // ~9.8 m/s² (gravity) with slight variations
            gyroX: (Math.random() * 20 - 10) * activity / 5,
            gyroY: (Math.random() * 20 - 10) * activity / 5,
            gyroZ: (Math.random() * 20 - 10) * activity / 5,
            temperature: baseTemp + tempVariance + (Math.random() * 0.2 - 0.1)
          }
        });
        break;
        
      case 'MICROPHONE':
        // Less active animals are typically quieter
        const audioBase = 40 + (baseActivity * 2); 
        
        readings.push({
          sensorType: 'MICROPHONE',
          values: {
            audioLevel: audioBase + (Math.random() * 10 - 5),
            frequency: 800 + (Math.random() * 400 - 200), // Cow vocalization around 800 Hz
            duration: 0.2 + (Math.random() * 0.3)
          }
        });
        break;
        
      case 'HEALTH':
        readings.push({
          sensorType: 'HEALTH',
          values: {
            heart_rate: baseHR + hrVariance,
            temperature: baseTemp + tempVariance,
            activity: baseActivity + activityVariance
          }
        });
        break;
        
      case 'PREGNANCY':
        // Only add pregnancy data if we have a valid animal ID
        if (animalId) {
          readings.push({
            sensorType: 'PREGNANCY',
            values: {
              fetal_heart_rate: 160 + (Math.random() * 20 - 10), // fetal HR typically 140-180 BPM
              movement_detected: Math.random() > 0.5
            }
          });
        }
        break;
    }
  }
  
  return {
    deviceId,
    animalId,
    readings,
    timestamp: new Date().toISOString()
  };
}
