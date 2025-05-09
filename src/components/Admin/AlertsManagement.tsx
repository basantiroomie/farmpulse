import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface Alert {
  id: string;
  animalId: string;
  severity: 'critical' | 'warning' | 'normal';
  issue: string;
  timestamp: string;
  assignedTo?: string;
}

interface AlertsManagementProps {
  alerts: Alert[];
  onAssignVet: (alertId: string, vetId: string) => void;
}

export function AlertsManagement({ alerts, onAssignVet }: AlertsManagementProps) {
  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'warning': return 'bg-yellow-500 text-yellow-50';
      case 'normal': return 'bg-green-500 text-green-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts & Case Management</CardTitle>
      </CardHeader>
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
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{alert.animalId}</TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </TableCell>
                <TableCell>{alert.issue}</TableCell>
                <TableCell>{alert.timestamp}</TableCell>
                <TableCell>
                  <Select
                    value={alert.assignedTo}
                    onValueChange={(vetId) => onAssignVet(alert.id, vetId)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Assign vet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vet1">Dr. Smith</SelectItem>
                      <SelectItem value="vet2">Dr. Johnson</SelectItem>
                      <SelectItem value="vet3">Dr. Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="secondary" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}