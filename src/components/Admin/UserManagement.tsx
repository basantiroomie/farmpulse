import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, UserPlus, BatteryMedium, Signal } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

interface Device {
  id: string;
  animalId: string;
  batteryLevel: number;
  signalStrength: number;
  lastSync: string;
}

interface Cattle {
  id: string;
  name: string;
  breed: string;
  age: number;
  location: string;
  status: 'healthy' | 'warning' | 'critical';
}

interface UserManagementProps {
  users: User[];
  cattle: Cattle[];
  devices: Device[];
}

export function UserManagement({ users, cattle, devices }: UserManagementProps) {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="cattle">Cattle Profiles</TabsTrigger>
        <TabsTrigger value="devices">Device Status</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cattle">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cattle Profiles</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Cattle
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cattle.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell>{animal.id}</TableCell>
                    <TableCell>{animal.name}</TableCell>
                    <TableCell>{animal.breed}</TableCell>
                    <TableCell>{animal.age} years</TableCell>
                    <TableCell>{animal.location}</TableCell>
                    <TableCell>
                      <Badge variant={
                        animal.status === 'healthy' ? 'default' :
                        animal.status === 'warning' ? 'secondary' : 'destructive'
                      }>
                        {animal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="devices">
        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Animal ID</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Signal</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.id}</TableCell>
                    <TableCell>{device.animalId}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <BatteryMedium className="h-4 w-4" />
                      {device.batteryLevel}%
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Signal className="h-4 w-4" />
                      {device.signalStrength}%
                    </TableCell>
                    <TableCell>{device.lastSync}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Configure</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}