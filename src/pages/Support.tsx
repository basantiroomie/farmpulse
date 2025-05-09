
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Support = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-3">Implementation & Support</h1>
        <p className="text-lg text-muted-foreground">
          We provide comprehensive support throughout your journey with Animon Health, 
          from initial setup to ongoing maintenance and training.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto mb-16">
        <Tabs defaultValue="implementation" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="implementation">
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Implementation Process</h2>
              <p className="text-muted-foreground">
                Our team works with you to ensure a smooth and efficient implementation of the 
                Animon Health monitoring system.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Initial Consultation & Assessment</h3>
                    <p className="text-muted-foreground mb-4">
                      Our team conducts a thorough assessment of your operation's needs and 
                      existing infrastructure to create a customized implementation plan.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Facility assessment and network coverage survey</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Identification of key monitoring requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Integration needs with existing systems</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Hardware Installation</h3>
                    <p className="text-muted-foreground mb-4">
                      Our certified technicians install and configure all necessary hardware components 
                      to ensure optimal system performance.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Gateway installation and network configuration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Sensor fitting and animal-friendly attachment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Signal testing and coverage optimization</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Software Setup & Calibration</h3>
                    <p className="text-muted-foreground mb-4">
                      We set up and customize your dashboard and alert system based on your operation's 
                      specific requirements.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>User account creation and permission setting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Alert threshold configuration for your specific breed/species</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Custom report setup and dashboard configuration</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Testing & Validation</h3>
                    <p className="text-muted-foreground mb-4">
                      Comprehensive testing ensures all systems are functioning correctly and 
                      data flow is reliable.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>End-to-end system validation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Alert trigger testing and verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Data accuracy confirmation</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Launch & Ongoing Support</h3>
                    <p className="text-muted-foreground mb-4">
                      We remain with you through system launch and provide ongoing technical support 
                      and maintenance.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>24/7 technical support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Regular system health checks and updates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Quarterly performance reviews and optimization</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Typical Implementation Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="font-medium">Small Operations</h4>
                    <p className="text-sm text-muted-foreground mt-1">(Up to 100 animals)</p>
                    <p className="font-bold mt-2">1-2 Weeks</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="font-medium">Medium Operations</h4>
                    <p className="text-sm text-muted-foreground mt-1">(100-500 animals)</p>
                    <p className="font-bold mt-2">2-3 Weeks</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="font-medium">Large Operations</h4>
                    <p className="text-sm text-muted-foreground mt-1">(500+ animals)</p>
                    <p className="font-bold mt-2">3-5 Weeks</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="training">
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Training Programs</h2>
              <p className="text-muted-foreground">
                We provide comprehensive training to ensure your team can effectively use and 
                maintain the Animon Health system.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic User Training</CardTitle>
                    <CardDescription>For all system users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">Duration</h4>
                      <p className="text-sm text-muted-foreground">2-4 hours</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Topics Covered</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground mt-1">
                        <li>• Dashboard navigation</li>
                        <li>• Alert management</li>
                        <li>• Basic system troubleshooting</li>
                        <li>• Sensor attachment/detachment</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      Included with system purchase
                    </p>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced User Training</CardTitle>
                    <CardDescription>For managers & power users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">Duration</h4>
                      <p className="text-sm text-muted-foreground">1 day</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Topics Covered</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground mt-1">
                        <li>• Advanced data analysis</li>
                        <li>• Custom report creation</li>
                        <li>• Alert threshold customization</li>
                        <li>• User management</li>
                        <li>• System optimization</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      Included with system purchase
                    </p>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Training</CardTitle>
                    <CardDescription>For IT & maintenance staff</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">Duration</h4>
                      <p className="text-sm text-muted-foreground">2 days</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Topics Covered</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground mt-1">
                        <li>• Hardware maintenance</li>
                        <li>• Network troubleshooting</li>
                        <li>• Sensor calibration</li>
                        <li>• Gateway management</li>
                        <li>• API integration</li>
                        <li>• Data backup & recovery</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      Optional add-on service
                    </p>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="bg-muted p-6 rounded-lg mt-8">
                <h3 className="text-lg font-medium mb-3">Training Resources</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Video Library</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive collection of training videos covering all aspects of system use.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">User Manual & Documentation</h4>
                      <p className="text-sm text-muted-foreground">
                        Detailed guides and reference materials available in print and digital formats.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Interactive Learning Platform</h4>
                      <p className="text-sm text-muted-foreground">
                        Online modules with quizzes and practical exercises for self-paced learning.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Regular Webinars</h4>
                      <p className="text-sm text-muted-foreground">
                        Monthly online sessions covering advanced topics and new features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What kind of technical infrastructure do I need?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-3">
                      The minimum requirements for implementing our system are:
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Basic internet connectivity (minimum 3 Mbps download/1 Mbps upload)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Power supply for the gateway device</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Computer or mobile device for accessing the dashboard</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-3">
                      Our system uses LoRaWAN technology which allows for long-range communication, 
                      so you don't need Wi-Fi coverage across your entire operation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>How durable are the sensors?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-3">
                      Our sensors are designed specifically for agricultural environments:
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>IP67 rated (fully dust-proof and water resistant to 1m depth)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Impact-resistant casing withstands bumps and scratches</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Operating temperature range: -20°C to +55°C</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Average lifespan of 3-5 years with proper maintenance</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-3">
                      All sensors come with a 2-year warranty against manufacturing defects.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>How accurate is the disease prediction?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-3">
                      Our AI-based disease prediction system has been extensively validated:
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Overall accuracy rate of 89% across common diseases</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Early detection typically 2-3 days before visible symptoms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>False positive rate under 5%</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Algorithm continuously improves with more data</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-3">
                      The system is most accurate for respiratory, digestive, and febrile diseases. 
                      It's designed to complement, not replace, veterinary expertise.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>What ongoing support do you provide?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-3">
                      Our standard service package includes:
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>24/7 emergency technical support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Regular software updates and security patches</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Quarterly system health checks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Annual on-site maintenance visit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Access to our knowledge base and customer community</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-3">
                      Premium support packages with additional services are also available.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I integrate with my existing farm management software?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-3">
                      Yes, our system offers several integration options:
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>REST API for custom integrations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Direct integrations with major farm management platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>CSV/Excel data export for manual importing</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-3">
                      Our implementation team can assist with setting up these integrations 
                      during the system deployment process.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>What happens if a sensor malfunctions?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Our system includes comprehensive sensor monitoring that automatically 
                      detects malfunctioning sensors. When an issue is detected:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground mt-3 ml-4">
                      <li>You'll receive an immediate notification via the dashboard and email/SMS</li>
                      <li>Our system will identify the specific sensor and the nature of the malfunction</li>
                      <li>Basic troubleshooting steps will be provided</li>
                      <li>If necessary, our support team will assist with replacement</li>
                    </ol>
                    <p className="text-muted-foreground mt-3">
                      Sensor replacements are covered under warranty for manufacturing defects. 
                      We maintain a rapid replacement program to minimize any monitoring gaps.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="bg-muted p-6 rounded-lg text-center">
                <h3 className="text-lg font-medium mb-3">Still Have Questions?</h3>
                <p className="text-muted-foreground mb-6">
                  Our support team is ready to help with any additional questions you may have.
                </p>
                <Button asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Support;
