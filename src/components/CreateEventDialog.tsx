
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEventOrganizer } from '@/hooks/useEvents';
import { Upload } from 'lucide-react';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateEventDialog = ({ open, onOpenChange }: CreateEventDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    event_date: '',
    dress_code: '',
    ticket_price: '',
    max_capacity: '',
  });
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { organizer } = useEventOrganizer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizer) {
      toast({
        title: "Error",
        description: "You must be a verified organizer to create events",
        variant: "destructive",
      });
      return;
    }

    if (organizer.verification_status !== 'verified') {
      toast({
        title: "Error",
        description: "Your organizer account is pending verification",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let flyer_url = '';
      let video_url = '';

      // Upload flyer if provided
      if (flyerFile) {
        const { data: { user } } = await supabase.auth.getUser();
        const flyerPath = `${user?.id}/${Date.now()}_${flyerFile.name}`;
        const { error: flyerError } = await supabase.storage
          .from('event-media')
          .upload(flyerPath, flyerFile);

        if (flyerError) throw flyerError;
        
        const { data: flyerData } = supabase.storage
          .from('event-media')
          .getPublicUrl(flyerPath);
        
        flyer_url = flyerData.publicUrl;
      }

      // Upload video if provided
      if (videoFile) {
        const { data: { user } } = await supabase.auth.getUser();
        const videoPath = `${user?.id}/${Date.now()}_${videoFile.name}`;
        const { error: videoError } = await supabase.storage
          .from('event-media')
          .upload(videoPath, videoFile);

        if (videoError) throw videoError;
        
        const { data: videoData } = supabase.storage
          .from('event-media')
          .getPublicUrl(videoPath);
        
        video_url = videoData.publicUrl;
      }

      // Create event
      const { error } = await supabase.from('events').insert({
        organizer_id: organizer.id,
        title: formData.title,
        description: formData.description,
        venue: formData.venue,
        event_date: formData.event_date,
        dress_code: formData.dress_code,
        ticket_price: Math.round(parseFloat(formData.ticket_price) * 100), // Convert to cents
        max_capacity: formData.max_capacity ? parseInt(formData.max_capacity) : null,
        flyer_url,
        video_url,
        status: 'published',
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully!",
      });

      onOpenChange(false);
      setFormData({
        title: '',
        description: '',
        venue: '',
        event_date: '',
        dress_code: '',
        ticket_price: '',
        max_capacity: '',
      });
      setFlyerFile(null);
      setVideoFile(null);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="venue">Venue *</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="event_date">Date & Time *</Label>
              <Input
                id="event_date"
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="ticket_price">Ticket Price ($) *</Label>
              <Input
                id="ticket_price"
                type="number"
                step="0.01"
                value={formData.ticket_price}
                onChange={(e) => setFormData(prev => ({ ...prev, ticket_price: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="max_capacity">Max Capacity</Label>
              <Input
                id="max_capacity"
                type="number"
                value={formData.max_capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, max_capacity: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="dress_code">Dress Code</Label>
            <Input
              id="dress_code"
              value={formData.dress_code}
              onChange={(e) => setFormData(prev => ({ ...prev, dress_code: e.target.value }))}
              placeholder="e.g., Smart casual, Black tie, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="flyer">Event Flyer</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="flyer"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFlyerFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('flyer')?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {flyerFile ? flyerFile.name : 'Upload Flyer'}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="video">Vibe Video</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('video')?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {videoFile ? videoFile.name : 'Upload Video'}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
