
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Client } from '@/types';
import { saveClient } from '@/utils/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ClientFormProps {
  client?: Client;
  onSaved?: () => void;
}

const ClientForm = ({ client, onSaved }: ClientFormProps) => {
  const navigate = useNavigate();
  const isEditing = !!client;
  
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt'>>({
    name: '',
    phone: '',
    address: '',
    price: 0,
    notes: '',
  });
  
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        phone: client.phone,
        address: client.address,
        price: client.price,
        notes: client.notes || '',
      });
    }
  }, [client]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Client name is required');
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    
    if (!formData.address.trim()) {
      toast.error('Address is required');
      return;
    }
    
    if (formData.price <= 0) {
      toast.error('Price must be greater than zero');
      return;
    }
    
    const newClient: Client = {
      id: client?.id || crypto.randomUUID(),
      createdAt: client?.createdAt || new Date().toISOString(),
      ...formData,
    };
    
    saveClient(newClient);
    
    toast.success(isEditing ? 'Client updated successfully' : 'Client added successfully');
    
    if (onSaved) {
      onSaved();
    } else {
      navigate('/clients');
    }
  };
  
  return (
    <Card className="animate-fade-in max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Client' : 'Add New Client'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Client name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price per Service ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about this client"
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/clients')}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-lawn hover:bg-lawn/90">
            {isEditing ? 'Save Changes' : 'Add Client'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ClientForm;
