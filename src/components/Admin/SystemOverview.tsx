import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertCircle, Calendar, ChevronUp, ChevronDown } from "lucide-react";

// Enhanced mock data with more precise information
const mockData = {
  animalMonitoring: {
    total: 156,
    bySpecies: {
      cattle: 78,
      sheep: 42,
      goats: 18,
      pigs: 14,
      horses: 4
    },
    trend: '+8% since last month',
    detailedAnimals: [
      { id: 'C123', name: 'Bella', species: 'cattle', age: '3 years', status: 'Healthy', lastCheck: '2025-05-09' },
      { id: 'C124', name: 'Max', species: 'cattle', age: '4 years', status: 'Monitoring', lastCheck: '2025-05-10' },
      { id: 'S101', name: 'Wooley', species: 'sheep', age: '2 years', status: 'Treatment', lastCheck: '2025-05-08' }
    ]
  },
  attentionNeeded: {
    total: 7,
    critical: 3,
    warning: 4,
    byIssue: {
      'Abnormal Vital Signs': 2,
      'Decreased Feeding': 3,
      'Irregular Movement': 1,
      'Temperature Alert': 1
    },
    detailedCases: [
      {
        animalId: 'C124',
        name: 'Max',
        severity: 'critical',
        issue: 'Abnormal Vital Signs',
        vitals: { temp: '39.5°C', heartRate: '88 bpm', respRate: '35/min' },
        duration: '6 hours',
        assignedVet: 'Dr. Smith'
      },
      {
        animalId: 'S101',
        name: 'Wooley',
        severity: 'warning',
        issue: 'Decreased Feeding',
        lastMeal: '12 hours ago',
        normalPattern: '4 times/day',
        currentPattern: '1 time/day'
      }
    ]
  },
  vetVisits: {
    total: 12,
    scheduled: 5,
    emergency: 2,
    completed: 5,
    byProcedure: {
      'Routine Checkup': 4,
      'Vaccination': 3,
      'Treatment': 3,
      'Surgery': 2
    },
    upcomingAppointments: [
      {
        date: '2025-05-11',
        time: '09:00',
        vet: 'Dr. Sarah Smith',
        animals: ['C124', 'S101'],
        type: 'Treatment',
        notes: 'Follow-up check for vital signs and feeding patterns'
      },
      {
        date: '2025-05-12',
        time: '14:00',
        vet: 'Dr. John Davis',
        animals: ['C123'],
        type: 'Routine Checkup',
        notes: 'Annual health assessment'
      }
    ]
  }
};

export function SystemOverview() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">System Overview</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Animals Monitored */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Animals Monitored</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">{mockData.animalMonitoring.total}</div>
              <span className="ml-2 flex items-center text-xs text-green-500">
                <ChevronUp className="h-3 w-3" /> {mockData.animalMonitoring.trend}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Cattle</span>
                <span className="font-medium">{mockData.animalMonitoring.bySpecies.cattle}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Sheep</span>
                <span className="font-medium">{mockData.animalMonitoring.bySpecies.sheep}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Other</span>
                <span className="font-medium">
                  {mockData.animalMonitoring.bySpecies.goats + 
                   mockData.animalMonitoring.bySpecies.pigs + 
                   mockData.animalMonitoring.bySpecies.horses}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animals Needing Attention */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Animals Needing Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">{mockData.attentionNeeded.total}</div>
              <div className="ml-4 flex flex-col">
                <span className="text-xs flex items-center text-red-500">
                  Critical: {mockData.attentionNeeded.critical}
                </span>
                <span className="text-xs flex items-center text-amber-500">
                  Warning: {mockData.attentionNeeded.warning}
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(mockData.attentionNeeded.byIssue).map(([issue, count]) => (
                <div key={issue} className="flex justify-between text-xs">
                  <span>{issue}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Vet Visits */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Vet Visits/Interventions</CardTitle>
            <Calendar className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{mockData.vetVisits.total}</div>
            <div className="mt-2 flex space-x-2">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Completed: {mockData.vetVisits.completed}
              </span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                Scheduled: {mockData.vetVisits.scheduled}
              </span>
              <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                Emergency: {mockData.vetVisits.emergency}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(mockData.vetVisits.byProcedure).map(([procedure, count]) => (
                <div key={procedure} className="flex justify-between text-xs">
                  <span>{procedure}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Overview Section */}
      <div className="mt-8 space-y-6">
        {/* Animals Under Close Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle>Animals Under Close Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Species</th>
                    <th className="text-left p-2">Age</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Last Check</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.animalMonitoring.detailedAnimals.map((animal) => (
                    <tr key={animal.id} className="border-b">
                      <td className="p-2">{animal.id}</td>
                      <td className="p-2 font-medium">{animal.name}</td>
                      <td className="p-2">{animal.species}</td>
                      <td className="p-2">{animal.age}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          animal.status === 'Healthy' ? 'bg-green-100 text-green-800' :
                          animal.status === 'Monitoring' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {animal.status}
                        </span>
                      </td>
                      <td className="p-2">{animal.lastCheck}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Critical Cases Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Cases Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.attentionNeeded.detailedCases.map((case_) => (
                <div key={case_.animalId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {case_.name} ({case_.animalId})
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          case_.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {case_.severity}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{case_.issue}</p>
                    </div>
                    {case_.assignedVet && (
                      <span className="text-sm text-gray-600">Assigned: {case_.assignedVet}</span>
                    )}
                  </div>
                  {case_.vitals && (
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Temperature:</span>
                        <br />
                        {case_.vitals.temp}
                      </div>
                      <div>
                        <span className="text-gray-600">Heart Rate:</span>
                        <br />
                        {case_.vitals.heartRate}
                      </div>
                      <div>
                        <span className="text-gray-600">Resp. Rate:</span>
                        <br />
                        {case_.vitals.respRate}
                      </div>
                    </div>
                  )}
                  {case_.lastMeal && (
                    <div className="mt-3 text-sm">
                      <p><span className="text-gray-600">Last Meal:</span> {case_.lastMeal}</p>
                      <p><span className="text-gray-600">Feeding Pattern:</span> {case_.currentPattern} (Normal: {case_.normalPattern})</p>
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-600">
                    Duration: {case_.duration}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Vet Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Vet Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.vetVisits.upcomingAppointments.map((appointment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{appointment.date} at {appointment.time}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                          {appointment.type}
                        </span>
                      </p>
                    </div>
                    <span className="text-sm font-medium">{appointment.vet}</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm">
                      <span className="text-gray-600">Animals:</span>{' '}
                      {appointment.animals.join(', ')}
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-600">Notes:</span>{' '}
                      {appointment.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}