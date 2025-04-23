
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { mockHealthData, dayLabels, healthRanges } from "@/lib/sampleData";

interface VitalsChartProps {
  animalId?: string;
}

const VitalsChart = ({ animalId = "A12345" }: VitalsChartProps) => {
  const [activeMetric, setActiveMetric] = useState<"heartRate" | "temperature" | "activity">("temperature");
  
  // Format the data for the chart
  const chartData = dayLabels.map((day, index) => ({
    name: day,
    heartRate: mockHealthData.heartRate[index],
    temperature: mockHealthData.temperature[index],
    activity: mockHealthData.activity[index],
  }));

  // Define the display settings for each metric
  const metricSettings = {
    heartRate: {
      title: "Heart Rate",
      unit: "bpm",
      normalRange: `${healthRanges.heartRate.normal.min}-${healthRanges.heartRate.normal.max} bpm`,
      color: "#60a5fa", // blue
      warningThreshold: healthRanges.heartRate.warning.max,
    },
    temperature: {
      title: "Temperature",
      unit: "°C",
      normalRange: `${healthRanges.temperature.normal.min}-${healthRanges.temperature.normal.max} °C`,
      color: "#f97316", // orange
      warningThreshold: healthRanges.temperature.warning.max,
    },
    activity: {
      title: "Activity",
      unit: "score",
      normalRange: `${healthRanges.activity.normal.min}-${healthRanges.activity.normal.max} (score)`,
      color: "#10b981", // green
      warningThreshold: healthRanges.activity.warning.min,
    },
  };

  // Get domain for Y axis based on metric
  const getYAxisDomain = (metric: "heartRate" | "temperature" | "activity") => {
    const values = mockHealthData[metric];
    const min = Math.min(...values) * 0.9;
    const max = Math.max(...values) * 1.1;
    return [min, max];
  };

  // Custom tooltip to highlight abnormal values
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const metric = activeMetric;
      const settings = metricSettings[metric];
      
      let status = "normal";
      if (metric === "activity") {
        if (value < healthRanges.activity.warning.min) status = "warning";
        if (value < healthRanges.activity.normal.min) status = "critical";
      } else {
        if (value > healthRanges[metric].warning.min) status = "warning";
        if (value > settings.warningThreshold) status = "critical";
      }
      
      const statusColors = {
        normal: "bg-success/20 text-success border-success/30",
        warning: "bg-warning/20 text-warning border-warning/30",
        critical: "bg-danger/20 text-danger border-danger/30",
      };
      
      return (
        <div className="bg-background p-2 shadow-md border rounded-md">
          <p className="font-medium text-sm">{label}</p>
          <p className={`text-sm px-2 py-1 mt-1 rounded ${statusColors[status]}`}>
            {value} {settings.unit}
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Health Vitals - Animal ID: {animalId}</span>
          <span className="text-sm font-normal text-muted-foreground">
            Normal range: {metricSettings[activeMetric].normalRange}
          </span>
        </CardTitle>
        <Tabs defaultValue="temperature" onValueChange={(v) => setActiveMetric(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="heartRate">Heart Rate</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" />
            <YAxis domain={getYAxisDomain(activeMetric)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={activeMetric}
              stroke={metricSettings[activeMetric].color}
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VitalsChart;
