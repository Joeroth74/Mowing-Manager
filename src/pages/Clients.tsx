import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ClientCard from '@/components/ClientCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client } from '@/types';
import { getClients } from '@/utils/localStorage';
import { UserPlus, Search, Loader2 } from 'lucide-react';

const Clients = () => {
  // State
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load clients with error handling
  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedClients = getClients();
      // Sort clients by name for consistent display
      setClients(loadedClients.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      setError('Failed to load clients. Please try again.');
      console.error('Error loading clients:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial load
  useEffect(() => {
    loadClients();
  }, [loadClients]);
  
  // Memoized filtered clients
  const filteredClients = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return clients;
    
    return clients.filter(client => 
      client.name.toLowerCase().includes(query) || 
      client.address.toLowerCase().includes(query) ||
      client.phone.includes(query)
    );
  }, [clients, searchQuery]);
  
  // Handle client update
  const handleClientUpdate = useCallback(() => {
    loadClients();
  }, [loadClients]);
  
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
            <Button onClick={loadClients} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container px-4 py-6 mx-auto max-w-6xl animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground mt-1">
              Manage your client information
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link to="/clients/new">
              <Button className="bg-lawn hover:bg-lawn/90">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Client
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search clients by name, address, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map(client => (
              <ClientCard 
                key={client.id} 
                client={client}
                onUpdate={handleClientUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? 'No clients match your search' : 'No clients yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try a different search term or add a new client' 
                : 'Start by adding your first client'
              }
            </p>
            
            <Link to="/clients/new">
              <Button className="bg-lawn hover:bg-lawn/90">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Client
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
