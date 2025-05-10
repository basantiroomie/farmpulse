
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ThermometerSun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHealthStatus } from "@/lib/sampleData";

interface DashboardCardProps {
  title: string;
  value: number;
  unit: string;
  description: string;
  metricType: "heartRate" | "temperature" | "activity";
  onClick: () => void;
}

const DashboardCard = ({
  title,
  value,
  unit,
  description,
  metricType,
  onClick,
}: DashboardCardProps) => {
  const status = getHealthStatus(value, metricType);

  const statusColors = {
    normal: "bg-success/20 text-success border-success/30",
    warning: "bg-warning/20 text-warning border-warning/30",
    critical: "bg-danger/20 text-danger border-danger/30",
  };

  const statusText = {
    normal: "Normal",
    warning: "Warning",
    critical: "Critical",
  };

  const getIcon = () => {
    switch (metricType) {
      case "heartRate":
        return <Heart className={`h-5 w-5 ${status === "critical" ? "animate-pulse" : ""}`} />;
      case "temperature":
        return <ThermometerSun className="h-5 w-5" />;
      case "activity":
        return (
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        );
    }
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className={`px-2 py-1 rounded-md ${statusColors[status]} text-xs font-medium flex items-center gap-1 border`}>
          {getIcon()}
          {statusText[status]}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="text-3xl font-bold">
            {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
          </div>
          <CardDescription>{description}</CardDescription>
          <Button variant="outline" size="sm" onClick={onClick}>
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
