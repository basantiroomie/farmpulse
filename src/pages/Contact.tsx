
import ContactForm from "@/components/Contact/ContactForm";

const Contact = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-3">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have questions about our animal health monitoring system? Get in touch with our team.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
        
        <div className="space-y-6">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Our Offices</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Headquarters</h4>
                <address className="not-italic text-sm text-muted-foreground">
                  123 Agritech Way<br />
                  Austin, TX 78701<br />
                  United States
                </address>
              </div>
              <div>
                <h4 className="font-medium">European Office</h4>
                <address className="not-italic text-sm text-muted-foreground">
                  45 Innovation Street<br />
                  Utrecht, 3512 JJ<br />
                  Netherlands
                </address>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Phone</h4>
                  <p className="text-sm text-muted-foreground">(800) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Email</h4>
                  <p className="text-sm text-muted-foreground">info@animonhealth.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Technical Support</h4>
                  <p className="text-sm text-muted-foreground">support@animonhealth.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Business Hours</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monday - Friday</span>
                <span className="text-muted-foreground">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Saturday</span>
                <span className="text-muted-foreground">9:00 AM - 1:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sunday</span>
                <span className="text-muted-foreground">Closed</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>* Technical support is available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
