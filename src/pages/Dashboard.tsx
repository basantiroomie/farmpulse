
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import VitalsChart from "@/components/Dashboard/VitalsChart";
import { mockHealthData } from "@/lib/sampleData";

const Dashboard = () => {
  const [selectedAnimal, setSelectedAnimal] = useState("A12345");
  const [activeChart, setActiveChart] = useState<"heartRate" | "temperature" | "activity">("temperature");
  
  // Get most recent values (last day in the sample data)
  const latestHeartRate = mockHealthData.heartRate[mockHealthData.heartRate.length - 1];
  const latestTemperature = mockHealthData.temperature[mockHealthData.temperature.length - 1];
  const latestActivity = mockHealthData.activity[mockHealthData.activity.length - 1];

  const handleViewHistory = (metric: "heartRate" | "temperature" | "activity") => {
    setActiveChart(metric);
    // Scroll to chart
    document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Health Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Sample data visualization for animal health metrics</p>
        </div>
        
        <Card className="mt-4 md:mt-0">
          <CardContent className="py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Animal ID:</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono">
                {selectedAnimal}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Temperature"
          value={latestTemperature}
          unit="°C"
          description="Current body temperature"
          metricType="temperature"
          onClick={() => handleViewHistory("temperature")}
        />
        <DashboardCard
          title="Heart Rate"
          value={latestHeartRate}
          unit="bpm"
          description="Current heart rate"
          metricType="heartRate"
          onClick={() => handleViewHistory("heartRate")}
        />
        <DashboardCard
          title="Activity"
          value={latestActivity}
          unit="score"
          description="Movement level (0-10)"
          metricType="activity"
          onClick={() => handleViewHistory("activity")}
        />
      </div>
      
      {/* Chart Section */}
      <div id="chart-section" className="mb-8">
        <VitalsChart animalId={selectedAnimal} />
      </div>
      
      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Health Status History</CardTitle>
            <CardDescription>Last 7 days of records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(7)].map((_, i) => {
                const day = 6 - i;
                const tempStatus = mockHealthData.temperature[day] > 40 ? "critical" : 
                  mockHealthData.temperature[day] > 39 ? "warning" : "normal";
                const hrStatus = mockHealthData.heartRate[day] > 90 ? "critical" : 
                  mockHealthData.heartRate[day] > 80 ? "warning" : "normal";
                const actStatus = mockHealthData.activity[day] < 4 ? "critical" : 
                  mockHealthData.activity[day] < 7 ? "warning" : "normal";
                
                const overallStatus = tempStatus === "critical" || hrStatus === "critical" || actStatus === "critical" ? "critical" :
                  tempStatus === "warning" || hrStatus === "warning" || actStatus === "warning" ? "warning" : "normal";
                
                const statusColors = {
                  normal: "bg-success/20 text-success",
                  warning: "bg-warning/20 text-warning",
                  critical: "bg-danger/20 text-danger",
                };
                
                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm">Day {day + 1}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[overallStatus]}`}>
                      {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Health Alerts</CardTitle>
            <CardDescription>Notifications requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                      Animal ID: {selectedAnimal} has shown elevated temperature for 4 consecutive days.
                      Current: 40.3°C (Critical threshold: 40.0°C)
                    </p>
                  </div>
                </div>
              </div>
              
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
                      Animal ID: {selectedAnimal} has shown decreased activity for 5 consecutive days.
                      Current: 1/10 (Critical threshold: below 4/10)
                    </p>
                  </div>
                </div>
              </div>
              
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
                      Current: 95 bpm (Warning threshold: 80 bpm)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
