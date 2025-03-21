import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Client, Job } from '@/types';
import { getClients, saveJob } from '@/utils/localStorage';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface JobFormProps {
  job?: Job;
  clientId?: string;
  onSaved?: () => void;
}

const JobForm = ({ job, clientId, onSaved }: JobFormProps) => {
  const navigate = useNavigate();
  const isEditing = !!job;
  
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>(clientId || '');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    job ? new Date(job.scheduledDate) : undefined
  );
  const [notes, setNotes] = useState<string>(job?.notes || '');
  
  useEffect(() => {
    const loadedClients = getClients();
    setClients(loadedClients);
    
    if (clientId) {
      setSelectedClient(clientId);
    } else if (job) {
      setSelectedClient(job.clientId);
    } else if (loadedClients.length > 0) {
      setSelectedClient(loadedClients[0].id);
    }
  }, [job, clientId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) {
      toast.error('Please select a client');
      return;
    }
    
    if (!scheduledDate) {
      toast.error('Please select a date');
      return;
    }
    
    try {
      const newJob: Job = {
        id: job?.id || crypto.randomUUID(),
        clientId: selectedClient,
        scheduledDate: scheduledDate.toISOString(),
        completed: job?.completed || false,
        completedDate: job?.completedDate,
        paid: job?.paid || false,
        paidDate: job?.paidDate || undefined,
        notes: notes.trim(),
        createdAt: job?.createdAt || new Date().toISOString(),
      };
      
      saveJob(newJob);
      
      toast.success(isEditing ? 'Job updated successfully' : 'Job scheduled successfully');
      
      if (onSaved) {
        onSaved();
      } else {
        navigate('/jobs');
      }
    } catch (error) {
      toast.error('Failed to save job. Please try again.');
      console.error('Error saving job:', error);
    }
  };
  
  return (
    <Card className="animate-fade-in max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Job' : 'Schedule New Job'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            {clients.length > 0 ? (
              <Select
                value={selectedClient}
                onValueChange={setSelectedClient}
                disabled={!!clientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                No clients available. <a href="/clients/new" className="text-lawn hover:underline">Add a client</a> first.
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Scheduled Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduledDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? (
                    format(scheduledDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or notes about this job"
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              if (clientId) {
                navigate(`/clients/${clientId}`);
              } else {
                navigate('/jobs');
              }
            }}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-lawn hover:bg-lawn/90">
            {isEditing ? 'Save Changes' : 'Schedule Job'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default JobForm;
