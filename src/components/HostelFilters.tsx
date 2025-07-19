
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface HostelFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedAmenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
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

export const HostelFilters: React.FC<HostelFiltersProps> = ({
  searchTerm,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  selectedAmenities,
  onAmenitiesChange,
}) => {
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      onAmenitiesChange([...selectedAmenities, amenity]);
    } else {
      onAmenitiesChange(selectedAmenities.filter(a => a !== amenity));
    }
  };

  const removeAmenity = (amenity: string) => {
    onAmenitiesChange(selectedAmenities.filter(a => a !== amenity));
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onPriceRangeChange([0, 5000]);
    onAmenitiesChange([]);
  };

  const hasActiveFilters = searchTerm || priceRange[0] > 0 || priceRange[1] < 5000 || selectedAmenities.length > 0;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>

        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Price Range (¢/semester)</Label>
          <div className="mt-3">
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange([value[0], value[1]])}
              max={5000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>¢{priceRange[0]}</span>
              <span>¢{priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div>
          <Label>Amenities</Label>
          {selectedAmenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {selectedAmenities.map((amenity) => {
                const option = amenityOptions.find(opt => opt.value === amenity);
                return (
                  <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                    {option?.label || amenity}
                    <button onClick={() => removeAmenity(amenity)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {amenityOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={selectedAmenities.includes(option.value)}
                  onCheckedChange={(checked) => handleAmenityChange(option.value, !!checked)}
                />
                <Label htmlFor={option.value} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
