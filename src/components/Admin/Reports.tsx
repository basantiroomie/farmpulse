import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

interface ReportMetric {
  name: string;
  value: string;
  change: number;
}

interface ReportsProps {
  healthMetrics: ReportMetric[];
  productivityMetrics: ReportMetric[];
  complianceMetrics: ReportMetric[];
}

export function Reports({ healthMetrics, productivityMetrics, complianceMetrics }: ReportsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <Select defaultValue="health">
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

          <DatePickerWithRange className="w-[280px]" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="health" className="w-full">
        <TabsList>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {healthMetrics.map((metric) => (
                  <Card key={metric.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p className={`text-xs ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productivity">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {productivityMetrics.map((metric) => (
                  <Card key={metric.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p className={`text-xs ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {complianceMetrics.map((metric) => (
                  <Card key={metric.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p className={`text-xs ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}