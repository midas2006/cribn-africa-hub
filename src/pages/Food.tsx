
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Star, MapPin } from 'lucide-react';

const Food = () => {
  const restaurants = [
    {
      name: "Campus Kitchen",
      cuisine: "Nigerian",
      rating: 4.6,
      deliveryTime: "20-30 min",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      featured: "Jollof Rice Special"
    },
    {
      name: "Quick Bites",
      cuisine: "Fast Food",
      rating: 4.3,
      deliveryTime: "15-25 min",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      featured: "Burger & Fries Combo"
    },
    {
      name: "Mama's Kitchen",
      cuisine: "Home Style",
      rating: 4.8,
      deliveryTime: "25-35 min",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
      featured: "Traditional Soup"
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Delivery</h1>
          <p className="text-gray-600">Order delicious meals from campus and local restaurants</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video bg-gray-200">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{restaurant.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{restaurant.deliveryTime}</span>
                </div>
                
                <div className="bg-orange-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-orange-700 font-medium">
                    Featured: {restaurant.featured}
                  </p>
                </div>
                
                <Button className="w-full bg-cribn-blue hover:bg-blue-600">
                  View Menu
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Food;
