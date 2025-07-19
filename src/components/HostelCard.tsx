
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Utensils, 
  Shield, 
  Dumbbell,
  BookOpen,
  Users,
  Zap,
  Phone,
  MessageCircle,
  Flag,
  Verified
} from 'lucide-react';
import { Hostel } from '@/hooks/useHostels';
import { ReportHostelDialog } from './ReportHostelDialog';

interface HostelCardProps {
  hostel: Hostel;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  ac: <Zap className="h-4 w-4" />,
  parking: <Car className="h-4 w-4" />,
  kitchen: <Utensils className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  gym: <Dumbbell className="h-4 w-4" />,
  study_room: <BookOpen className="h-4 w-4" />,
  common_area: <Users className="h-4 w-4" />,
};

export const HostelCard: React.FC<HostelCardProps> = ({ hostel }) => {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = hostel.hostel_media?.filter(media => media.media_type === 'image') || [];
  const priceRange = `¢${(hostel.price_min / 100).toFixed(0)} - ¢${(hostel.price_max / 100).toFixed(0)}`;

  const handleContact = (method: string) => {
    switch (method) {
      case 'whatsapp':
        if (hostel.contact_whatsapp) {
          window.open(`https://wa.me/${hostel.contact_whatsapp}`, '_blank');
        }
        break;
      case 'phone':
        if (hostel.contact_phone) {
          window.open(`tel:${hostel.contact_phone}`, '_blank');
        }
        break;
      case 'in_app':
        // TODO: Implement in-app messaging
        console.log('In-app messaging not implemented yet');
        break;
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {images.length > 0 && (
          <div className="relative aspect-video bg-muted">
            <img 
              src={images[currentImageIndex]?.media_url} 
              alt={hostel.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
            {images.length > 1 && (
              <div className="absolute inset-0 flex">
                <button 
                  onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                  className="flex-1 bg-transparent hover:bg-black/10"
                />
                <button 
                  onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                  className="flex-1 bg-transparent hover:bg-black/10"
                />
              </div>
            )}
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{hostel.name}</h3>
              {hostel.is_verified && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Verified className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReportDialog(true)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{hostel.location_address}</span>
          </div>
          
          <div className="text-lg font-bold text-primary mb-3">
            {priceRange}/semester
          </div>

          <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
            <span>{hostel.available_rooms} / {hostel.total_rooms} rooms available</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {hostel.amenities.slice(0, 4).map((amenity) => (
              <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                {amenityIcons[amenity]}
                <span className="capitalize">{amenity.replace('_', ' ')}</span>
              </Badge>
            ))}
            {hostel.amenities.length > 4 && (
              <Badge variant="outline">
                +{hostel.amenities.length - 4} more
              </Badge>
            )}
          </div>

          {hostel.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {hostel.description}
            </p>
          )}
          
          <div className="flex gap-2">
            {hostel.contact_whatsapp && (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleContact('whatsapp')}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            )}
            {hostel.contact_phone && (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => handleContact('phone')}
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            )}
            {hostel.preferred_contact === 'in_app' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => handleContact('in_app')}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ReportHostelDialog 
        hostelId={hostel.id}
        hostelName={hostel.name}
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
      />
    </>
  );
};
