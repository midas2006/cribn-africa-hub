
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCreateHostel } from '@/hooks/useHostels';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CreateHostelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const amenityOptions = [
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'ac', label: 'Air Conditioning' },
  { value: 'parking', label: 'Parking' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'security', label: 'Security' },
  { value: 'gym', label: 'Gym' },
  { value: 'study_room', label: 'Study Room' },
  { value: 'common_area', label: 'Common Area' },
  { value: 'backup_power', label: 'Backup Power' },
];

export const CreateHostelDialog: React.FC<CreateHostelDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location_address: '',
    price_min: '',
    price_max: '',
    total_rooms: '',
    available_rooms: '',
    amenities: [] as string[],
    contact_whatsapp: '',
    contact_phone: '',
    preferred_contact: 'whatsapp',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const createMutation = useCreateHostel();

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
    } else {
      setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalFiles = uploadedFiles.length + files.length;
    
    if (totalFiles > 10) {
      alert('Maximum 10 files allowed');
      return;
    }

    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadMediaFiles = async (hostelId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const mediaEntries = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${hostelId}/${Date.now()}-${i}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('hostel-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hostel-media')
        .getPublicUrl(fileName);

      mediaEntries.push({
        hostel_id: hostelId,
        media_url: publicUrl,
        media_type: file.type.startsWith('video/') ? 'video' : 'image',
        display_order: i,
      });
    }

    if (mediaEntries.length > 0) {
      const { error: mediaError } = await supabase
        .from('hostel_media')
        .insert(mediaEntries);

      if (mediaError) throw mediaError;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const hostelData = {
        ...formData,
        price_min: parseInt(formData.price_min) * 100, // Convert to kobo
        price_max: parseInt(formData.price_max) * 100, // Convert to kobo
        total_rooms: parseInt(formData.total_rooms),
        available_rooms: parseInt(formData.available_rooms),
        status: 'pending' as const,
        is_verified: false,
        payment_verified: false,
        latitude: null,
        longitude: null,
      };

      const hostel = await createMutation.mutateAsync(hostelData);
      
      if (uploadedFiles.length > 0) {
        await uploadMediaFiles(hostel.id);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        location_address: '',
        price_min: '',
        price_max: '',
        total_rooms: '',
        available_rooms: '',
        amenities: [],
        contact_whatsapp: '',
        contact_phone: '',
        preferred_contact: 'whatsapp',
      });
      setUploadedFiles([]);
      onOpenChange(false);
      
      // TODO: Redirect to payment page
      console.log('Redirect to payment for hostel:', hostel.id);
      
    } catch (error) {
      console.error('Error creating hostel:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Hostel Listing</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Hostel Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location Address *</Label>
              <Input
                id="location"
                value={formData.location_address}
                onChange={(e) => handleInputChange('location_address', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_min">Min Price (¢/semester) *</Label>
              <Input
                id="price_min"
                type="number"
                value={formData.price_min}
                onChange={(e) => handleInputChange('price_min', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price_max">Max Price (¢/semester) *</Label>
              <Input
                id="price_max"
                type="number"
                value={formData.price_max}
                onChange={(e) => handleInputChange('price_max', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_rooms">Total Rooms *</Label>
              <Input
                id="total_rooms"
                type="number"
                value={formData.total_rooms}
                onChange={(e) => handleInputChange('total_rooms', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="available_rooms">Available Rooms *</Label>
              <Input
                id="available_rooms"
                type="number"
                value={formData.available_rooms}
                onChange={(e) => handleInputChange('available_rooms', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {amenityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={formData.amenities.includes(option.value)}
                    onCheckedChange={(checked) => handleAmenityChange(option.value, !!checked)}
                  />
                  <Label htmlFor={option.value} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={formData.contact_whatsapp}
                onChange={(e) => handleInputChange('contact_whatsapp', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Preferred Contact Method</Label>
            <RadioGroup 
              value={formData.preferred_contact} 
              onValueChange={(value) => handleInputChange('preferred_contact', value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp-contact" />
                <Label htmlFor="whatsapp-contact">WhatsApp</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone-contact" />
                <Label htmlFor="phone-contact">Phone Call</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in_app" id="in-app-contact" />
                <Label htmlFor="in-app-contact">In-App Message</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Photos & Videos (Max 10)</Label>
            <div className="mt-2">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <div className="mt-4">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-primary hover:text-primary/80">
                      Choose files
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, MP4 up to 10MB each
                  </p>
                </div>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                  {uploadedFiles.map((file, index) => (
                    <Card key={index} className="relative">
                      <CardContent className="p-2">
                        <div className="aspect-square bg-muted rounded flex items-center justify-center">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="text-xs text-center">
                              <div>📹</div>
                              <div className="truncate">{file.name}</div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> After creating your listing, you'll need to pay a one-time fee of ¢2 to activate it. 
              Your listing will be reviewed and may receive a verification badge if it meets our standards.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || uploading}
            >
              {createMutation.isPending || uploading ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
