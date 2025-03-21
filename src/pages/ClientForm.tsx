
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ClientFormComponent from '@/components/ClientForm';
import { getClient } from '@/utils/localStorage';

const ClientFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const client = id ? getClient(id) : undefined;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <ClientFormComponent client={client} />
      </div>
    </div>
  );
};

export default ClientFormPage;
