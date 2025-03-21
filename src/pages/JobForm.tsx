
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import JobFormComponent from '@/components/JobForm';
import { getJob } from '@/utils/localStorage';

const JobFormPage = () => {
  const { id, clientId } = useParams<{ id?: string, clientId?: string }>();
  const job = id ? getJob(id) : undefined;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <JobFormComponent job={job} clientId={clientId} />
      </div>
    </div>
  );
};

export default JobFormPage;
