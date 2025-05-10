import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Public links that are always visible
  const publicLinks = user?.isAdmin 
    ? [
        { name: "System Overview", path: "/admin/overview" },
        { name: "Analytics", path: "/admin/analytics" },
        { name: "Alerts", path: "/admin/alerts" },
        { name: "Users", path: "/admin/users" },
        { name: "Reports", path: "/admin/reports" }
      ]
    : [
        { name: "Home", path: "/" },
        { name: "ROI Calculator", path: "/roi-calculator" },
        { name: "Support", path: "/support" },
        { name: "Contact", path: "/contact" },
      ];

  // Protected links only visible when logged in (but not for admin)
  const protectedLinks = user?.isAdmin 
    ? []
    : [{ name: "Dashboard", path: "/dashboard" }];

  const getVisibleLinks = () => {
    let links = [...publicLinks];
    if (user && !user.isAdmin) {
      links.push(...protectedLinks);
    }
    return links;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo and title */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">FarmPulse AI</span>
          </Link>
        </div>
        
        {/* Thin divider line */}
        <div className="h-8 mx-4 border-l border-gray-200 dark:border-gray-700"></div>
        
        {/* Desktop navigation - public links positioned to the left */}
        <nav className="hidden md:flex items-center gap-6 mr-auto">
          {getVisibleLinks().map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Authentication and theme toggle - positioned to the right */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.isAdmin ? "Admin" : user.email}
              </span>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden ml-auto">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
            <nav className="container py-6 flex flex-col gap-4">
              {getVisibleLinks().map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex flex-col gap-4">
                  <span className="text-sm text-muted-foreground">
                    {user.isAdmin ? "Admin" : user.email}
                  </span>
                  <Button variant="ghost" onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )}
              <ThemeToggle />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;