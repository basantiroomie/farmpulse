
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { healthRanges } from "@/lib/sampleData";
import { PregnancyStat } from "@/lib/api";
import { format } from "date-fns";

interface PregnancyStatsChartProps {
  animalId: string;
  pregnancyStats: PregnancyStat[];
}

const PregnancyStatsChart = ({ animalId, pregnancyStats }: PregnancyStatsChartProps) => {
  const [activeMetric, setActiveMetric] = useState<"heartRate" | "temperature" | "fetalHeartRate">("fetalHeartRate");
  
  // Format the data for the chart
  const chartData = pregnancyStats.map((data) => ({
    name: format(new Date(data.date), 'MMM d'),
    date: data.date,
    heartRate: data.heart_rate,
    temperature: data.temperature,
    fetalHeartRate: data.fetal_heart_rate,
    activity: data.activity,
    notes: data.notes,
  }));

  // Define the display settings for each metric
  const metricSettings = {
    heartRate: {
      title: "Heart Rate",
      unit: "bpm",
      normalRange: `${healthRanges.heartRate.normal.min}-${healthRanges.heartRate.normal.max} bpm`,
      color: "#60a5fa", // blue
      min: healthRanges.heartRate.normal.min - 10,
      max: healthRanges.heartRate.warning.max + 10,
    },
    temperature: {
      title: "Temperature",
      unit: "°C",
      normalRange: `${healthRanges.temperature.normal.min}-${healthRanges.temperature.normal.max} °C`,
      color: "#f97316", // orange
      min: healthRanges.temperature.normal.min - 0.5,
      max: healthRanges.temperature.warning.max + 0.5,
    },
    fetalHeartRate: {
      title: "Fetal Heart Rate",
      unit: "bpm",
      normalRange: `${healthRanges.pregnancy.fetalHeartRate.normal.min}-${healthRanges.pregnancy.fetalHeartRate.normal.max} bpm`,
      color: "#ec4899", // pink
      min: 150,
      max: 210,
    },
  };

  // Custom tooltip to show data and notes
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const data = payload[0].payload;
      const metric = activeMetric;
      const settings = metricSettings[metric];
      
      let status = "normal";
      if (metric === "fetalHeartRate") {
        if (value < healthRanges.pregnancy.fetalHeartRate.warning.min || value > healthRanges.pregnancy.fetalHeartRate.warning.max) {
          status = "critical";
        } else if (value < healthRanges.pregnancy.fetalHeartRate.normal.min || value > healthRanges.pregnancy.fetalHeartRate.normal.max) {
          status = "warning";
        }
      } else if (metric === "temperature") {
        if (value > healthRanges.temperature.warning.max) {
          status = "critical";
        } else if (value > healthRanges.temperature.normal.max) {
          status = "warning";
        }
      } else if (metric === "heartRate") {
        if (value > healthRanges.heartRate.warning.max) {
          status = "critical";
        } else if (value > healthRanges.heartRate.normal.max) {
          status = "warning";
        }
      }
      
      const statusColors = {
        normal: "bg-success/20 text-success border-success/30",
        warning: "bg-warning/20 text-warning border-warning/30",
        critical: "bg-danger/20 text-danger border-danger/30",
      };
      
      return (
        <div className="bg-background p-3 shadow-md border rounded-md space-y-2">
          <p className="font-medium">{format(new Date(data.date), 'MMM d, yyyy')}</p>
          <p className={`px-2 py-1 rounded ${statusColors[status]}`}>
            {value} {settings.unit}
          </p>
          {data.notes && data.notes !== "Fallback data" && (
            <p className="text-xs text-muted-foreground border-t pt-2 mt-2">{data.notes}</p>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Pregnancy Health Tracking - Animal ID: {animalId}</span>
          <span className="text-sm font-normal text-muted-foreground">
            Normal range: {metricSettings[activeMetric].normalRange}
          </span>
        </CardTitle>
        <Tabs defaultValue="fetalHeartRate" onValueChange={(v) => setActiveMetric(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fetalHeartRate">Fetal Heart Rate</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="heartRate">Heart Rate</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-80">
        {pregnancyStats.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No pregnancy data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis domain={[metricSettings[activeMetric].min, metricSettings[activeMetric].max]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {activeMetric === "fetalHeartRate" && (
                <>
                  <ReferenceLine y={healthRanges.pregnancy.fetalHeartRate.normal.min} stroke="#84cc16" strokeDasharray="3 3" />
                  <ReferenceLine y={healthRanges.pregnancy.fetalHeartRate.normal.max} stroke="#84cc16" strokeDasharray="3 3" />
                </>
              )}
              {activeMetric === "temperature" && (
                <>
                  <ReferenceLine y={healthRanges.temperature.normal.max} stroke="#84cc16" strokeDasharray="3 3" />
                  <ReferenceLine y={healthRanges.temperature.warning.max} stroke="#f59e0b" strokeDasharray="3 3" />
                </>
              )}
              {activeMetric === "heartRate" && (
                <>
                  <ReferenceLine y={healthRanges.heartRate.normal.max} stroke="#84cc16" strokeDasharray="3 3" />
                  <ReferenceLine y={healthRanges.heartRate.warning.max} stroke="#f59e0b" strokeDasharray="3 3" />
                </>
              )}
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
        )}
      </CardContent>
    </Card>
  );
};

export default PregnancyStatsChart;
