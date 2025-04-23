
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { calculateROI, defaultROIParameters, ROIParameters, ROIResults } from "@/lib/roiCalculator";
import { useToast } from "@/hooks/use-toast";

const ROIForm = () => {
  const [parameters, setParameters] = useState<ROIParameters>(defaultROIParameters);
  const [results, setResults] = useState<ROIResults | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParameters((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSliderChange = (name: keyof ROIParameters, value: number[]) => {
    setParameters((prev) => ({
      ...prev,
      [name]: value[0],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const calculatedResults = calculateROI(parameters);
      setResults(calculatedResults);
      toast({
        title: "ROI Calculation Complete",
        description: "Your estimated savings have been calculated successfully.",
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "There was an error calculating ROI. Please check your inputs.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setParameters(defaultROIParameters);
    setResults(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>ROI Calculator</CardTitle>
          <CardDescription>
            Enter your operation details to estimate savings with our health monitoring system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="herdSize">Herd Size</Label>
                <Input
                  id="herdSize"
                  name="herdSize"
                  type="number"
                  value={parameters.herdSize}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
              
              <div>
                <Label htmlFor="averageAnimalValue">Average Animal Value ($)</Label>
                <Input
                  id="averageAnimalValue"
                  name="averageAnimalValue"
                  type="number"
                  value={parameters.averageAnimalValue}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="diseaseIncidenceRate">Disease Incidence Rate (%)</Label>
                  <span className="text-sm text-muted-foreground">{parameters.diseaseIncidenceRate}%</span>
                </div>
                <Slider
                  id="diseaseIncidenceRate"
                  min={0}
                  max={50}
                  step={1}
                  defaultValue={[parameters.diseaseIncidenceRate]}
                  onValueChange={(value) => handleSliderChange("diseaseIncidenceRate", value)}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="mortalityRate">Mortality Rate (%)</Label>
                  <span className="text-sm text-muted-foreground">{parameters.mortalityRate}%</span>
                </div>
                <Slider
                  id="mortalityRate"
                  min={0}
                  max={15}
                  step={0.1}
                  defaultValue={[parameters.mortalityRate]}
                  onValueChange={(value) => handleSliderChange("mortalityRate", value)}
                />
              </div>
              
              <div>
                <Label htmlFor="vetCostPerVisit">Veterinary Cost Per Visit ($)</Label>
                <Input
                  id="vetCostPerVisit"
                  name="vetCostPerVisit"
                  type="number"
                  value={parameters.vetCostPerVisit}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="annualVetVisits">Annual Veterinary Visits</Label>
                <Input
                  id="annualVetVisits"
                  name="annualVetVisits"
                  type="number"
                  value={parameters.annualVetVisits}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="laborCostPerHour">Labor Cost Per Hour ($)</Label>
                <Input
                  id="laborCostPerHour"
                  name="laborCostPerHour"
                  type="number"
                  value={parameters.laborCostPerHour}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="dailyMonitoringHours">Daily Monitoring Hours</Label>
                <Input
                  id="dailyMonitoringHours"
                  name="dailyMonitoringHours"
                  type="number"
                  value={parameters.dailyMonitoringHours}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>Reset</Button>
          <Button onClick={handleSubmit}>Calculate Savings</Button>
        </CardFooter>
      </Card>
      
      {results && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Your Estimated Savings</CardTitle>
            <CardDescription>
              Based on your farm's parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-card p-4 rounded-lg">
              <h3 className="text-xl font-bold text-primary mb-1">
                {formatCurrency(results.annualSavings)}
              </h3>
              <p className="text-muted-foreground text-sm">Annual Savings</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-1">
                  {formatCurrency(results.fiveYearSavings)}
                </h3>
                <p className="text-muted-foreground text-sm">5-Year Savings</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-1">
                  {results.paybackPeriodMonths.toFixed(1)} months
                </h3>
                <p className="text-muted-foreground text-sm">Payback Period</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Savings Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Disease Prevention</span>
                  <span className="font-medium">{formatCurrency(results.diseasePrevention)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mortality Reduction</span>
                  <span className="font-medium">{formatCurrency(results.mortalityReduction)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Veterinary Costs</span>
                  <span className="font-medium">{formatCurrency(results.vetSavings)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Labor Savings</span>
                  <span className="font-medium">{formatCurrency(results.laborSavings)}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">ROI</span>
                <span className="text-xl font-bold text-secondary">
                  {results.roi.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => window.print()}>
              Print Results
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ROIForm;
