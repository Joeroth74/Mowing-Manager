
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FinancialSummary from '@/components/FinancialSummary';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getClients, getJobs, getUpcomingJobs } from '@/utils/localStorage';
import { Client, Job } from '@/types';
import { CalendarPlus, Users, Plus } from 'lucide-react';

const Index = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [upcomingJobs, setUpcomingJobs] = useState<Job[]>([]);
  const [showRefresh, setShowRefresh] = useState(false);
  
  const loadData = () => {
    setClients(getClients());
    setUpcomingJobs(getUpcomingJobs(7));
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleJobUpdate = () => {
    loadData();
    setShowRefresh(true);
    setTimeout(() => setShowRefresh(false), 3000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-6 mx-auto max-w-6xl animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your lawn care business
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            <FinancialSummary />
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Jobs</CardTitle>
                    <CardDescription>Next 7 days</CardDescription>
                  </div>
                  <Link to="/jobs/new">
                    <Button size="sm" className="bg-lawn hover:bg-lawn/90">
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      Schedule Job
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingJobs.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {upcomingJobs.map(job => (
                      <JobCard 
                        key={job.id} 
                        job={job} 
                        onUpdate={handleJobUpdate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No upcoming jobs scheduled</p>
                    <Link to="/jobs/new">
                      <Button size="sm" className="bg-lawn hover:bg-lawn/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Your First Job
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Clients</CardTitle>
                  <Link to="/clients/new">
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {clients.length > 0 ? (
                  <div className="space-y-2">
                    {clients.slice(0, 5).map(client => (
                      <Link 
                        key={client.id} 
                        to={`/clients/${client.id}`}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <span className="font-medium">{client.name}</span>
                        <span className="text-lawn font-medium">${client.price}</span>
                      </Link>
                    ))}
                    
                    {clients.length > 5 && (
                      <Link 
                        to="/clients" 
                        className="block text-sm text-center text-muted-foreground hover:text-foreground mt-3 py-2"
                      >
                        View all {clients.length} clients
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-3">No clients yet</p>
                    <Link to="/clients/new">
                      <Button className="bg-lawn hover:bg-lawn/90" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Add Your First Client
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Link to="/clients/new">
                      <Button className="w-full" variant="outline">
                        Add Client
                      </Button>
                    </Link>
                    <Link to="/jobs/new">
                      <Button className="w-full" variant="outline">
                        Schedule Job
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
