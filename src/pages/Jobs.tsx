import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, isToday, isPast, isFuture } from 'date-fns';
import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import JobCalendar from '@/components/JobCalendar';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job } from '@/types';
import { getJobs } from '@/utils/localStorage';
import { CalendarPlus, Loader2, LayoutGrid, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SortOrder = 'newest' | 'oldest';
type TabValue = 'upcoming' | 'today' | 'completed' | 'all';
type ViewMode = 'grid' | 'calendar';

const Jobs = () => {
  const navigate = useNavigate();
  
  // State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>('today');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Memoized filtered jobs
  const filteredJobs = useMemo(() => {
    const now = new Date();
    
    return {
      upcoming: jobs.filter(job => !job.completed && isFuture(new Date(job.scheduledDate))),
      today: jobs.filter(job => 
        // Only show jobs scheduled for today, regardless of completion status
        isToday(new Date(job.scheduledDate))
      ),
      completed: jobs.filter(job => job.completed)
        .sort((a, b) => {
          // Sort completed jobs by completion date
          const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
          const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
          return dateB - dateA;
        }),
      all: jobs
    };
  }, [jobs]);
  
  // Memoized sorting function
  const sortJobs = useCallback((jobsToSort: Job[], order: SortOrder): Job[] => {
    return [...jobsToSort].sort((a, b) => {
      let dateA: number, dateB: number;
      
      if (a.completed && a.completedDate) {
        dateA = new Date(a.completedDate).getTime();
      } else {
        dateA = new Date(a.scheduledDate).getTime();
      }
      
      if (b.completed && b.completedDate) {
        dateB = new Date(b.completedDate).getTime();
      } else {
        dateB = new Date(b.scheduledDate).getTime();
      }
      
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, []);
  
  // Load jobs with error handling
  const loadJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedJobs = getJobs();
      setJobs(sortJobs(loadedJobs, sortOrder));
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error('Error loading jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder, sortJobs]);
  
  // Initial load
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);
  
  // Handle job updates
  const handleJobUpdate = useCallback(() => {
    loadJobs();
  }, [loadJobs]);
  
  // Handle job selection in calendar
  const handleJobSelect = useCallback((job: Job) => {
    navigate(`/jobs/${job.id}`, { replace: true });
  }, [navigate]);
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container px-4 py-6 mx-auto max-w-6xl animate-fade-in">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-lawn" />
          </div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container px-4 py-6 mx-auto max-w-6xl animate-fade-in">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-600 mb-2">{error}</h3>
            <Button onClick={loadJobs} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Get current jobs based on active tab
  const currentJobs = filteredJobs[activeTab];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-6 mx-auto max-w-6xl animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
            <p className="text-muted-foreground mt-1">
              Schedule and manage lawn services
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="flex gap-2 mr-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-lawn hover:bg-lawn/90' : ''}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('calendar')}
                className={viewMode === 'calendar' ? 'bg-lawn hover:bg-lawn/90' : ''}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
            <Link to="/jobs/new">
              <Button className="bg-lawn hover:bg-lawn/90">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Schedule New Job
              </Button>
            </Link>
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="today">
                  Today {filteredJobs.today.length > 0 && `(${filteredJobs.today.length})`}
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  Upcoming {filteredJobs.upcoming.length > 0 && `(${filteredJobs.upcoming.length})`}
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed {filteredJobs.completed.length > 0 && `(${filteredJobs.completed.length})`}
                </TabsTrigger>
                <TabsTrigger value="all">
                  All Jobs {jobs.length > 0 && `(${jobs.length})`}
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Sort:</span>
                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value as SortOrder)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value={activeTab}>
              {currentJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentJobs.map(job => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      onUpdate={handleJobUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">
                    {activeTab === 'upcoming' && 'No upcoming jobs'}
                    {activeTab === 'today' && 'No jobs scheduled for today'}
                    {activeTab === 'completed' && 'No completed jobs'}
                    {activeTab === 'all' && 'No jobs yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {activeTab === 'upcoming' && 'Schedule your next lawn service'}
                    {activeTab === 'today' && 'Your schedule is clear for today'}
                    {activeTab === 'completed' && 'Jobs will appear here once completed'}
                    {activeTab === 'all' && 'Start by scheduling your first job'}
                  </p>
                  <Link to="/jobs/new">
                    <Button className="bg-lawn hover:bg-lawn/90">
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      Schedule Job
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mt-6">
            <JobCalendar jobs={jobs} onSelectJob={handleJobSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
