
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SystemDiagram = () => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  interface DiagramElement {
    id: string;
    title: string;
    description: string;
  }

  const elements: DiagramElement[] = [
    {
      id: "sensor",
      title: "On-Animal Sensors",
      description: "Wearable sensors measuring temperature, heart rate, activity, and location in real-time.",
    },
    {
      id: "gateway",
      title: "Data Gateway",
      description: "Collects sensor data and transmits it securely to the cloud platform.",
    },
    {
      id: "cloud",
      title: "Cloud Platform",
      description: "Securely stores and processes animal health data.",
    },
    {
      id: "ai",
      title: "AI Analysis Engine",
      description: "Machine learning algorithms that detect patterns and anomalies in animal health data.",
    },
    {
      id: "insights",
      title: "Health Insights",
      description: "Actionable recommendations for animal health management.",
    },
    {
      id: "alerts",
      title: "Alert System",
      description: "Sends timely notifications about potential health issues.",
    },
  ];

  return (
    <div className="w-full bg-muted/30 rounded-lg p-4 md:p-8">
      <h3 className="text-xl font-medium mb-6 text-center">System Architecture</h3>
      
      <div className="relative w-full h-[400px] md:h-[500px]">
        {/* SVG Diagram */}
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Connecting Lines */}
          <path
            d="M200 250 L350 150"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={hoveredElement ? "5,5" : "0"}
            className="opacity-60"
          />
          <path
            d="M450 150 L600 250"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={hoveredElement ? "5,5" : "0"}
            className="opacity-60"
          />
          <path
            d="M600 300 L450 400"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={hoveredElement ? "5,5" : "0"}
            className="opacity-60"
          />
          <path
            d="M350 400 L200 300"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={hoveredElement ? "5,5" : "0"}
            className="opacity-60"
          />
          <path
            d="M200 250 L200 300"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={hoveredElement ? "5,5" : "0"}
            className="opacity-60"
          />
          <path
            d="M350 150 L450 150"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={hoveredElement ? "5,5" : "0"}
            className="opacity-60"
          />
          <path
            d="M600 250 L600 300"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={hoveredElement ? "5,5" : "0"}
            className="opacity-60"
          />
          <path
            d="M450 400 L350 400"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={hoveredElement ? "5,5" : "0"}
            className="opacity-60"
          />
          
          {/* Nodes */}
          <DiagramNode
            id="sensor"
            x={200}
            y={250}
            hoveredElement={hoveredElement}
            setHoveredElement={setHoveredElement}
          />
          <DiagramNode
            id="gateway"
            x={350}
            y={150}
            hoveredElement={hoveredElement}
            setHoveredElement={setHoveredElement}
          />
          <DiagramNode
            id="cloud"
            x={450}
            y={150}
            hoveredElement={hoveredElement}
            setHoveredElement={setHoveredElement}
          />
          <DiagramNode
            id="ai"
            x={600}
            y={250}
            hoveredElement={hoveredElement}
            setHoveredElement={setHoveredElement}
          />
          <DiagramNode
            id="insights"
            x={600}
            y={300}
            hoveredElement={hoveredElement}
            setHoveredElement={setHoveredElement}
          />
          <DiagramNode
            id="alerts"
            x={450}
            y={400}
            hoveredElement={hoveredElement}
            setHoveredElement={setHoveredElement}
          />
        </svg>
        
        {/* Node Labels with Tooltips */}
        <div className="absolute inset-0">
          {elements.map((element) => (
            <DiagramTooltip
              key={element.id}
              element={element}
              hoveredElement={hoveredElement}
              setHoveredElement={setHoveredElement}
            />
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {elements.map((element) => (
          <div 
            key={element.id}
            className={`p-4 rounded-md border transition-all ${
              hoveredElement === element.id ? "bg-primary/10 border-primary/30" : "bg-card border-border"
            }`}
            onMouseEnter={() => setHoveredElement(element.id)}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <h4 className="font-medium">{element.title}</h4>
            <p className="text-sm text-muted-foreground">{element.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DiagramNodeProps {
  id: string;
  x: number;
  y: number;
  hoveredElement: string | null;
  setHoveredElement: (id: string | null) => void;
}

const DiagramNode: React.FC<DiagramNodeProps> = ({ id, x, y, hoveredElement, setHoveredElement }) => {
  const isActive = hoveredElement === id;
  const radius = isActive ? 25 : 20;
  
  const getNodeColor = () => {
    switch (id) {
      case 'sensor': return '#60a5fa'; // blue
      case 'gateway': return '#10b981'; // green
      case 'cloud': return '#a78bfa'; // purple
      case 'ai': return '#f97316'; // orange
      case 'insights': return '#ec4899'; // pink
      case 'alerts': return '#f43f5e'; // red
      default: return '#9ca3af'; // gray
    }
  };
  
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={isActive ? getNodeColor() : 'currentColor'}
        fillOpacity={isActive ? 0.9 : 0.2}
        stroke={getNodeColor()}
        strokeWidth="2"
        className="transition-all cursor-pointer"
        onMouseEnter={() => setHoveredElement(id)}
        onMouseLeave={() => setHoveredElement(null)}
      />
    </g>
  );
};

interface DiagramTooltipProps {
  element: {
    id: string;
    title: string;
    description: string;
  };
  hoveredElement: string | null;
  setHoveredElement: (id: string | null) => void;
}

const DiagramTooltip: React.FC<DiagramTooltipProps> = ({ element, hoveredElement, setHoveredElement }) => {
  const { id, title, description } = element;
  
  // Position tooltip based on node id
  const getPosition = () => {
    switch (id) {
      case 'sensor': return 'left-[15%] top-[50%]';
      case 'gateway': return 'left-[35%] top-[30%]';
      case 'cloud': return 'left-[50%] top-[30%]';
      case 'ai': return 'left-[65%] top-[50%]';
      case 'insights': return 'left-[65%] top-[60%]';
      case 'alerts': return 'left-[50%] top-[80%]';
      default: return '';
    }
  };
  
  return (
    <div className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getPosition()}`}>
      <TooltipProvider>
        <Tooltip open={hoveredElement === id}>
          <TooltipTrigger asChild>
            <div 
              className="w-8 h-8 rounded-full cursor-pointer"
              onMouseEnter={() => setHoveredElement(id)}
              onMouseLeave={() => setHoveredElement(null)}
            />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            <p className="font-medium">{title}</p>
            <p className="text-xs">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span className={`absolute top-10 left-1/2 transform -translate-x-1/2 text-sm font-medium whitespace-nowrap ${
        hoveredElement === id ? 'opacity-100' : 'opacity-0'
      } transition-opacity`}>
        {title}
      </span>
    </div>
  );
};

export default SystemDiagram;
