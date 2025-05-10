import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { StatsGridBorder } from "@/components/ui/stats-grid-border";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Advanced Animal Health Monitoring System
              </h1>
              <p className="text-lg opacity-90">
                Early disease detection, improved herd management, and enhanced animal welfare through continuous health monitoring.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" variant="outline" className="bg-transparent">
                  <Link to="/contact">Explore Technology</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent">
                  <Link to="/roi-calculator">Calculate ROI</Link>
                </Button>
              </div>
            </div>            
            <StatsGridBorder
              stats={[
                { value: "40%", label: "Reduction in disease incidence" },
                { value: "50%", label: "Decrease in mortality rates" },
                { value: "30%", label: "Fewer vet visits required" },
                { value: "60%", label: "Labor time saved on monitoring" }
              ]}
            />
          </div>
        </div>
      </section>
      
      <div className="flex flex-col overflow-hidden pb-[100px] pt-[100px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        <img
          src="/mock/dashboard.png"
          alt="hero"
          className="mx-auto rounded-2xl object-cover object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Health Monitoring</h2>
            <p className="text-lg text-muted-foreground">
              Our system continuously monitors key health indicators to detect potential issues before they become serious problems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Activity Monitoring</h3>
              <p className="text-muted-foreground">
                Track movement patterns and detect changes in behavior that may indicate health issues.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Heart Rate Analysis</h3>
              <p className="text-muted-foreground">
                Continuous heart rate monitoring to identify stress, infection, or cardiovascular issues.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path d="M14 14.76v-2.52l1.25-1.28a2 2 0 0 0 .02-2.93L12 5l-3.27 3.03a2 2 0 0 0 .02 2.93l1.25 1.28v2.52l-4.75 1.82A2 2 0 0 0 4 19.46V20h16v-.54a2 2 0 0 0-1.25-1.88Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Temperature Monitoring</h3>
              <p className="text-muted-foreground">
                Early fever detection allows for rapid intervention before symptoms progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/lovable-uploads/b8d8f866-bd7f-4198-af40-b2d36a972f4f.png" 
                alt="Cattle resting in field" 
                className="rounded-lg shadow-lg object-cover w-full aspect-[4/3]" 
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-4">Why Choose FarmPulse AI?</h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 mt-1 text-secondary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Early Disease Detection</h3>
                    <p className="text-muted-foreground">Identify health issues up to 3 days before visual symptoms appear.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-6 w-6 mt-1 text-secondary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Reduced Treatment Costs</h3>
                    <p className="text-muted-foreground">Lower medication usage and veterinary expenses through preventative care.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-6 w-6 mt-1 text-secondary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Improved Animal Welfare</h3>
                    <p className="text-muted-foreground">Enhance quality of life through faster intervention and individualized care.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-6 w-6 mt-1 text-secondary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Data-Driven Management</h3>
                    <p className="text-muted-foreground">Make informed decisions based on comprehensive health analytics.</p>
                  </div>
                </div>
              </div>
              
              <Button asChild size="lg" className="mt-4">
                <Link to="/dashboard">View Sample Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;