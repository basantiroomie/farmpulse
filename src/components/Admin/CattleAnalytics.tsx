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

// Mock data - in a real app, this would come from an API
const mockFarmers = {
  'farmer1': {
    name: 'John Smith',
    id: 'farmer1',
    cattle: ['A12345', 'A12347', 'A12349']
  },
  'farmer2': {
    name: 'Sarah Johnson',
    id: 'farmer2',
    cattle: ['A12346', 'A12348', 'A12350']
  }
};

const mockCattleData = {
  'A12345': {
    name: 'Bella',
    breed: 'Holstein',
    metrics: {
      temperature: [
        { date: '2025-01-01', value: 38.5 },
        { date: '2025-02-01', value: 38.7 },
        { date: '2025-03-01', value: 38.6 },
        { date: '2025-04-01', value: 38.8 },
        { date: '2025-05-01', value: 38.9 }
      ],
      'heart-rate': [
        { date: '2025-01-01', value: 68 },
        { date: '2025-02-01', value: 70 },
        { date: '2025-03-01', value: 65 },
        { date: '2025-04-01', value: 72 },
        { date: '2025-05-01', value: 69 }
      ],
      activity: [
        { date: '2025-01-01', value: 75 },
        { date: '2025-02-01', value: 80 },
        { date: '2025-03-01', value: 72 },
        { date: '2025-04-01', value: 85 },
        { date: '2025-05-01', value: 82 }
      ]
    }
  },
  'A12346': {
    name: 'Daisy',
    breed: 'Jersey',
    metrics: {
      temperature: [
        { date: '2025-01-01', value: 38.6 },
        { date: '2025-02-01', value: 38.9 },
        { date: '2025-03-01', value: 38.7 },
        { date: '2025-04-01', value: 38.5 },
        { date: '2025-05-01', value: 38.8 }
      ],
      'heart-rate': [
        { date: '2025-01-01', value: 70 },
        { date: '2025-02-01', value: 68 },
        { date: '2025-03-01', value: 75 },
        { date: '2025-04-01', value: 69 },
        { date: '2025-05-01', value: 72 }
      ],
      activity: [
        { date: '2025-01-01', value: 70 },
        { date: '2025-02-01', value: 68 },
        { date: '2025-03-01', value: 65 },
        { date: '2025-04-01', value: 72 },
        { date: '2025-05-01', value: 67 }
      ]
    }
  }
};

// Chart colors for different datasets
const chartColors = [
  'rgb(75, 192, 192)',   // Teal
  'rgb(255, 99, 132)',   // Coral
  'rgb(54, 162, 235)',   // Blue
  'rgb(255, 206, 86)',   // Yellow
  'rgb(153, 102, 255)',  // Purple
  'rgb(255, 159, 64)'    // Orange
];

export function CattleAnalytics() {
  const [selectedFarmer, setSelectedFarmer] = useState<string>("all");
  const [selectedMetric, setSelectedMetric] = useState<string>("temperature");
  const [Chart, setChart] = useState<any>(null);
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const loadChart = async () => {
      const { Chart: ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } = await import('chart.js');
      ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
      const { Line } = await import('react-chartjs-2');
      setChart(() => Line);
    };
    loadChart();
  }, []);

  // Generate chart data based on selected farmer and metric
  useEffect(() => {
    if (!selectedMetric) return;

    // Get the labels (months)
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    
    // Generate datasets based on selected farmer and metric
    const datasets = [];

    if (selectedFarmer === 'all') {
      // Show data for all farmers grouped by farmer
      Object.keys(mockFarmers).forEach((farmerId, farmerIndex) => {
        const farmer = mockFarmers[farmerId];
        const farmerData = farmer.cattle.flatMap(cattleId => {
          const cattle = mockCattleData[cattleId];
          if (cattle && cattle.metrics[selectedMetric]) {
            return cattle.metrics[selectedMetric].map(d => d.value);
          }
          return [];
        });

        // Calculate averages for each month if there's data
        if (farmerData.length > 0) {
          const avgData = [];
          for (let i = 0; i < 5; i++) {
            const values = farmer.cattle
              .map(cattleId => {
                const cattle = mockCattleData[cattleId];
                return cattle?.metrics[selectedMetric]?.[i]?.value;
              })
              .filter(Boolean);
            
            avgData.push(values.length > 0 
              ? values.reduce((a, b) => a + b, 0) / values.length 
              : null
            );
          }

          datasets.push({
            label: `${farmer.name}'s Cattle`,
            data: avgData,
            borderColor: chartColors[farmerIndex % chartColors.length],
            fill: false,
            tension: 0.1
          });
        }
      });
    } else {
      // Show individual cattle data for the selected farmer
      const farmer = mockFarmers[selectedFarmer];
      if (farmer) {
        farmer.cattle.forEach((cattleId, cattleIndex) => {
          const cattle = mockCattleData[cattleId];
          if (cattle && cattle.metrics[selectedMetric]) {
            datasets.push({
              label: cattle.name,
              data: cattle.metrics[selectedMetric].map(d => d.value),
              borderColor: chartColors[cattleIndex % chartColors.length],
              fill: false,
              tension: 0.1
            });
          }
        });
      }
    }

    setChartData({
      labels,
      datasets
    });
  }, [selectedFarmer, selectedMetric]);
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 15,
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: `${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1).replace('-', ' ')} Trends Over Time`
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => {
            if (selectedMetric === 'temperature') return `${value}°C`;
            if (selectedMetric === 'heart-rate') return `${value} BPM`;
            if (selectedMetric === 'activity') return `${value}%`;
            return value;
          }
        },
        title: {
          display: true,
          text: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1).replace('-', ' ')
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Cattle Analytics</h1>
      <Card className="w-full">
        <CardHeader>          <div className="flex flex-wrap gap-4">
            <Select value={selectedFarmer} onValueChange={setSelectedFarmer}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Farmer" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Farmers</SelectLabel>
                  <SelectItem value="all">All Farmers</SelectItem>
                  {Object.keys(mockFarmers).map(farmerId => (
                    <SelectItem key={farmerId} value={farmerId}>
                      {mockFarmers[farmerId].name}
                    </SelectItem>
                  ))}
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
          <div className="mt-4 text-sm">
            {selectedFarmer === 'all' ? 
              <p>Showing average {selectedMetric.replace('-', ' ')} values for all farmers' cattle</p> : 
              <p>Showing {selectedMetric.replace('-', ' ')} values for {mockFarmers[selectedFarmer]?.name}'s individual cattle</p>
            }
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {Chart && (
              <Chart 
                data={chartData}
                options={chartOptions}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}