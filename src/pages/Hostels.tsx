
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { useHostels } from '@/hooks/useHostels';
import { HostelCard } from '@/components/HostelCard';
import { HostelFilters } from '@/components/HostelFilters';
import { CreateHostelDialog } from '@/components/CreateHostelDialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Hostels = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: hostels, isLoading, error } = useHostels({
    searchTerm: searchTerm || undefined,
    priceRange: priceRange[0] > 0 || priceRange[1] < 5000 ? priceRange : undefined,
    amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
  });

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-destructive">Error loading hostels. Please try again.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Student Hostels</h1>
            <p className="text-muted-foreground">Find verified accommodation near your campus</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            List Your Hostel
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <HostelFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedAmenities={selectedAmenities}
              onAmenitiesChange={setSelectedAmenities}
            />
          </div>

          {/* Mobile Filters Sheet */}
          <div className="lg:hidden">
            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <HostelFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  selectedAmenities={selectedAmenities}
                  onAmenitiesChange={setSelectedAmenities}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-muted animate-pulse rounded-lg h-96" />
                ))}
              </div>
            ) : hostels && hostels.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">
                    {hostels.length} hostel{hostels.length !== 1 ? 's' : ''} found
                  </p>
                  <div className="lg:hidden">
                    <Button variant="outline" size="sm" onClick={() => setShowMobileFilters(true)}>
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {hostels.map((hostel) => (
                    <HostelCard key={hostel.id} hostel={hostel} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-4">
                  {searchTerm || selectedAmenities.length > 0
                    ? 'No hostels found matching your filters.'
                    : 'No hostels available yet.'}
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Be the first to list a hostel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateHostelDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </Layout>
  );
};

export default Hostels;
