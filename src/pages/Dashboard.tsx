
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import VitalsChart from "@/components/Dashboard/VitalsChart";
import AnimalSelector from "@/components/Dashboard/AnimalSelector";
import { useToast } from "@/components/ui/use-toast";
import { fetchAllAnimalData, AnimalWithData } from "@/lib/api";
import { Baby, Loader2 } from "lucide-react";

const Dashboard = () => {
  const [selectedAnimal, setSelectedAnimal] = useState("A12345");
  const [activeChart, setActiveChart] = useState<"heartRate" | "temperature" | "activity">("temperature");
  const [animalData, setAnimalData] = useState<AnimalWithData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get animal data
  useEffect(() => {
    const getAnimalData = async () => {
      setLoading(true);
      
      try {
        const data = await fetchAllAnimalData(selectedAnimal);
        
        if (data) {
          setAnimalData(data);
        } else {
          toast({
            title: "Error loading animal data",
            description: `Could not load data for animal ${selectedAnimal}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading animal data:", error);
        toast({
          title: "Error loading animal data",
          description: "Could not connect to the server",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    getAnimalData();
  }, [selectedAnimal]);

  const handleViewHistory = (metric: "heartRate" | "temperature" | "activity") => {
    setActiveChart(metric);
    // Scroll to chart
    document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get most recent values (last day in the health data)
  const getLatestHealthData = () => {
    if (!animalData || !animalData.healthData || animalData.healthData.length === 0) {
      return { heartRate: 0, temperature: 0, activity: 0 };
    }
    
    const latestData = animalData.healthData[animalData.healthData.length - 1];
    return {
      heartRate: latestData.heart_rate,
      temperature: latestData.temperature,
      activity: latestData.activity,
    };
  };

  const latestData = getLatestHealthData();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading animal data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Health Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Real-time health metrics for livestock</p>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <AnimalSelector 
            selectedAnimal={selectedAnimal} 
            onAnimalChange={setSelectedAnimal} 
          />
        </div>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Temperature"
          value={latestData.temperature}
          unit="°C"
          description="Current body temperature"
          metricType="temperature"
          onClick={() => handleViewHistory("temperature")}
        />
        <DashboardCard
          title="Heart Rate"
          value={latestData.heartRate}
          unit="bpm"
          description="Current heart rate"
          metricType="heartRate"
          onClick={() => handleViewHistory("heartRate")}
        />
        <DashboardCard
          title="Activity"
          value={latestData.activity}
          unit="score"
          description="Movement level (0-10)"
          metricType="activity"
          onClick={() => handleViewHistory("activity")}
        />
        
        {/* Pregnancy Card */}
        {animalData && animalData.pregnancyData && (
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">Pregnancy Status</CardTitle>
              <div className={`px-2 py-1 rounded-md ${animalData.pregnancyData.status === "Confirmed" ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground border border-muted"} text-xs font-medium flex items-center gap-1`}>
                <Baby className="h-4 w-4" />
                {animalData.pregnancyData.status}
              </div>
            </CardHeader>
            <CardContent>
              {animalData.pregnancyData.status === "Confirmed" ? (
                <div className="flex flex-col space-y-4">
                  <div>
                    <div className="text-3xl font-bold">
                      {animalData.pregnancyData.gestation_days}
                      <span className="text-sm font-normal text-muted-foreground"> days</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Gestation Progress</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-medium">{animalData.pregnancyData.expected_due_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fetal HR:</span>
                      <span className="font-medium">{animalData.pregnancyData.fetal_heart_rate} bpm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Check:</span>
                      <span className="font-medium">{animalData.pregnancyData.last_checkup}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[170px] flex items-center justify-center">
                  <p className="text-muted-foreground">No pregnancy data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Chart Section */}
      <div id="chart-section" className="mb-8">
        {animalData && animalData.healthData && (
          <VitalsChart 
            animalId={selectedAnimal}
            healthData={animalData.healthData}
          />
        )}
      </div>
      
      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Health Status History</CardTitle>
            <CardDescription>Last 7 days of records</CardDescription>
          </CardHeader>
          <CardContent>
            {animalData && animalData.healthData && animalData.healthData.length > 0 ? (
              <div className="space-y-4">
                {animalData.healthData.map((data, index) => {
                  const tempStatus = data.temperature > 40 ? "critical" : 
                    data.temperature > 39 ? "warning" : "normal";
                  const hrStatus = data.heart_rate > 90 ? "critical" : 
                    data.heart_rate > 80 ? "warning" : "normal";
                  const actStatus = data.activity < 4 ? "critical" : 
                    data.activity < 7 ? "warning" : "normal";
                  
                  const overallStatus = tempStatus === "critical" || hrStatus === "critical" || actStatus === "critical" ? "critical" :
                    tempStatus === "warning" || hrStatus === "warning" || actStatus === "warning" ? "warning" : "normal";
                  
                  const statusColors = {
                    normal: "bg-success/20 text-success",
                    warning: "bg-warning/20 text-warning",
                    critical: "bg-danger/20 text-danger",
                  };
                  
                  return (
                    <div key={data.id} className="flex items-center justify-between">
                      <span className="text-sm">{new Date(data.date).toLocaleDateString()}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[overallStatus]}`}>
                        {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">No health history available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Health Alerts</CardTitle>
            <CardDescription>Notifications requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {animalData && animalData.healthData && animalData.healthData.length > 0 ? (
              <div className="space-y-4">
                {/* Temperature Alert */}
                {latestData.temperature > 40.0 && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-md">
                    <div className="flex items-start gap-3">
                      <div className="text-danger mt-0.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-danger">High Temperature Alert</h4>
                        <p className="text-xs mt-1 text-muted-foreground">
                          Animal ID: {selectedAnimal} has shown elevated temperature.
                          Current: {latestData.temperature}°C (Critical threshold: 40.0°C)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Activity Alert */}
                {latestData.activity < 4 && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-md">
                    <div className="flex items-start gap-3">
                      <div className="text-danger mt-0.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-danger">Low Activity Alert</h4>
                        <p className="text-xs mt-1 text-muted-foreground">
                          Animal ID: {selectedAnimal} has shown decreased activity.
                          Current: {latestData.activity}/10 (Critical threshold: below 4/10)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Heart Rate Alert */}
                {latestData.heartRate > 90 && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-md">
                    <div className="flex items-start gap-3">
                      <div className="text-danger mt-0.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-danger">Elevated Heart Rate</h4>
                        <p className="text-xs mt-1 text-muted-foreground">
                          Animal ID: {selectedAnimal} showing increased heart rate.
                          Current: {latestData.heartRate} bpm (Critical threshold: 90 bpm)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Heart Rate Warning */}
                {latestData.heartRate <= 90 && latestData.heartRate > 80 && (
                  <div className="p-3 bg-warning/10 border border-warning/30 rounded-md">
                    <div className="flex items-start gap-3">
                      <div className="text-warning mt-0.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                          <line x1="12" y1="9" x2="12" y2="13"></line>
                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-warning">Elevated Heart Rate</h4>
                        <p className="text-xs mt-1 text-muted-foreground">
                          Animal ID: {selectedAnimal} showing increased heart rate.
                          Current: {latestData.heartRate} bpm (Warning threshold: 80 bpm)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* No Alerts */}
                {latestData.temperature <= 40.0 && latestData.activity >= 4 && latestData.heartRate <= 80 && (
                  <div className="p-3 bg-success/10 border border-success/30 rounded-md">
                    <div className="flex items-start gap-3">
                      <div className="text-success mt-0.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-success">All Health Parameters Normal</h4>
                        <p className="text-xs mt-1 text-muted-foreground">
                          Animal ID: {selectedAnimal} is showing normal health vitals.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Pregnancy Alert if applicable */}
                {animalData.pregnancyData && animalData.pregnancyData.status === "Confirmed" && 
                 animalData.pregnancyData.fetal_heart_rate > 0 && 
                 (animalData.pregnancyData.fetal_heart_rate < 160 || animalData.pregnancyData.fetal_heart_rate > 200) && (
                  <div className="p-3 bg-danger/10 border border-danger/30 rounded-md mt-4">
                    <div className="flex items-start gap-3">
                      <div className="text-danger mt-0.5">
                        <Baby className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-danger">Abnormal Fetal Heart Rate</h4>
                        <p className="text-xs mt-1 text-muted-foreground">
                          Animal ID: {selectedAnimal} has abnormal fetal heart rate.
                          Current: {animalData.pregnancyData.fetal_heart_rate} bpm 
                          (Normal range: 160-200 bpm)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">No alerts available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
