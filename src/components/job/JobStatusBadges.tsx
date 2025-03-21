
import { CheckCircle2, Clock, BanknoteIcon } from 'lucide-react';
import { Job } from '@/types';

interface JobStatusBadgesProps {
  job: Job;
}

export const JobStatusBadges = ({ job }: JobStatusBadgesProps) => {
  return (
    <div className="flex space-x-1">
      {job.completed ? (
        <span className="flex items-center text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </span>
      ) : (
        <span className="flex items-center text-xs bg-amber-100 text-amber-800 rounded-full px-2 py-1">
          <Clock className="h-3 w-3 mr-1" />
          Scheduled
        </span>
      )}
      
      {job.paid && (
        <span className="flex items-center text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
          <BanknoteIcon className="h-3 w-3 mr-1" />
          Paid
        </span>
      )}
    </div>
  );
};
