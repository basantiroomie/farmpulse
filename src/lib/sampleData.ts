export const healthRanges = {
  temperature: {
    normal: { min: 38.0, max: 39.0 },
    warning: { min: 39.1, max: 40.0 }
  },
  heartRate: {
    normal: { min: 60, max: 80 },
    warning: { min: 81, max: 90 }
  },
  activity: {
    normal: { min: 7, max: 10 },
    warning: { min: 4, max: 6.9 }
  },
  pregnancy: {
    fetalHeartRate: {
      normal: { min: 160, max: 200 },
      warning: { min: 150, max: 210 }
    }
  }
};

// Determine health status based on value and metric type
export const getHealthStatus = (
  value: number, 
  metricType: "heartRate" | "temperature" | "activity"
): "normal" | "warning" | "critical" => {
  if (!value && value !== 0) return "normal";
  
  switch (metricType) {
    case "temperature":
      if (value > healthRanges.temperature.warning.max) return "critical";
      if (value > healthRanges.temperature.normal.max) return "warning";
      return "normal";
    
    case "heartRate":
      if (value > healthRanges.heartRate.warning.max) return "critical";
      if (value > healthRanges.heartRate.normal.max) return "warning";
      return "normal";
    
    case "activity":
      if (value < healthRanges.activity.warning.min) return "critical";
      if (value < healthRanges.activity.normal.min) return "warning";
      return "normal";
      
    default:
      return "normal";
  }
};

// Generate color for health status
export const getStatusColor = (
  status: "normal" | "warning" | "critical"
): string => {
  switch (status) {
    case "normal":
      return "text-success";
    case "warning":
      return "text-warning";
    case "critical":
      return "text-danger";
    default:
      return "text-muted-foreground";
  }
};

// Utility to format dates consistently
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};