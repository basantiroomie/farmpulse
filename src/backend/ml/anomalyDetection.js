import { influxDB, queryApi } from '../db/influxConfig.js';
import { db as sqliteDb } from '../db/database.js';

// Simple anomaly detection based on threshold values
// In a real implementation, this would be replaced with a proper ML model
export async function processAnomaly(data) {
  try {
    const { animalId, temperature, heartRate, activity, timestamp } = data;
    
    // Get normal ranges for this animal based on historical data
    const normalRanges = await getNormalRangesForAnimal(animalId);
    
    const anomalies = [];
    let severity = 0;
    
    // Check temperature anomaly
    if (temperature !== null && temperature !== undefined) {
      if (temperature > normalRanges.tempMax) {
        anomalies.push({
          metric: 'temperature',
          value: temperature,
          normalRange: `${normalRanges.tempMin.toFixed(1)}-${normalRanges.tempMax.toFixed(1)}°C`,
          severity: 'high',
          message: `High temperature detected: ${temperature.toFixed(1)}°C`
        });
        severity += 2;
      } else if (temperature < normalRanges.tempMin) {
        anomalies.push({
          metric: 'temperature',
          value: temperature,
          normalRange: `${normalRanges.tempMin.toFixed(1)}-${normalRanges.tempMax.toFixed(1)}°C`,
          severity: 'medium',
          message: `Low temperature detected: ${temperature.toFixed(1)}°C`
        });
        severity += 1;
      }
    }
    
    // Check heart rate anomaly
    if (heartRate !== null && heartRate !== undefined) {
      if (heartRate > normalRanges.hrMax) {
        anomalies.push({
          metric: 'heart_rate',
          value: heartRate,
          normalRange: `${normalRanges.hrMin}-${normalRanges.hrMax} BPM`,
          severity: 'high',
          message: `High heart rate detected: ${heartRate} BPM`
        });
        severity += 2;
      } else if (heartRate < normalRanges.hrMin) {
        anomalies.push({
          metric: 'heart_rate',
          value: heartRate,
          normalRange: `${normalRanges.hrMin}-${normalRanges.hrMax} BPM`,
          severity: 'medium',
          message: `Low heart rate detected: ${heartRate} BPM`
        });
        severity += 1;
      }
    }
    
    // Check activity anomaly
    if (activity !== null && activity !== undefined) {
      if (activity < normalRanges.activityMin) {
        anomalies.push({
          metric: 'activity',
          value: activity,
          normalRange: `${normalRanges.activityMin}-${normalRanges.activityMax}`,
          severity: 'medium',
          message: `Low activity detected: ${activity}`
        });
        severity += 1;
      } else if (activity > normalRanges.activityMax) {
        anomalies.push({
          metric: 'activity',
          value: activity,
          normalRange: `${normalRanges.activityMin}-${normalRanges.activityMax}`,
          severity: 'low',
          message: `High activity detected: ${activity}`
        });
        severity += 0.5;
      }
    }
    
    // Determine if this is an anomaly
    const isAnomaly = anomalies.length > 0;
    
    // Store anomaly in database if detected
    if (isAnomaly) {
      // In a real implementation, would store anomalies in a database
      console.log(`Anomaly detected for animal ${animalId} on ${timestamp}:`, anomalies);
    }
    
    return {
      animalId,
      timestamp,
      isAnomaly,
      anomalies,
      overallSeverity: severity > 2 ? 'high' : (severity > 1 ? 'medium' : 'low')
    };
  } catch (error) {
    console.error('Error in anomaly detection:', error);
    throw error;
  }
}

// Get normal ranges for an animal based on its historical data
async function getNormalRangesForAnimal(animalId) {
  try {
    // Get last 7 days of data for this animal
    const healthData = sqliteDb.prepare(`
      SELECT * FROM health_data 
      WHERE animal_id = ? 
      ORDER BY date DESC
      LIMIT 7
    `).all(animalId);
    
    // If no historical data, use default ranges
    if (!healthData || healthData.length === 0) {
      return getDefaultRanges();
    }
    
    // Calculate normal ranges from historical data
    const temperatures = healthData
      .filter(d => d.temperature !== null)
      .map(d => d.temperature);
    
    const heartRates = healthData
      .filter(d => d.heart_rate !== null)
      .map(d => d.heart_rate);
    
    const activities = healthData
      .filter(d => d.activity !== null)
      .map(d => d.activity);
    
    // Calculate mean and standard deviation for each metric
    const tempStats = calculateStats(temperatures);
    const hrStats = calculateStats(heartRates);
    const activityStats = calculateStats(activities);
    
    // Return ranges as mean ± 2 standard deviations
    return {
      tempMin: tempStats.mean - 2 * tempStats.stdDev,
      tempMax: tempStats.mean + 2 * tempStats.stdDev,
      hrMin: Math.round(hrStats.mean - 2 * hrStats.stdDev),
      hrMax: Math.round(hrStats.mean + 2 * hrStats.stdDev),
      activityMin: Math.max(0, activityStats.mean - 2 * activityStats.stdDev),
      activityMax: Math.min(10, activityStats.mean + 2 * activityStats.stdDev)
    };
  } catch (error) {
    console.error('Error getting normal ranges:', error);
    return getDefaultRanges();
  }
}

// Calculate statistics for an array of numbers
function calculateStats(arr) {
  if (!arr || arr.length === 0) {
    return { mean: 0, stdDev: 0 };
  }
  
  const sum = arr.reduce((acc, val) => acc + val, 0);
  const mean = sum / arr.length;
  
  const squaredDifferences = arr.map(val => Math.pow(val - mean, 2));
  const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / arr.length;
  const stdDev = Math.sqrt(variance);
  
  return { mean, stdDev };
}

// Default ranges for cattle vitals
function getDefaultRanges() {
  return {
    tempMin: 38.0, // °C
    tempMax: 39.5, // °C
    hrMin: 60,     // BPM
    hrMax: 90,     // BPM
    activityMin: 3,
    activityMax: 9
  };
}
