
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Ticket } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import CreateEventDialog from '@/components/CreateEventDialog';
import BecomeOrganizerDialog from '@/components/BecomeOrganizerDialog';
import PurchaseTicketDialog from '@/components/PurchaseTicketDialog';
import { format } from 'date-fns';

const Parties = () => {
  const { events, loading } = useEvents();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showBecomeOrganizer, setShowBecomeOrganizer] = useState(false);
  const [showPurchaseTicket, setShowPurchaseTicket] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Parties & Events</h1>
            <p className="text-muted-foreground">Discover amazing events and parties happening around you</p>
          </div>
          <div className="flex gap-2">
            {user && (
              <>
                <Button onClick={() => setShowBecomeOrganizer(true)} variant="outline">
                  Become Organizer
                </Button>
                <Button onClick={() => setShowCreateEvent(true)}>
                  Create Event
                </Button>
              </>
            )}
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to create an amazing event!</p>
            {user && (
              <Button onClick={() => setShowBecomeOrganizer(true)}>
                Become an Organizer
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {event.flyer_url && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={event.flyer_url} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                    <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(event.event_date), 'PPP')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {format(new Date(event.event_date), 'p')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.venue}
                  </div>
                  {event.max_capacity && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      Max {event.max_capacity} people
                    </div>
                  )}
                  {event.dress_code && (
                    <div className="text-sm">
                      <span className="font-medium">Dress Code:</span> {event.dress_code}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-4">
                    <div className="text-lg font-bold text-primary">
                      ${(event.ticket_price / 100).toFixed(2)}
                    </div>
                    <Button 
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowPurchaseTicket(true);
                      }}
                      disabled={!user}
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      Buy Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialogs */}
        <CreateEventDialog 
          open={showCreateEvent} 
          onOpenChange={setShowCreateEvent} 
        />
        <BecomeOrganizerDialog 
          open={showBecomeOrganizer} 
          onOpenChange={setShowBecomeOrganizer} 
        />
        <PurchaseTicketDialog 
          open={showPurchaseTicket} 
          onOpenChange={setShowPurchaseTicket}
          event={selectedEvent}
        />
      </div>
    </div>
  );
};

export default Parties;
