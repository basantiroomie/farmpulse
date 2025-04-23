
import ROIForm from "@/components/ROI/ROIForm";

const ROI = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-3">ROI Calculator</h1>
        <p className="text-lg text-muted-foreground">
          Estimate the return on investment for implementing our animal health monitoring system 
          on your farm or ranch.
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <ROIForm />
        
        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How We Calculate Your ROI</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Our ROI calculator takes into account several key factors that contribute to 
              the economic benefits of implementing our health monitoring system:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Disease Prevention Savings</h3>
                <p className="text-sm text-muted-foreground">
                  Early detection leads to a 40% reduction in disease incidence, reducing 
                  treatment costs and production losses.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Mortality Reduction</h3>
                <p className="text-sm text-muted-foreground">
                  Improved health monitoring results in a 50% reduction in mortality rates, 
                  preserving valuable livestock.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Veterinary Cost Reduction</h3>
                <p className="text-sm text-muted-foreground">
                  Fewer emergency visits and more targeted treatments lead to approximately 
                  30% savings on veterinary expenses.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Labor Savings</h3>
                <p className="text-sm text-muted-foreground">
                  Automated health monitoring reduces daily inspection and monitoring time 
                  by up to 60%.
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground pt-2">
              Note: Results are estimates based on industry averages and the information you provide. 
              Actual results may vary based on your specific operation and management practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROI;
