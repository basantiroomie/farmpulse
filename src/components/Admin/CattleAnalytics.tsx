import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import type { ChartData, ChartOptions } from 'chart.js';

interface AnalyticsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }[];
}

interface CattleAnalyticsProps {
  data: AnalyticsData;
}

export function CattleAnalytics({ data }: CattleAnalyticsProps) {
  const [selectedAnimal, setSelectedAnimal] = useState("all");
  const [selectedMetric, setSelectedMetric] = useState("temperature");
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    const loadChart = async () => {
      const { Chart: ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } = await import('chart.js');
      ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
      const { Line } = await import('react-chartjs-2');
      setChart(() => Line);
    };
    loadChart();
  }, []);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Health Trends Over Time'
      },
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cattle Health Analytics</CardTitle>
        <div className="flex flex-wrap gap-4">
          <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Animal" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Animals</SelectLabel>
                <SelectItem value="all">All Animals</SelectItem>
                <SelectItem value="group-a">Group A</SelectItem>
                <SelectItem value="group-b">Group B</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Metrics</SelectLabel>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="heart-rate">Heart Rate</SelectItem>
                <SelectItem value="activity">Activity Level</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DatePickerWithRange className="w-[280px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {Chart && (
            <Chart 
              data={data}
              options={chartOptions}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}