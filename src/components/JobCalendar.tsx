import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Job } from '@/types';
import { getClients } from '@/utils/localStorage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';

interface JobCalendarProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom Event Component
const EventComponent = ({ event, onSelectJob }: { event: any; onSelectJob: (job: Job) => void }) => {
  const job = event.resource as Job;
  const client = event.client;
  const [isOpen, setIsOpen] = useState(false);

  const handleAddressClick = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  const getStatusText = (job: Job) => {
    if (job.completed && job.completedDate) {
      return `Completed on ${format(new Date(job.completedDate), 'MMM d, yyyy')}`;
    }
    return job.completed ? 'Completed' : 'Scheduled';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="w-full h-full cursor-pointer">
          {event.title}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-2">
          <h3 className="font-medium text-base">{client?.name || 'Unknown Client'}</h3>
          <div className="text-sm space-y-1 text-gray-600">
            <p>Scheduled for: {format(new Date(job.scheduledDate), 'MMMM d, yyyy')}</p>
            {client?.price && <p>Price: ${client.price}</p>}
            {client?.address && (
              <p>
                Address:{' '}
                <button
                  onClick={(e) => handleAddressClick(e, client.address)}
                  className="text-lawn hover:text-lawn/90 hover:underline"
                >
                  {client.address}
                </button>
              </p>
            )}
            <p>Status: {getStatusText(job)}{!job.paid && job.completed ? ' (Unpaid)' : ''}</p>
            {client?.notes && <p>Notes: {client.notes}</p>}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const JobCalendar = ({ jobs, onSelectJob }: JobCalendarProps) => {
  // Get all clients for job titles
  const clients = useMemo(() => {
    const allClients = getClients();
    return new Map(allClients.map(client => [client.id, client]));
  }, []);

  // Convert jobs to calendar events
  const events = useMemo(() => {
    return jobs.map(job => {
      const client = clients.get(job.clientId);
      const scheduledDate = new Date(job.scheduledDate);
      // Create end date as end of the scheduled day
      const endDate = new Date(scheduledDate);
      endDate.setHours(23, 59, 59);
      
      return {
        id: job.id,
        title: client ? client.name : 'Unknown Client',
        start: scheduledDate,
        end: endDate,
        resource: job,
        client: client,
        className: `job-event ${job.completed ? 'completed' : ''} ${job.paid ? 'paid' : ''}`,
      };
    });
  }, [jobs, clients]);

  // Custom event styling
  const eventStyleGetter = (event: any) => {
    const job = event.resource as Job;
    let backgroundColor = '#22c55e'; // Default green for upcoming
    let textColor = '#fff';
    let className = 'job-event';

    if (job.completed) {
      backgroundColor = '#6b7280'; // Gray for completed
      className += ' completed';
    }
    
    if (!job.paid && job.completed) {
      backgroundColor = '#f59e0b'; // Amber for unpaid
      className += ' unpaid';
    }

    return {
      style: {
        backgroundColor,
        color: textColor,
        borderRadius: '4px',
        border: 'none',
        padding: '2px 4px',
        cursor: 'pointer',
      },
      className,
    };
  };

  // Custom toolbar component
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      const newDate = subMonths(toolbar.date, 1);
      toolbar.onNavigate('prev', newDate);
    };

    const goToNext = () => {
      const newDate = addMonths(toolbar.date, 1);
      toolbar.onNavigate('next', newDate);
    };

    const currentMonth = format(toolbar.date, 'MMMM yyyy');

    return (
      <div className="flex items-center justify-center mb-4 gap-2">
        <button
          type="button"
          onClick={goToBack}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <span className="text-lg font-medium px-2">{currentMonth}</span>
        <button
          type="button"
          onClick={goToNext}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    );
  };

  return (
    <div className="h-[600px] bg-white rounded-lg shadow-sm p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month']}
        defaultView={Views.MONTH}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor={() => ''}
        components={{
          toolbar: CustomToolbar,
          event: (props) => <EventComponent {...props} onSelectJob={onSelectJob} />
        }}
      />
    </div>
  );
};

export default JobCalendar; 