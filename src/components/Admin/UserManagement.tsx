import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Mock data - in a real app, this would come from an API
const mockData = {
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
  ]
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockData.users);
  const [cattle, setCattle] = useState<Cattle[]>(mockData.cattle);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddCattleDialogOpen, setIsAddCattleDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isEditCattleDialogOpen, setIsEditCattleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null);
  
  // New user form state
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'Farmer',
    status: 'active'
  });

  // New cattle form state
  const [newCattle, setNewCattle] = useState<Partial<Cattle>>({
    id: '',
    name: '',
    breed: '',
    age: 0,
    location: '',
    status: 'healthy'
  });

  // Handle adding a new user
  const handleAddUser = () => {
    // Generate a random ID
    const userId = `U${Math.floor(Math.random() * 10000)}`;
    
    // Create new user object
    const userToAdd: User = {
      id: userId,
      name: newUser.name || '',
      email: newUser.email || '',
      role: newUser.role || 'Farmer',
      status: newUser.status || 'active'
    };
    
    // Update users state
    setUsers([...users, userToAdd]);
    
    // Reset form and close dialog
    setNewUser({
      name: '',
      email: '',
      role: 'Farmer',
      status: 'active'
    });
    setIsAddUserDialogOpen(false);
  };
  // Handle adding new cattle
  const handleAddCattle = () => {
    // Generate a random ID if not provided
    const cattleId = newCattle.id || `A${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Create new cattle object
    const cattleToAdd: Cattle = {
      id: cattleId,
      name: newCattle.name || '',
      breed: newCattle.breed || '',
      age: newCattle.age || 0,
      location: newCattle.location || '',
      status: newCattle.status || 'healthy'
    };
    
    // Update cattle state
    setCattle([...cattle, cattleToAdd]);
    
    // Reset form and close dialog
    setNewCattle({
      id: '',
      name: '',
      breed: '',
      age: 0,
      location: '',
      status: 'healthy'
    });
    setIsAddCattleDialogOpen(false);
  };
  
  // Handle editing a user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsEditUserDialogOpen(true);
  };
  
  // Save edited user
  const saveEditedUser = () => {
    if (!selectedUser) return;
    
    const updatedUser = {
      ...selectedUser,
      name: newUser.name || selectedUser.name,
      email: newUser.email || selectedUser.email,
      role: newUser.role || selectedUser.role,
      status: newUser.status || selectedUser.status
    };
    
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? updatedUser : user
    );
    
    setUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      role: 'Farmer',
      status: 'active'
    });
    setSelectedUser(null);
  };
  
  // Handle editing cattle
  const handleEditCattle = (animal: Cattle) => {
    setSelectedCattle(animal);
    setNewCattle({
      id: animal.id,
      name: animal.name,
      breed: animal.breed,
      age: animal.age,
      location: animal.location,
      status: animal.status
    });
    setIsEditCattleDialogOpen(true);
  };
  
  // Save edited cattle
  const saveEditedCattle = () => {
    if (!selectedCattle) return;
    
    const updatedCattle = {
      ...selectedCattle,
      name: newCattle.name || selectedCattle.name,
      breed: newCattle.breed || selectedCattle.breed,
      age: newCattle.age !== undefined ? newCattle.age : selectedCattle.age,
      location: newCattle.location || selectedCattle.location,
      status: newCattle.status || selectedCattle.status
    };
    
    const updatedCattleList = cattle.map(animal => 
      animal.id === selectedCattle.id ? updatedCattle : animal
    );
    
    setCattle(updatedCattleList);
    setIsEditCattleDialogOpen(false);
    
    // Reset form
    setNewCattle({
      id: '',
      name: '',
      breed: '',
      age: 0,
      location: '',
      status: 'healthy'
    });
    setSelectedCattle(null);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="cattle">Cattle Profiles</TabsTrigger>
          <TabsTrigger value="devices">Device Status</TabsTrigger>
        </TabsList>        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Button size="sm" onClick={() => setIsAddUserDialogOpen(true)}>
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
                      </TableCell>                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Add User Dialog */}
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new user to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    className="col-span-3"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    type="email"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select 
                    onValueChange={(value) => setNewUser({...newUser, role: value})}
                    defaultValue={newUser.role}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Farmer">Farmer</SelectItem>
                      <SelectItem value="Vet">Veterinarian</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) => setNewUser({...newUser, status: value as 'active' | 'inactive'})}
                    defaultValue={newUser.status}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>        <TabsContent value="cattle">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cattle Profiles</CardTitle>
              <Button size="sm" onClick={() => setIsAddCattleDialogOpen(true)}>
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
                      </TableCell>                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEditCattle(animal)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Add Cattle Dialog */}
          <Dialog open={isAddCattleDialogOpen} onOpenChange={setIsAddCattleDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Cattle</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new animal to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cattle-id" className="text-right">
                    ID
                  </Label>
                  <Input
                    id="cattle-id"
                    className="col-span-3"
                    value={newCattle.id}
                    onChange={(e) => setNewCattle({...newCattle, id: e.target.value})}
                    placeholder="Leave blank for auto-generated ID"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cattle-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="cattle-name"
                    className="col-span-3"
                    value={newCattle.name}
                    onChange={(e) => setNewCattle({...newCattle, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cattle-breed" className="text-right">
                    Breed
                  </Label>
                  <Input
                    id="cattle-breed"
                    className="col-span-3"
                    value={newCattle.breed}
                    onChange={(e) => setNewCattle({...newCattle, breed: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cattle-age" className="text-right">
                    Age (years)
                  </Label>
                  <Input
                    id="cattle-age"
                    type="number"
                    className="col-span-3"
                    value={newCattle.age}
                    onChange={(e) => setNewCattle({...newCattle, age: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cattle-location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="cattle-location"
                    className="col-span-3"
                    value={newCattle.location}
                    onChange={(e) => setNewCattle({...newCattle, location: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cattle-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) => setNewCattle({...newCattle, status: value as 'healthy' | 'warning' | 'critical'})}
                    defaultValue={newCattle.status}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthy">Healthy</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddCattle}>Add Cattle</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Edit Cattle Dialog */}
          <Dialog open={isEditCattleDialogOpen} onOpenChange={setIsEditCattleDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Cattle</DialogTitle>
                <DialogDescription>
                  Update the animal's information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-cattle-id" className="text-right">
                    ID
                  </Label>
                  <Input
                    id="edit-cattle-id"
                    className="col-span-3"
                    value={newCattle.id}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-cattle-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-cattle-name"
                    className="col-span-3"
                    value={newCattle.name}
                    onChange={(e) => setNewCattle({...newCattle, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-cattle-breed" className="text-right">
                    Breed
                  </Label>
                  <Input
                    id="edit-cattle-breed"
                    className="col-span-3"
                    value={newCattle.breed}
                    onChange={(e) => setNewCattle({...newCattle, breed: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-cattle-age" className="text-right">
                    Age (years)
                  </Label>
                  <Input
                    id="edit-cattle-age"
                    type="number"
                    className="col-span-3"
                    value={newCattle.age}
                    onChange={(e) => setNewCattle({...newCattle, age: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-cattle-location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="edit-cattle-location"
                    className="col-span-3"
                    value={newCattle.location}
                    onChange={(e) => setNewCattle({...newCattle, location: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-cattle-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) => setNewCattle({...newCattle, status: value as 'healthy' | 'warning' | 'critical'})}
                    value={newCattle.status}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthy">Healthy</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={saveEditedCattle}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  {mockData.devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>{device.id}</TableCell>
                      <TableCell>{device.animalId}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <BatteryMedium className={`h-4 w-4 ${
                          device.batteryLevel > 80 ? 'text-green-500' :
                          device.batteryLevel > 20 ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                        {device.batteryLevel}%
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Signal className={`h-4 w-4 ${
                          device.signalStrength > 80 ? 'text-green-500' :
                          device.signalStrength > 20 ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                        {device.signalStrength}%
                      </TableCell>
                      <TableCell>{new Date(device.lastSync).toLocaleString()}</TableCell>
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
    </div>
  );
}