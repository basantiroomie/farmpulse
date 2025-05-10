import express from 'express';
import { apiKeyAuth } from '../middleware/auth.js';
import { Point, writeApi } from '../db/influxConfig.js';
import { db } from '../db/database.js';
import { validateSensorData } from '../utils/sensorValidation.js';
import { processAnomaly } from '../ml/anomalyDetection.js';
import { processFetusHeartRate } from '../ml/pregnancyPrediction.js';

const router = express.Router();

// POST endpoint to receive sensor data via REST API
router.post('/sensor-data', apiKeyAuth, async (req, res) => {
  try {
    const { deviceId, animalId } = req.device;
    const { readings, timestamp } = req.body;

    if (!readings || !Array.isArray(readings)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sensor data format'
      });
    }

    // Validate the incoming sensor data
    const validationResults = validateSensorData(readings);
    if (!validationResults.valid) {
      return res.status(400).json({
        success: false,
        error: `Invalid sensor data: ${validationResults.error}`
      });
    }

    // Process and store data in InfluxDB
    const measurementTime = timestamp ? new Date(timestamp) : new Date();
    
    let anomalyDetected = false;
    let fetalHealthData = null;
    
    // Process each sensor reading
    for (const reading of readings) {
      const { sensorType, values } = reading;
      
      // Create a point for InfluxDB with all values
      const point = new Point('sensor_readings')
        .tag('deviceId', deviceId)
        .tag('sensorType', sensorType);
      
      if (animalId) {
        point.tag('animalId', animalId);
      }
      
      // Add all values as fields
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'number') {
          point.floatField(key, value);
        } else if (typeof value === 'boolean') {
          point.booleanField(key, value);
        } else if (typeof value === 'string') {
          point.stringField(key, value);
        }
      });
      
      point.timestamp(measurementTime);
      writeApi.writePoint(point);

      // If we have valid health data and associated animal, store in SQLite too
      if (animalId && (sensorType === 'DHT11' || sensorType === 'HEALTH')) {
        // Extract temperature, heart rate, etc.
        const temperature = values.temperature;
        const heartRate = values.heart_rate || values.heartRate;
        const activity = values.activity;
        
        if (temperature || heartRate || activity) {
          const dateStr = measurementTime.toISOString().split('T')[0];
          
          // Store in health_data table
          const insertHealthData = db.prepare(
            'INSERT INTO health_data (animal_id, date, heart_rate, temperature, activity) VALUES (?, ?, ?, ?, ?)'
          );
          
          insertHealthData.run(
            animalId,
            dateStr,
            heartRate || null,
            temperature || null,
            activity || null
          );

          // Check for anomalies
          const anomalyResult = await processAnomaly({
            animalId,
            temperature,
            heartRate,
            activity,
            timestamp: dateStr
          });
          
          if (anomalyResult.isAnomaly) {
            anomalyDetected = true;
          }
        }
      }
      
      // If we have pregnancy data, process it
      if (animalId && (sensorType === 'PREGNANCY' || values.fetal_heart_rate || values.fetalHeartRate)) {
        const fetalHeartRate = values.fetal_heart_rate || values.fetalHeartRate;
        
        if (fetalHeartRate) {
          // Check pregnancy status
          const pregnancyData = db.prepare('SELECT * FROM pregnancy_data WHERE animal_id = ?').get(animalId);
          
          if (pregnancyData && pregnancyData.status === 'Confirmed') {
            const dateStr = measurementTime.toISOString().split('T')[0];
            
            // Store in pregnancy_stats table
            const insertPregnancyStats = db.prepare(
              'INSERT INTO pregnancy_stats (animal_id, date, fetal_heart_rate) VALUES (?, ?, ?)'
            );
            
            insertPregnancyStats.run(animalId, dateStr, fetalHeartRate);
            
            // Use ML to process fetal heart rate data
            fetalHealthData = await processFetusHeartRate({
              animalId,
              fetalHeartRate,
              gestationDays: pregnancyData.gestation_days,
              timestamp: dateStr
            });
          }
        }
      }
    }

    // Flush data to InfluxDB
    await writeApi.flush();

    // Respond with success and any detected anomalies
    res.json({
      success: true,
      message: 'Sensor data received and stored',
      anomalyDetected,
      fetalHealthData
    });
    
  } catch (error) {
    console.error('Error processing sensor data:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error processing sensor data'
    });
  }
});

// GET endpoint to retrieve recent sensor data
router.get('/sensor-data/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { hours = 24 } = req.query;
    
    // Converted to number and capped at 168 hours (1 week)
    const timeRange = Math.min(parseInt(hours) || 24, 168);
    
    // Query from InfluxDB (this is a simplified example)
    const query = `
      from(bucket: "iot_sensors")
        |> range(start: -${timeRange}h)
        |> filter(fn: (r) => r["deviceId"] == "${deviceId}")
        |> sort(columns: ["_time"], desc: false)
    `;
    
    const data = [];
    try {
      // This is a placeholder for actual InfluxDB querying
      // In production, this would use queryApi.collectRows(query)
      data.push({ message: 'InfluxDB query would run here' });
    } catch (err) {
      console.error('InfluxDB query error:', err);
    }
    
    res.json({
      success: true,
      deviceId,
      timeRange: `${timeRange} hours`,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error retrieving sensor data'
    });
  }
});

export default router;
