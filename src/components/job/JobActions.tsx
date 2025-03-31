import { useState } from 'react';
import { CheckCircle2, DollarSign } from 'lucide-react';
import { Job } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JobActionsProps {
  job: Job;
  isUpdating: boolean;
  onMarkComplete: () => void;
  onUnmarkComplete: () => void;
  onMarkPaid: () => void;
  onUnmarkPaid: () => void;
}

export const JobActions = ({
  job,
  isUpdating,
  onMarkComplete,
  onUnmarkComplete,
  onMarkPaid,
  onUnmarkPaid,
}: JobActionsProps) => {
  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "flex-1 text-xs border-lawn/30 hover:bg-lawn/10",
          job.completed ? "bg-lawn/10 text-lawn" : "text-lawn"
        )}
        onClick={job.completed ? onUnmarkComplete : onMarkComplete}
        disabled={isUpdating}
      >
        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
        {job.completed ? 'Unmark Complete' : 'Mark Complete'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "flex-1 text-xs border-blue-300 hover:bg-blue-50",
          job.paid ? "bg-blue-50 text-blue-600" : "text-blue-600"
        )}
        onClick={job.paid ? onUnmarkPaid : onMarkPaid}
        disabled={isUpdating}
      >
        <DollarSign className="h-3.5 w-3.5 mr-1.5" />
        {job.paid ? 'Unmark Paid' : 'Mark Paid'}
      </Button>
    </div>
  );
};
