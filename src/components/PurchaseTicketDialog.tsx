
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/hooks/useEvents';
import { Ticket, CreditCard } from 'lucide-react';

interface PurchaseTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
}

const PurchaseTicketDialog = ({ open, onOpenChange, event }: PurchaseTicketDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async () => {
    if (!event) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('purchase-ticket', {
        body: {
          event_id: event.id,
          amount: event.ticket_price,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      if (data?.url) {
        window.open(data.url, '_blank');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      toast({
        title: "Error",
        description: "Failed to initiate ticket purchase",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{event.venue}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(event.event_date).toLocaleString()}
            </p>
          </div>

          <div className="flex justify-between items-center py-4 border-t">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">
              ${(event.ticket_price / 100).toFixed(2)}
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>• You'll receive a QR code ticket via email after purchase</p>
            <p>• Tickets are non-refundable</p>
            <p>• Show your QR code at the venue entrance</p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchase} disabled={loading}>
              <CreditCard className="h-4 w-4 mr-2" />
              {loading ? 'Processing...' : 'Buy Ticket'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseTicketDialog;
