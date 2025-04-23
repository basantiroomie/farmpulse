
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SystemDiagram from "@/components/Product/SystemDiagram";

const Product = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-3">Animon Health Technology</h1>
        <p className="text-lg text-muted-foreground">
          Our comprehensive animal health monitoring system combines advanced wearable sensors, 
          secure data transmission, and AI-powered analytics to provide early disease detection 
          and improved herd management.
        </p>
      </div>

      <div className="mb-16">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sensors">Sensor Technology</TabsTrigger>
            <TabsTrigger value="software">Software Platform</TabsTrigger>
            <TabsTrigger value="ai">AI Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-4">System Overview</h2>
                <p className="text-muted-foreground mb-4">
                  The Animon Health monitoring system provides continuous health tracking for livestock, 
                  enabling early detection of diseases and health issues before they become critical.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-6 w-6 mt-1 text-primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Comprehensive Monitoring</p>
                      <p className="text-sm text-muted-foreground">
                        Tracks vital signs, activity levels, and behavioral patterns
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 mt-1 text-primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Real-time Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Instant notifications when health metrics deviate from normal ranges
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 mt-1 text-primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Predictive Analytics</p>
                      <p className="text-sm text-muted-foreground">
                        AI-powered disease prediction up to 3 days before visual symptoms
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 mt-1 text-primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Data-Driven Management</p>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive reporting and analytics for informed decision making
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1605237165959-12b272e526af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Animal with health monitoring sensor"
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sensors">
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Sensor Technology</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Wearable Sensor</CardTitle>
                    <CardDescription>Animal-friendly design</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Lightweight (45g) and waterproof design</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Long battery life (up to 3 months)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Comfortable ear tag or collar attachment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Durable construction for farm environments</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sensing Capabilities</CardTitle>
                    <CardDescription>Multi-parameter monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Body temperature (±0.1°C accuracy)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Heart rate and HRV analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>3-axis accelerometer for activity tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>GPS location tracking</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Data Transmission</CardTitle>
                    <CardDescription>Reliable connectivity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Low-power LoRaWAN technology</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Range up to 10km in rural areas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Local data storage when out of range</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>End-to-end encryption for data security</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="font-medium">Temperature Sensor</p>
                    <p className="text-sm text-muted-foreground">Range: 32°C - 45°C, Accuracy: ±0.1°C</p>
                  </div>
                  <div>
                    <p className="font-medium">Heart Rate Monitor</p>
                    <p className="text-sm text-muted-foreground">Range: 30-200 BPM, Accuracy: ±1 BPM</p>
                  </div>
                  <div>
                    <p className="font-medium">Activity Tracking</p>
                    <p className="text-sm text-muted-foreground">3-axis accelerometer, 16g range</p>
                  </div>
                  <div>
                    <p className="font-medium">Battery</p>
                    <p className="text-sm text-muted-foreground">3.7V Li-ion, 1200mAh, 3-month life</p>
                  </div>
                  <div>
                    <p className="font-medium">Connectivity</p>
                    <p className="text-sm text-muted-foreground">LoRaWAN, 868/915 MHz</p>
                  </div>
                  <div>
                    <p className="font-medium">Data Storage</p>
                    <p className="text-sm text-muted-foreground">32MB flash memory (30 days offline)</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="software">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="col-span-1 lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-semibold">Software Platform</h2>
                <p className="text-muted-foreground">
                  Our cloud-based software platform provides comprehensive tools for monitoring animal health, 
                  analyzing trends, and generating actionable insights.
                </p>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Web & Mobile Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Access your data from anywhere on any device with our responsive web interface 
                        and dedicated mobile apps for iOS and Android.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Real-time Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        View current health status and receive instant alerts when anomalies are detected.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Historical Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Track trends over time with comprehensive historical data and customizable reports.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Button asChild>
                  <Link to="/dashboard">View Sample Dashboard</Link>
                </Button>
              </div>
              
              <div className="col-span-1 lg:col-span-3">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="ml-2 text-sm font-mono">Animon Health Dashboard</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                      alt="Dashboard interface" 
                      className="w-full h-auto"
                    />
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Data Security</h4>
                    <p className="text-xs text-muted-foreground">
                      End-to-end encryption and GDPR-compliant data storage
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">API Integration</h4>
                    <p className="text-xs text-muted-foreground">
                      Connect with existing farm management software
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Regular Updates</h4>
                    <p className="text-xs text-muted-foreground">
                      Continuous improvement with new features
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai">
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">AI Analytics Engine</h2>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Our advanced AI system analyzes health data to detect patterns and anomalies, 
                enabling early disease detection and predictive health insights.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Machine Learning Models</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">Anomaly Detection</h4>
                      <p className="text-sm text-muted-foreground">
                        Identifies unusual patterns in vital signs that may indicate health issues.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Disease Prediction</h4>
                      <p className="text-sm text-muted-foreground">
                        Predicts specific diseases based on symptom patterns and historical data.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Behavioral Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Tracks changes in activity and behavior to detect early signs of distress.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Continuous Learning</h4>
                      <p className="text-sm text-muted-foreground">
                        Models improve over time as more data is collected and outcomes are recorded.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">Early Warning System</h4>
                      <p className="text-sm text-muted-foreground">
                        Alerts to potential health issues 2-3 days before visible symptoms appear.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Treatment Recommendations</h4>
                      <p className="text-sm text-muted-foreground">
                        Suggests appropriate interventions based on detected health issues.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Herd Health Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Identifies patterns across the entire herd to detect potential outbreaks.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Performance Optimization</h4>
                      <p className="text-sm text-muted-foreground">
                        Provides insights to improve animal welfare, productivity, and farm management.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted p-8 rounded-lg">
                <h3 className="text-xl font-medium mb-6">How Our AI Works</h3>
                <SystemDiagram />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-primary text-primary-foreground p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to see how our system can benefit your operation?</h2>
        <p className="mb-6 opacity-90">
          Contact our team for a personalized demonstration or calculate your potential ROI.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild variant="secondary">
            <Link to="/contact">Request a Demo</Link>
          </Button>
          <Button asChild variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/roi">Calculate ROI</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Product;
