
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-muted py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Animon Health</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Advanced animal health monitoring solutions for early disease detection and improved herd management.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/product" className="hover:text-primary transition-colors">Product</Link></li>
              <li><Link to="/roi" className="hover:text-primary transition-colors">ROI Calculator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/support" className="hover:text-primary transition-colors">Implementation</Link></li>
              <li><Link to="/support" className="hover:text-primary transition-colors">Training</Link></li>
              <li><Link to="/support" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Animon Health. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
