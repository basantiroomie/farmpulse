import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Thermometer, Activity, Clock, User, Edit, Trash2 } from "lucide-react";

interface Alert {
  id: string;
  animalId: string;
  animalName?: string;
  severity: 'critical' | 'warning' | 'normal';
  issue: string;
  timestamp: string;
  assignedTo?: string;
  details?: {
    temperature?: number;
    activity?: number;
    heartRate?: number;
    respiration?: number;
    location?: string;
    notes?: string;
    history?: Array<{
      date: string;
      value: number;
      type: string;
    }>;
  };
}

// Mock data - in a real app, this would come from an API
const mockAlerts: Alert[] = [
  {
    id: '1',
    animalId: 'A12345',
    animalName: 'Bella',
    severity: 'critical',
    issue: 'High Temperature',
    timestamp: '2025-05-09T10:30:00',
    details: {
      temperature: 40.2, // Normal bovine temp is around 38.5°C
      activity: 65,
      heartRate: 92,
      respiration: 32,
      location: 'Pen A',
      notes: 'Animal showing signs of fever and reduced appetite. Recommend immediate veterinary attention.',
      history: [
        { date: '2025-05-08', value: 38.7, type: 'temperature' },
        { date: '2025-05-08T12:00:00', value: 39.2, type: 'temperature' },
        { date: '2025-05-09', value: 39.8, type: 'temperature' },
        { date: '2025-05-09T06:00:00', value: 40.2, type: 'temperature' },
      ]
    }
  },
  {
    id: '2',
    animalId: 'A12346',
    animalName: 'Daisy',
    severity: 'warning',
    issue: 'Low Activity',
    timestamp: '2025-05-09T09:15:00',
    details: {
      temperature: 38.3,
      activity: 32, // Activity significantly reduced
      heartRate: 68,
      respiration: 24,
      location: 'Pen B',
      notes: 'Animal showing decreased movement over the past 24 hours. Monitor for additional symptoms.',
      history: [
        { date: '2025-05-08', value: 75, type: 'activity' },
        { date: '2025-05-08T12:00:00', value: 68, type: 'activity' },
        { date: '2025-05-09', value: 45, type: 'activity' },
        { date: '2025-05-09T06:00:00', value: 32, type: 'activity' },
      ]
    }
  }
];

