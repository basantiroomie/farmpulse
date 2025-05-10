import { useEffect, useState } from 'react';
import useWebSocket from '@/hooks/useWebSocket';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Activity, ThermometerSun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SensorDataMonitorProps {
  animalId: string;
}

const SensorDataMonitor = ({ animalId }: SensorDataMonitorProps) => {
  const [liveData, setLiveData] = useState<any>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const { toast } = useToast();
  
  // WebSocket setup - direct connection to backend server
  const wsUrl = `ws://localhost:3001?type=dashboard&animalId=${animalId}`;
  
  useEffect(() => {
    console.log(`Attempting to connect to WebSocket at: ${wsUrl}`);
  }, [wsUrl]);
  
  const { connected, sendMessage, lastMessage, connectionError, reconnect } = useWebSocket({
    url: wsUrl,
    onMessage: (data) => {
      if (data.type === 'sensorData' && data.animalId === animalId) {
        setLiveData(data);
        
        // Show anomaly alerts
        if (data.anomalyDetected) {
          toast({
            title: "Anomaly Detected",
            description: `Potential health issue detected for animal ${animalId}`,
            variant: "destructive",
          });
        }
        
        // Show pregnancy-related alerts
        if (data.fetalHealthData?.alert) {
          const severity = data.fetalHealthData.alert.severity;
          toast({
            title: "Pregnancy Alert",
            description: data.fetalHealthData.alert.message,
            variant: severity === 'high' ? 'destructive' : (severity === 'medium' ? 'default' : 'warning'),
          });
        }
      } else if (data.type === 'simulationStatus') {
        // Update simulation status
        setSimulating(data.simulations?.includes(animalId) || false);
      }
    }
  });
  
  // Handle simulation control
  const toggleSimulation = () => {
    if (simulating) {
      sendMessage({
        type: 'stopSimulation',
        animalId
      });
    } else {
      sendMessage({
        type: 'startSimulation',
        animalId,
        interval: 5000 // 5 seconds interval
      });
    }
  };
  
  // Request simulation status on initial connection
  useEffect(() => {
    if (connected) {
      sendMessage({
        type: 'getSimulationStatus'
      });
      
      // Show connection success toast
      toast({
        title: "WebSocket Connected",
        description: "Successfully connected to real-time data stream",
        variant: "default",
      });
    } else if (connectionError) {
      // Show connection error toast
      toast({
        title: "WebSocket Connection Failed",
        description: connectionError || "Could not connect to data stream",
        variant: "destructive",
      });
    }
  }, [connected, connectionError, sendMessage, toast]);

  // Find latest temperature, heart rate, etc. from the readings
  const extractLatestReadings = () => {
    if (!liveData?.readings || !Array.isArray(liveData.readings)) {
      return {
        temperature: null,
        humidity: null,
        heartRate: null,
        activity: null,
        fetalHeartRate: null,
        audioLevel: null
      };
    }
    
    let temperature = null;
    let humidity = null;
    let heartRate = null;
    let activity = null;
    let fetalHeartRate = null;
    let audioLevel = null;
    
    for (const reading of liveData.readings) {
      const { sensorType, values } = reading;
      
      if (sensorType === 'DHT11' || sensorType === 'HEALTH') {
        temperature = values.temperature ?? temperature;
        humidity = values.humidity ?? humidity;
      }
      
      if (sensorType === 'HEALTH') {
        heartRate = values.heart_rate ?? values.heartRate ?? heartRate;
        activity = values.activity ?? activity;
      }
      
      if (sensorType === 'MPU6050') {
        activity = activity ?? calculateActivity(values);
      }
      
      if (sensorType === 'PREGNANCY') {
        fetalHeartRate = values.fetal_heart_rate ?? values.fetalHeartRate ?? fetalHeartRate;
      }
      
      if (sensorType === 'MICROPHONE') {
        audioLevel = values.audioLevel ?? audioLevel;
      }
    }
    
    return {
      temperature,
      humidity,
      heartRate,
      activity,
      fetalHeartRate,
      audioLevel
    };
  };
  
  // Calculate activity level from accelerometer data
  const calculateActivity = (values) => {
    if (values.accelX === undefined || values.accelY === undefined || values.accelZ === undefined) {
      return null;
    }
    
    // Simple activity calculation based on acceleration magnitude
    const accelMagnitude = Math.sqrt(
      Math.pow(values.accelX, 2) + 
      Math.pow(values.accelY, 2) + 
      Math.pow(values.accelZ - 9.8, 2) // Subtract gravity
    );
    
    // Scale to 0-10 range
    return Math.min(10, accelMagnitude * 5);
  };
  
  const {
    temperature,
    humidity,
    heartRate,
    activity,
    fetalHeartRate,
    audioLevel
  } = extractLatestReadings();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Live Sensor Data</h3>
        <div className="flex items-center gap-2">
          {connected ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
              <CheckCircle size={14} /> Connected
            </Badge>
          ) : (
            <Badge 
              variant="outline" 
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center gap-1 cursor-pointer hover:bg-red-200 dark:hover:bg-red-800"
              onClick={reconnect}
            >
              <AlertCircle size={14} /> {connectionError || 'Disconnected'} (Click to reconnect)
            </Badge>
          )}
          
          <Button 
            variant={simulating ? 'destructive' : 'default'}
            size="sm"
            onClick={toggleSimulation}
            disabled={!connected}
          >
            {simulating ? 'Stop Simulation' : 'Start Simulation'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Temperature */}
        <div className="border rounded-lg p-4 flex flex-col">
          <div className="text-sm text-muted-foreground">Temperature</div>
          <div className="flex items-baseline mt-1">
            <ThermometerSun className="mr-2 text-blue-500" size={18} />
            {temperature !== null ? (
              <div className="text-2xl font-semibold">
                {temperature.toFixed(1)}°C
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No data</div>
            )}
          </div>
          {humidity !== null && (
            <div className="mt-1 text-xs text-muted-foreground">
              Humidity: {humidity.toFixed(1)}%
            </div>
          )}
        </div>
        
        {/* Heart Rate */}
        <div className="border rounded-lg p-4 flex flex-col">
          <div className="text-sm text-muted-foreground">Heart Rate</div>
          <div className="flex items-baseline mt-1">
            <Activity className="mr-2 text-red-500" size={18} />
            {heartRate !== null ? (
              <div className="text-2xl font-semibold">
                {Math.round(heartRate)} BPM
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No data</div>
            )}
          </div>
          {fetalHeartRate !== null && (
            <div className="mt-1 text-xs text-muted-foreground">
              Fetal HR: {Math.round(fetalHeartRate)} BPM
            </div>
          )}
        </div>
        
        {/* Activity Level */}
        <div className="border rounded-lg p-4 flex flex-col">
          <div className="text-sm text-muted-foreground">Activity Level</div>
          <div className="flex items-baseline mt-1">
            <Activity className="mr-2 text-green-500" size={18} />
            {activity !== null ? (
              <div className="text-2xl font-semibold">
                {activity.toFixed(1)}/10
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No data</div>
            )}
          </div>
          {audioLevel !== null && (
            <div className="mt-1 text-xs text-muted-foreground">
              Audio: {audioLevel.toFixed(1)} dB
            </div>
          )}
        </div>
      </div>
      
      {liveData?.anomalyDetected && (
        <div className="border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mt-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500" size={18} />
            <h4 className="font-medium text-red-800 dark:text-red-300">Anomaly Detected</h4>
          </div>
          <p className="text-sm text-red-700 dark:text-red-400 mt-1">
            Potential health issue detected. Please check animal data.
          </p>
        </div>
      )}
      
      {liveData?.fetalHealthData?.alert && (
        <div className="border border-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mt-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-amber-500" size={18} />
            <h4 className="font-medium text-amber-800 dark:text-amber-300">Pregnancy Alert</h4>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            {liveData.fetalHealthData.alert.message}
          </p>
        </div>
      )}
      
      {!connected && (
        <Button 
          variant="outline"
          onClick={reconnect}
          className="mt-4"
        >
          Reconnect WebSocket
        </Button>
      )}
    </div>
  );
};

export default SensorDataMonitor;
