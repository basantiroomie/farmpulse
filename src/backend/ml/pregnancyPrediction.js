import { db } from '../db/database.js';

// Process fetal heart rate data to detect issues and predict due date
export async function processFetusHeartRate(data) {
  try {
    const { animalId, fetalHeartRate, gestationDays, timestamp } = data;
    
    // Get pregnancy data for this animal
    const pregnancyData = db.prepare(`
      SELECT * FROM pregnancy_data 
      WHERE animal_id = ?
    `).get(animalId);
    
    if (!pregnancyData || pregnancyData.status !== 'Confirmed') {
      return {
        animalId,
        isPregnant: false,
        message: 'Animal is not registered as pregnant'
      };
    }
    
    // Check fetal heart rate against normal ranges based on gestation
    const { normalMin, normalMax } = getFetalHeartRateRange(gestationDays);
    
    // Create response object
    const response = {
      animalId,
      timestamp,
      isPregnant: true,
      fetalHeartRate,
      gestationDays,
      expectedDueDate: pregnancyData.expected_due_date,
      normalRange: `${normalMin}-${normalMax} BPM`,
      health: 'normal',
      confidenceInterval: calculateConfidenceInterval(gestationDays)
    };
    
    // Check if heart rate is outside normal range
    if (fetalHeartRate < normalMin) {
      response.health = 'concern';
      response.alert = {
        type: 'warning',
        message: `Fetal heart rate (${fetalHeartRate} BPM) is below normal range for gestation day ${gestationDays}`,
        severity: 'medium'
      };
    } else if (fetalHeartRate < normalMin + 5) {
      response.health = 'monitor';
      response.alert = {
        type: 'info',
        message: `Fetal heart rate (${fetalHeartRate} BPM) is at lower end of normal range`,
        severity: 'low'
      };
    } else if (fetalHeartRate > normalMax) {
      response.health = 'concern';
      response.alert = {
        type: 'warning',
        message: `Fetal heart rate (${fetalHeartRate} BPM) is above normal range for gestation day ${gestationDays}`,
        severity: 'medium'
      };
    } else if (fetalHeartRate > normalMax - 5) {
      response.health = 'monitor';
      response.alert = {
        type: 'info',
        message: `Fetal heart rate (${fetalHeartRate} BPM) is at upper end of normal range`,
        severity: 'low'
      };
    }
    
    // Check for patterns over time (would use ML model in production)
    const recentStats = db.prepare(`
      SELECT * FROM pregnancy_stats
      WHERE animal_id = ?
      ORDER BY date DESC
      LIMIT 7
    `).all(animalId);
    
    if (recentStats && recentStats.length > 3) {
      const rates = recentStats
        .filter(stat => stat.fetal_heart_rate !== null)
        .map(stat => stat.fetal_heart_rate);
      
      // Calculate trend (simple linear regression)
      const trend = calculateTrend(rates);
      
      if (trend < -3 && rates.length >= 3) {
        // Heart rate decreasing significantly
        response.trend = 'decreasing';
        response.trendValue = trend;
        
        if (response.health === 'normal') {
          response.health = 'monitor';
          response.alert = {
            type: 'info',
            message: `Decreasing fetal heart rate trend detected (${trend.toFixed(1)} BPM/day)`,
            severity: 'low'
          };
        } else if (response.health === 'monitor' || response.health === 'concern') {
          response.alert.message += `. Decreasing trend detected (${trend.toFixed(1)} BPM/day)`;
          response.alert.severity = 'medium';
        }
      } else if (trend > 3 && rates.length >= 3) {
        // Heart rate increasing significantly
        response.trend = 'increasing';
        response.trendValue = trend;
        
        if (response.health === 'normal') {
          response.health = 'monitor';
          response.alert = {
            type: 'info',
            message: `Increasing fetal heart rate trend detected (${trend.toFixed(1)} BPM/day)`,
            severity: 'low'
          };
        }
      } else if (rates.length >= 3) {
        response.trend = 'stable';
        response.trendValue = trend;
      }
    }
    
    // In a full implementation, we would also adjust the due date estimate
    // based on fetal development markers, size, and heart rate patterns
    
    return response;
  } catch (error) {
    console.error('Error in fetal heart rate processing:', error);
    throw error;
  }
}

// Get normal fetal heart rate range based on gestation days
function getFetalHeartRateRange(gestationDays) {
  // Cattle fetal heart rate generally decreases as gestation progresses
  if (gestationDays < 60) {
    return { normalMin: 165, normalMax: 190 };
  } else if (gestationDays < 120) {
    return { normalMin: 160, normalMax: 185 };
  } else if (gestationDays < 180) {
    return { normalMin: 150, normalMax: 180 };
  } else if (gestationDays < 240) {
    return { normalMin: 140, normalMax: 175 };
  } else {
    return { normalMin: 130, normalMax: 165 };
  }
}

// Calculate confidence interval for due date based on current information
function calculateConfidenceInterval(gestationDays) {
  // Confidence interval narrows as pregnancy progresses
  let dayVariance;
  
  if (gestationDays < 90) {
    dayVariance = 14; // ±14 days early in pregnancy
  } else if (gestationDays < 180) {
    dayVariance = 10; // ±10 days in middle of pregnancy
  } else if (gestationDays < 240) {
    dayVariance = 7;  // ±7 days in third trimester
  } else {
    dayVariance = 5;  // ±5 days near term
  }
  
  // Cattle gestation period is approximately 285 days
  const daysRemaining = 285 - gestationDays;
  
  return {
    daysRange: dayVariance,
    minDays: Math.max(0, daysRemaining - dayVariance),
    maxDays: daysRemaining + dayVariance
  };
}

// Calculate trend from an array of values (simple linear regression slope)
function calculateTrend(values) {
  if (!values || values.length < 2) {
    return 0;
  }
  
  // Calculate using linear regression
  const n = values.length;
  const xValues = Array.from(Array(n).keys()); // [0, 1, 2, ...]
  
  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = values.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * values[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
  
  // Calculate slope
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  // Return daily trend (negative means decreasing)
  return -slope; // Negative because latest readings are at the beginning of the array
}
