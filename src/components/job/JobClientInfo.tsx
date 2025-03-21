
import { User, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface JobClientInfoProps {
  clientName: string;
  clientAddress: string;
}

export const JobClientInfo = ({ clientName, clientAddress }: JobClientInfoProps) => {
  const handleOpenMaps = () => {
    if (!clientAddress) {
      toast.error('No address available for this client');
      return;
    }
    
    // Encode the address for a URL
    const encodedAddress = encodeURIComponent(clientAddress);
    
    // Open Google Maps in a new tab
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
  };

  return (
    <div className="space-y-1.5 mb-4">
      <div className="flex items-center text-sm text-muted-foreground">
        <User className="h-3.5 w-3.5 mr-1.5 text-lawn/70" />
        {clientName}
      </div>
      
      {clientAddress && (
        <button 
          onClick={handleOpenMaps}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <MapPin className="h-3.5 w-3.5 mr-1.5" />
          View Address
        </button>
      )}
    </div>
  );
};
