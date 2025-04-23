// Sample data for 7 days of animal health metrics
export const mockHealthData = {
  heartRate: [72, 74, 73, 90, 102, 98, 95], // Infection pattern
  temperature: [38.5, 38.7, 39, 39.5, 40, 40.2, 40.3], // Fever
  activity: [8, 8, 7, 5, 3, 2, 1], // Mobility issue
  pregnancy: {
    status: "Confirmed",
    gestationDays: 150,
    expectedDueDate: "2025-09-20",
    lastCheckup: "2025-04-15",
    fetalHeartRate: 175, // Normal range: 170-190 bpm
  }
};

// Reference ranges for health metrics
export const healthRanges = {
  heartRate: {
    normal: { min: 60, max: 80 },
    warning: { min: 80, max: 90 },
    // Above 90 is considered critical
  },
  temperature: {
    normal: { min: 38.0, max: 39.0 },
    warning: { min: 39.0, max: 40.0 },
    // Above 40.0 is considered critical
  },
  activity: {
    normal: { min: 7, max: 10 },
    warning: { min: 4, max: 7 },
    // Below 4 is considered critical
  },
  pregnancy: {
    fetalHeartRate: {
      normal: { min: 170, max: 190 },
      warning: { min: 160, max: 200 },
      // Below 160 or above 200 is considered critical
    }
  }
};

// Helper function to get status based on value and ranges
export const getHealthStatus = (value: number, metricType: keyof typeof healthRanges) => {
  const ranges = healthRanges[metricType];
  
  if (metricType === 'heartRate') {
    if (value <= ranges.normal.max) return 'normal';
    if (value <= ranges.warning.max) return 'warning';
    return 'critical';
  }
  
  if (metricType === 'temperature') {
    if (value <= ranges.normal.max) return 'normal';
    if (value <= ranges.warning.max) return 'warning';
    return 'critical';
  }
  
  if (metricType === 'activity') {
    if (value >= ranges.normal.min) return 'normal';
    if (value >= ranges.warning.min) return 'warning';
    return 'critical';
  }
  
  if (metricType === 'pregnancy') {
    const fetalRanges = ranges.pregnancy.fetalHeartRate;
    if (value >= fetalRanges.normal.min && value <= fetalRanges.normal.max) return 'normal';
    if (value >= fetalRanges.warning.min && value <= fetalRanges.warning.max) return 'warning';
    return 'critical';
  }
  
  return 'normal';
};

// Labels for the chart
export const dayLabels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

// Metrics information
export const metricsInfo = {
  heartRate: {
    title: 'Heart Rate',
    unit: 'bpm',
    description: 'Beats per minute',
    icon: 'heart'
  },
  temperature: {
    title: 'Temperature',
    unit: '°C',
    description: 'Body temperature',
    icon: 'thermometer'
  },
  activity: {
    title: 'Activity',
    unit: 'score',
    description: 'Movement level (0-10)',
    icon: 'activity'
  },
  pregnancy: {
    title: 'Pregnancy Status',
    unit: 'days',
    description: 'Gestation progress and health',
    icon: 'baby'
  }
};
