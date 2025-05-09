import React from 'react';
import { SystemOverview } from '@/components/Admin/SystemOverview';
import { CattleAnalytics } from '@/components/Admin/CattleAnalytics';
import { AlertsManagement } from '@/components/Admin/AlertsManagement';
import { UserManagement } from '@/components/Admin/UserManagement';
import { Reports } from '@/components/Admin/Reports';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// We'll use this mock data temporarily - in a real app, this would come from an API
const mockData = {
  overview: {
    totalAnimals: 156,
    criticalCases: 3,
    recentVisits: 12
  },
  analytics: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Temperature',
        data: [38.5, 38.7, 38.6, 38.8, 38.9],
        borderColor: 'rgb(75, 192, 192)',
        fill: false
      }
    ]
  },
  alerts: [
    {
      id: '1',
      animalId: 'A12345',
      severity: 'critical' as const,
      issue: 'High Temperature',
      timestamp: '2025-05-09T10:30:00',
    },
    {
      id: '2',
      animalId: 'A12346',
      severity: 'warning' as const,
      issue: 'Low Activity',
      timestamp: '2025-05-09T09:15:00',
    }
  ],
  users: [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'Farmer',
      status: 'active' as const
    }
  ],
  cattle: [
    {
      id: 'A12345',
      name: 'Bella',
      breed: 'Holstein',
      age: 3,
      location: 'Pen A',
      status: 'healthy' as const
    },
    {
      id: 'A12346',
      name: 'Daisy',
      breed: 'Jersey',
      age: 4,
      location: 'Pen B',
      status: 'warning' as const
    }
  ],
  devices: [
    {
      id: 'D1234',
      animalId: 'A12345',
      batteryLevel: 85,
      signalStrength: 92,
      lastSync: '2025-05-09T10:00:00'
    },
    {
      id: 'D1235',
      animalId: 'A12346',
      batteryLevel: 72,
      signalStrength: 88,
      lastSync: '2025-05-09T10:05:00'
    }
  ],
  reports: {
    healthMetrics: [
      { name: 'Average Temperature', value: '38.5°C', change: -0.2 },
      { name: 'Activity Level', value: '87%', change: 5 },
      { name: 'Health Score', value: '92/100', change: 3 }
    ],
    productivityMetrics: [
      { name: 'Milk Production', value: '28L/day', change: 4 },
      { name: 'Feed Consumption', value: '22kg/day', change: -1 },
      { name: 'Rest Time', value: '12hrs/day', change: 2 }
    ],
    complianceMetrics: [
      { name: 'Health Checks', value: '100%', change: 0 },
      { name: 'Vaccination Status', value: '98%', change: 2 },
      { name: 'Documentation', value: '95%', change: 5 }
    ]
  }
};

export default function AdminDashboard() {
  const { toast } = useToast();

  const handleAssignVet = (alertId: string, vetId: string) => {
    // In a real app, this would make an API call
    toast({
      title: "Vet Assigned",
      description: `Alert ${alertId} has been assigned to vet ${vetId}`,
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <SystemOverview 
        totalAnimals={mockData.overview.totalAnimals}
        criticalCases={mockData.overview.criticalCases}
        recentVisits={mockData.overview.recentVisits}
      />

      <Tabs defaultValue="analytics" className="mt-8">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <CattleAnalytics data={mockData.analytics} />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <AlertsManagement 
            alerts={mockData.alerts}
            onAssignVet={handleAssignVet}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagement 
            users={mockData.users}
            cattle={mockData.cattle}
            devices={mockData.devices}
          />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Reports 
            healthMetrics={mockData.reports.healthMetrics}
            productivityMetrics={mockData.reports.productivityMetrics}
            complianceMetrics={mockData.reports.complianceMetrics}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}