import { Link } from 'react-router-dom';
import { Client } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, DollarSign } from 'lucide-react';
import { getClientJobs } from '@/utils/localStorage';

interface ClientCardProps {
  client: Client;
  onUpdate?: () => void;
}

const ClientCard = ({ client, onUpdate }: ClientCardProps) => {
  const jobs = getClientJobs(client.id);
  const completedJobs = jobs.filter(job => job.completed).length;
  const pendingPayments = jobs.filter(job => job.completed && !job.paid).length;

  return (
    <Link to={`/clients/${client.id}`} onClick={() => onUpdate?.()}>
      <Card className="hover-lift h-full overflow-hidden transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2 text-foreground">{client.name}</h3>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-lawn opacity-80" />
              <span>{client.phone || 'No phone number'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-lawn opacity-80" />
              <span className="truncate">{client.address || 'No address'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-lawn opacity-80" />
              <span>${client.price.toFixed(2)} per service</span>
            </div>
          </div>
          
          <div className="flex mt-4 pt-3 border-t text-xs text-muted-foreground">
            <div className="mr-4">
              <span className="font-semibold">{completedJobs}</span> completed
            </div>
            {pendingPayments > 0 && (
              <div className="text-amber-600 font-medium">
                {pendingPayments} unpaid
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClientCard;
