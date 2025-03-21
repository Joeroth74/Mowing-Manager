
import { useState } from 'react';
import { MoreVertical, CheckCircle2, DollarSign } from 'lucide-react';
import { Job } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface JobActionsProps {
  job: Job;
  isUpdating: boolean;
  onMarkComplete: () => void;
  onUnmarkComplete: () => void;
  onMarkPaid: () => void;
  onUnmarkPaid: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const JobActions = ({
  job,
  isUpdating,
  onMarkComplete,
  onUnmarkComplete,
  onMarkPaid,
  onUnmarkPaid,
  onEdit,
  onDelete,
}: JobActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {!job.completed && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-lawn border-lawn/30 hover:bg-lawn/10"
          onClick={onMarkComplete}
          disabled={isUpdating}
        >
          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
          Mark Complete
        </Button>
      )}
      
      {job.completed && !job.paid && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-blue-600 border-blue-300 hover:bg-blue-50"
          onClick={onMarkPaid}
          disabled={isUpdating}
        >
          <DollarSign className="h-3.5 w-3.5 mr-1.5" />
          Record Payment
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            <MoreVertical className="h-3.5 w-3.5" />
            Options
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuItem onClick={onEdit}>
            Edit Job
          </DropdownMenuItem>
          
          {job.completed && (
            <DropdownMenuItem onClick={onUnmarkComplete}>
              Unmark as Complete
            </DropdownMenuItem>
          )}
          
          {job.paid && (
            <DropdownMenuItem onClick={onUnmarkPaid}>
              Unmark as Paid
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-700 focus:bg-red-50"
            onClick={onDelete}
          >
            Delete Job
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