export function AlertsManagement() {
  const { toast } = useToast();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);
  const [editedAlert, setEditedAlert] = useState<Alert | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const handleAssignVet = (alertId: string, vetId: string) => {
    // In a real app, this would make an API call to update the backend
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, assignedTo: vetId } : alert
    );
    
    setAlerts(updatedAlerts);
    
    toast({
      title: "Vet Assigned",
      description: `Alert ${alertId} has been assigned to vet ${vetId}`,
    });
  };
    const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDetailsOpen(true);
  };
  
  const handleEditAlert = (alert: Alert) => {
    setEditedAlert({...alert});
    setIsEditAlertOpen(true);
  };
  
  const saveEditedAlert = () => {
    if (!editedAlert) return;
    
    // Update the alerts array with the edited alert
    const updatedAlerts = alerts.map(alert => 
      alert.id === editedAlert.id ? editedAlert : alert
    );
    
    setAlerts(updatedAlerts);
    setIsEditAlertOpen(false);
    
    toast({
      title: "Alert Updated",
      description: `Alert ${editedAlert.id} has been updated.`,
    });
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'warning': return 'bg-yellow-500 text-yellow-50';
      case 'normal': return 'bg-green-500 text-green-50';
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Alerts Management</h1>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal ID</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Assign To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{alert.animalId}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{alert.issue}</TableCell>
                  <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Select 
                      onValueChange={(value) => handleAssignVet(alert.id, value)}
                      value={alert.assignedTo}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Vet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vet1">Dr. Smith</SelectItem>
                        <SelectItem value="vet2">Dr. Johnson</SelectItem>
                        <SelectItem value="vet3">Dr. Williams</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(alert)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditAlert(alert)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>      </Card>

      {/* Alert Details Dialog */}      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedAlert && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedAlert.issue}
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.severity}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Animal: {selectedAlert.animalName} ({selectedAlert.animalId})
                </DialogDescription>
              </DialogHeader>              <Tabs defaultValue="vitals" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="vitals">Vitals</TabsTrigger>
                  <TabsTrigger value="notes">Notes & Location</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="vitals" className="space-y-4 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedAlert.details?.temperature && (
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Thermometer className="h-4 w-4" />
                            Temperature
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold">{selectedAlert.details.temperature}°C</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedAlert.details.temperature > 39.5 
                              ? "Above normal range" 
                              : selectedAlert.details.temperature < 37.5 
                                ? "Below normal range" 
                                : "Normal range"}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {selectedAlert.details?.activity !== undefined && (
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold">{selectedAlert.details.activity}%</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedAlert.details.activity < 40 
                              ? "Below normal activity level"
                              : selectedAlert.details.activity > 90
                                ? "Above normal activity level"
                                : "Normal activity level"}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {selectedAlert.details?.heartRate && (
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Heart Rate
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold">{selectedAlert.details.heartRate} BPM</p>
                        </CardContent>
                      </Card>
                    )}

                    {selectedAlert.details?.respiration && (
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Respiration
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-bold">{selectedAlert.details.respiration} breaths/min</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4 mt-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Notes & Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedAlert.details?.location && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-1">Location</h4>
                          <p>{selectedAlert.details.location}</p>
                        </div>
                      )}

                      {selectedAlert.details?.notes && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Notes</h4>
                          <p className="text-sm">{selectedAlert.details.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4 mt-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Historical Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedAlert.details?.history && selectedAlert.details.history.length > 0 ? (
                        <div className="border rounded-md overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Measurement</TableHead>
                                <TableHead>Value</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedAlert.details.history.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
                                  <TableCell className="capitalize">{item.type}</TableCell>
                                  <TableCell>
                                    {item.value}
                                    {item.type === 'temperature' ? '°C' : 
                                      item.type === 'activity' ? '%' : ''}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No historical data available.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    Reported: {new Date(selectedAlert.timestamp).toLocaleString()}
                  </p>
                  {selectedAlert.assignedTo && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <User className="inline-block h-4 w-4 mr-1" />
                      Assigned to: {
                        selectedAlert.assignedTo === 'vet1' ? 'Dr. Smith' :
                        selectedAlert.assignedTo === 'vet2' ? 'Dr. Johnson' :
                        selectedAlert.assignedTo === 'vet3' ? 'Dr. Williams' :
                        selectedAlert.assignedTo
                      }
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditAlert(selectedAlert)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="default" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Alert Dialog */}
      <Dialog open={isEditAlertOpen} onOpenChange={setIsEditAlertOpen}>
        <DialogContent>
          {editedAlert && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Alert</DialogTitle>
                <DialogDescription>
                  Update the alert information for {editedAlert.animalName} ({editedAlert.animalId}).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-issue" className="text-right">
                    Issue
                  </Label>
                  <Input
                    id="edit-issue"
                    className="col-span-3"
                    value={editedAlert.issue}
                    onChange={(e) => setEditedAlert({...editedAlert, issue: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-severity" className="text-right">
                    Severity
                  </Label>
                  <Select 
                    value={editedAlert.severity}
                    onValueChange={(value) => setEditedAlert({...editedAlert, severity: value as 'critical' | 'warning' | 'normal'})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editedAlert.details?.notes !== undefined && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="edit-notes" className="text-right pt-2">
                      Notes
                    </Label>
                    <Textarea
                      id="edit-notes"
                      className="col-span-3"
                      value={editedAlert.details?.notes}
                      onChange={(e) => setEditedAlert({
                        ...editedAlert, 
                        details: {
                          ...editedAlert.details!,
                          notes: e.target.value
                        }
                      })}
                      rows={4}
                    />
                  </div>
                )}
                {editedAlert.details?.location !== undefined && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="edit-location"
                      className="col-span-3"
                      value={editedAlert.details?.location}
                      onChange={(e) => setEditedAlert({
                        ...editedAlert, 
                        details: {
                          ...editedAlert.details!,
                          location: e.target.value
                        }
                      })}
                    />
                  </div>
                )}
                {editedAlert.details?.temperature !== undefined && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-temperature" className="text-right">
                      Temperature (°C)
                    </Label>
                    <Input
                      id="edit-temperature"
                      className="col-span-3"
                      type="number"
                      step="0.1"
                      value={editedAlert.details?.temperature}
                      onChange={(e) => setEditedAlert({
                        ...editedAlert, 
                        details: {
                          ...editedAlert.details!,
                          temperature: Number(e.target.value)
                        }
                      })}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={saveEditedAlert}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}