import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types';
import { getClientName, saveJob, getClient, deleteJob } from '@/utils/localStorage';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { JobClientInfo } from './job/JobClientInfo';
import { JobActions } from './job/JobActions';
import { DeleteJobDialog } from './job/DeleteJobDialog';
import { Button } from '@/components/ui/button';

interface JobCardProps {
  job: Job;
  onUpdate: () => void;
}

const JobCard = ({ job, onUpdate }: JobCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();
  
  const clientName = getClientName(job.clientId);
  const client = getClient(job.clientId);
  const clientAddress = client?.address || '';
  
  const formattedDate = format(new Date(job.scheduledDate), 'MMM dd, yyyy');
  
  const handleMarkComplete = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    const currentDate = new Date();
    console.log('Current date:', currentDate);
    
    // Ensure we're using local timezone and set time to noon to avoid timezone issues
    const completedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      12, // Set to noon
      0,
      0,
      0
    );
    console.log('Completed date before ISO:', completedDate);
    
    const isoDate = completedDate.toISOString();
    console.log('ISO date:', isoDate);
    
    const updatedJob: Job = {
      ...job,
      completed: true,
      completedDate: isoDate,
    };
    
    console.log('Updated job:', updatedJob);
    saveJob(updatedJob);
    toast.success('Job marked as completed');
    onUpdate();
    setIsUpdating(false);
  };
  
  const handleUnmarkComplete = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    const updatedJob: Job = {
      ...job,
      completed: false,
      completedDate: undefined,
    };
    
    saveJob(updatedJob);
    toast.success('Job marked as not completed');
    onUpdate();
    setIsUpdating(false);
  };
  
  const handleMarkPaid = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    const updatedJob: Job = {
      ...job,
      paid: true,
      paidDate: new Date().toISOString(),
    };
    
    saveJob(updatedJob);
    toast.success('Payment recorded');
    onUpdate();
    setIsUpdating(false);
  };
  
  const handleUnmarkPaid = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    const updatedJob: Job = {
      ...job,
      paid: false,
      paidDate: undefined,
    };
    
    saveJob(updatedJob);
    toast.success('Payment marked as not received');
    onUpdate();
    setIsUpdating(false);
  };
  
  const handleEditJob = () => {
    navigate(`/jobs/edit/${job.id}`);
  };
  
  const handleDeleteJob = () => {
    deleteJob(job.id);
    toast.success('Job deleted successfully');
    setConfirmDelete(false);
    onUpdate();
  };
  
  return (
    <>
      <Card className={cn(
        "h-full transition-all duration-300 hover:shadow-md overflow-hidden",
        job.completed ? "bg-muted/40" : "bg-white/80"
      )}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center text-sm font-medium">
              <Calendar className="h-4 w-4 mr-1.5 text-lawn/80" />
              {formattedDate}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-600 border border-gray-300 hover:text-gray-900 hover:bg-gray-100"
              onClick={handleEditJob}
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          </div>
          
          <JobClientInfo 
            clientName={clientName} 
            clientAddress={clientAddress}
          />
          
          {job.notes && (
            <p className="text-sm text-muted-foreground mt-2">{job.notes}</p>
          )}
          
          <JobActions 
            job={job}
            isUpdating={isUpdating}
            onMarkComplete={handleMarkComplete}
            onUnmarkComplete={handleUnmarkComplete}
            onMarkPaid={handleMarkPaid}
            onUnmarkPaid={handleUnmarkPaid}
          />
        </CardContent>
      </Card>

      <DeleteJobDialog 
        open={confirmDelete} 
        onOpenChange={setConfirmDelete}
        onConfirmDelete={handleDeleteJob}
      />
    </>
  );
};

export default JobCard;
