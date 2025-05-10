import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jsPDF from 'jspdf';
import { FileSpreadsheet, FileText } from "lucide-react";
import React from 'react';

interface ReportMetric {
  name: string;
  value: string;
  change: number;
}

// Mock data - in a real app, this would come from an API
const mockData = {
  health: [
    { name: 'Average Temperature', value: '38.5°C', change: -0.2 },
    { name: 'Activity Level',     value: '87%',    change: 5    },
    { name: 'Health Score',       value: '92/100', change: 3    },
  ],
  productivity: [
    { name: 'Milk Production', value: '28L/day', change: 4 },
    { name: 'Feed Consumption', value: '22kg/day', change: -1 },
    { name: 'Rest Time',        value: '12hrs/day', change: 2 },
  ],
  mortality: [
    { name: 'Overall Rate',     value: '1.2%', change: -0.3 },
    { name: 'Disease Related',  value: '0.5%', change: -0.2 },
    { name: 'Age Related',      value: '0.7%', change: -0.1 },
  ],
  compliance: [
    { name: 'Health Checks',    value: '100%', change: 0 },
    { name: 'Vaccination Status', value: '98%', change: 2 },
    { name: 'Documentation',     value: '95%', change: 5 },
  ],
};

export function Reports() {
  const [selectedReport, setSelectedReport] = React.useState<'health'|'productivity'|'mortality'|'compliance'>('health');

  // Today's date is May 10, 2025
  const currentDate = new Date(2025, 4, 10);
  const [dateRange, setDateRange] = React.useState<{ from: Date; to?: Date }>({
    from: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()),
    to: undefined,
  });

  // Allowed bounds
  const fromDate = new Date(2024, 0, 1);
  const toDate   = currentDate;

  const getReportTitle = (type: string) => {
    switch (type) {
      case 'health':       return 'Health Report';
      case 'productivity': return 'Productivity Report';
      case 'mortality':    return 'Mortality Rates';
      case 'compliance':   return 'Compliance Report';
      default:             return 'Report';
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const title     = getReportTitle(selectedReport);
    const from      = dateRange.from.toLocaleDateString();
    const to        = dateRange.to?.toLocaleDateString() || from;
    const metrics   = mockData[selectedReport];

    if (format === 'csv') {
      // Build CSV
      let csv = `Report Type,${title}\nDate Range,${from} – ${to}\n\n`;
      csv += 'Metric,Value,Change (%)\n';
      metrics.forEach(m => {
        csv += `${m.name},${m.value},${m.change}\n`;
      });

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${selectedReport}_report_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      // Build PDF
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(title, 10, 20);
      doc.setFontSize(12);
      doc.text(`Date Range: ${from} – ${to}`, 10, 30);

      let y = 40;
      metrics.forEach(m => {
        doc.text(`${m.name}: ${m.value} (${m.change > 0 ? '+' : ''}${m.change}%)`, 10, y);
        y += 10;
      });

      doc.save(`${selectedReport}_report_${Date.now()}.pdf`);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Reports</h1>
      <div className="space-y-6">

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <Select value={selectedReport} onValueChange={(value: 'health' | 'productivity' | 'mortality' | 'compliance') => setSelectedReport(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="health">Health Report</SelectItem>
                  <SelectItem value="productivity">Productivity Report</SelectItem>
                  <SelectItem value="mortality">Mortality Rates</SelectItem>
                  <SelectItem value="compliance">Compliance Report</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <DatePickerWithRange
              className="w-[280px]"
              date={dateRange}
              onChange={setDateRange}
              fromDate={fromDate}
              toDate={toDate}
              currentDate={currentDate}
            />
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileText className="h-4 w-4 mr-2" />Generate Report
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <Card>
          <CardHeader>
            <CardTitle>{getReportTitle(selectedReport)}</CardTitle>
            {dateRange.to && (
              <p className="text-sm text-muted-foreground">
                {dateRange.from.toLocaleDateString()} – {dateRange.to.toLocaleDateString()}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {mockData[selectedReport].map(m => (
                <Card key={m.name} className="bg-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{m.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{m.value}</div>
                    <p className={`text-xs ${
                      m.change > 0 ? 'text-green-500'
                        : m.change < 0 ? 'text-red-500'
                        : 'text-gray-500'
                    }`}>
                      {m.change > 0 ? '+' : ''}{m.change}% from last period
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
