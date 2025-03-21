
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import ClientForm from '@/components/ClientForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Client, Job } from '@/types';
import { getClient, getClientJobs, deleteClient } from '@/utils/localStorage';
import { 
  User, 
  Phone, 
  MapPin, 
  DollarSign, 
  CalendarPlus, 
  Trash2, 
  Edit, 
  ChevronLeft 
} from 'lucide-react';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  useEffect(() => {
    if (id) {
      const clientData = getClient(id);
      if (clientData) {
        setClient(clientData);
        loadJobs(id);
      } else {
        toast.error('Client not found');
        navigate('/clients');
      }
    }
  }, [id, navigate]);
  
  const loadJobs = (clientId: string) => {
    const clientJobs = getClientJobs(clientId);
    // Sort by date, with upcoming first
    clientJobs.sort((a, b) => {
      if (!a.completed && b.completed) return -1;
      if (a.completed && !b.completed) return 1;
      return new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime();
    });
    setJobs(clientJobs);
  };
  
  const handleDeleteClient = () => {
    if (id) {
      deleteClient(id);
      toast.success('Client deleted successfully');
      navigate('/clients');
    }
  };
  
  const handleJobUpdate = () => {
    if (id) {
      loadJobs(id);
    }
  };
  
  if (!client && !isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container px-4 py-10 mx-auto max-w-6xl">
          <div className="text-center">Loading client information...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-6 mx-auto max-w-6xl animate-fade-in">
        <div className="mb-6">
          <Link to="/clients" className="text-muted-foreground hover:text-foreground flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Clients
          </Link>
        </div>
        
        {isEditing ? (
          <div>
            <h1 className="text-2xl font-bold mb-6">Edit Client</h1>
            <ClientForm 
              client={client || undefined} 
              onSaved={() => {
                setIsEditing(false);
                if (id) {
                  const updatedClient = getClient(id);
                  if (updatedClient) setClient(updatedClient);
                }
              }} 
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold">{client?.name}</h1>
              
              <div className="flex space-x-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive/30">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {client?.name} and all associated jobs.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteClient}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                
                <Link to={`/jobs/new/${id}`}>
                  <Button size="sm" className="bg-lawn hover:bg-lawn/90">
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Schedule Job
                  </Button>
                </Link>
              </div>
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="details">Client Details</TabsTrigger>
                <TabsTrigger value="jobs">
                  Jobs {jobs.length > 0 && `(${jobs.length})`}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-3 text-lawn" />
                              <span>{client?.name}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-3 text-lawn" />
                              <span>{client?.phone}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Service Details</h3>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-3 text-lawn" />
                            <span>${client?.price.toFixed(2)} per service</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Address</h3>
                          <div className="flex">
                            <MapPin className="h-4 w-4 mr-3 text-lawn flex-shrink-0" />
                            <span>{client?.address}</span>
                          </div>
                        </div>
                        
                        {client?.notes && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                            <p className="text-sm">{client.notes}</p>
                          </div>
                        )}
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Client Since</h3>
                          <p className="text-sm">
                            {client?.createdAt && format(new Date(client.createdAt), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-3">Job Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <div className="text-2xl font-bold">{jobs.length}</div>
                        <div className="text-sm text-muted-foreground">Total Jobs</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {jobs.filter(job => job.completed).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {jobs.filter(job => !job.completed).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Upcoming</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-lawn">
                          ${(jobs.filter(job => job.paid).length * (client?.price || 0)).toFixed(0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Paid</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="jobs">
                {jobs.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {jobs.map(job => (
                      <JobCard key={job.id} job={job} onUpdate={handleJobUpdate} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <h3 className="text-lg font-medium mb-2">No jobs yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Schedule the first job for this client
                      </p>
                      <Link to={`/jobs/new/${id}`}>
                        <Button className="bg-lawn hover:bg-lawn/90">
                          <CalendarPlus className="h-4 w-4 mr-2" />
                          Schedule Job
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;
