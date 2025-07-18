
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Wifi, Car, Utensils } from 'lucide-react';

const Hostels = () => {
  const hostels = [
    {
      name: "University View Hostel",
      location: "0.5km from campus",
      price: "₦50,000/semester",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
      amenities: ["WiFi", "Parking", "Kitchen"]
    },
    {
      name: "Student Palace",
      location: "1.2km from campus",
      price: "₦45,000/semester",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      amenities: ["WiFi", "Kitchen", "Security"]
    },
    {
      name: "Campus Lodge",
      location: "0.8km from campus",
      price: "₦55,000/semester",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      amenities: ["WiFi", "Parking", "Kitchen", "Gym"]
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hostels</h1>
          <p className="text-gray-600">Find verified accommodation near your campus</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200">
                <img 
                  src={hostel.image} 
                  alt={hostel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{hostel.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{hostel.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{hostel.location}</span>
                </div>
                
                <div className="text-lg font-bold text-cribn-blue mb-4">
                  {hostel.price}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {hostel.amenities.map((amenity, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                      {amenity}
                    </span>
                  ))}
                </div>
                
                <Button className="w-full bg-cribn-blue hover:bg-blue-600">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Hostels;
