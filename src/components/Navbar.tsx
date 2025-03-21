
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors, Users, Calendar, BarChart3, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const links = [
    { to: '/', label: 'Dashboard', icon: BarChart3 },
    { to: '/clients', label: 'Clients', icon: Users },
    { to: '/jobs', label: 'Jobs', icon: Calendar },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 h-16 items-center justify-between px-6 bg-white/80 backdrop-blur-lg z-50 border-b animate-fade-in">
        <div className="flex items-center space-x-2">
          <Scissors className="h-6 w-6 text-lawn" />
          <span className="text-xl font-semibold">LawnCare Pro</span>
        </div>
        
        <nav className="flex items-center">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.to} 
                to={link.to}
                className={cn(
                  "relative px-4 py-2 rounded-md mx-1 font-medium flex items-center transition-all duration-200",
                  isActive(link.to) 
                    ? "text-lawn" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-lawn rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-white/80 backdrop-blur-lg z-50 border-b">
        <div className="flex items-center space-x-2">
          <Scissors className="h-5 w-5 text-lawn" />
          <span className="text-lg font-semibold">LawnCare Pro</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-lg z-40 border-b shadow-lg animate-fade-in">
          <nav className="flex flex-col p-4">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.to} 
                  to={link.to}
                  className={cn(
                    "px-4 py-3 rounded-md my-1 font-medium flex items-center",
                    isActive(link.to) 
                      ? "bg-lawn/10 text-lawn" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
      
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
