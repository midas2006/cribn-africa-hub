
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Building, UtensilsCrossed, Calendar, Truck, ShoppingBag, Clock, Wallet, Star, Users, Shield, Zap } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Smart Notes',
      description: 'Organize your study materials with AI-powered note-taking and collaboration tools.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Building,
      title: 'Hostel Finder',
      description: 'Find verified, affordable accommodation near your campus with real reviews.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: UtensilsCrossed,
      title: 'Food Delivery',
      description: 'Order meals from campus restaurants and local vendors with student discounts.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Calendar,
      title: 'Campus Events',
      description: 'Stay updated with academic events, social gatherings, and career opportunities.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Truck,
      title: 'Errands Service',
      description: 'Get help with shopping, deliveries, and other tasks from verified student runners.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Buy and sell textbooks, electronics, and other student essentials safely.',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Students' },
    { value: '200+', label: 'Universities' },
    { value: '15+', label: 'Countries' },
    { value: '4.8★', label: 'User Rating' }
  ];

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cribn-blue to-blue-600">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
                Your Campus Life,
                <span className="block text-yellow-300">Simplified</span>
              </h1>
              <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in">
                The ultimate super-app for African students. From notes to accommodation, 
                food to events - everything you need in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-white text-cribn-blue hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-cribn-blue px-8 py-4 text-lg">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="animate-fade-in">
                  <div className="text-3xl sm:text-4xl font-bold text-cribn-blue mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for Campus Life
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Streamline your student experience with our comprehensive suite of tools 
                designed specifically for African students.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Verification Section */}
        <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Shield className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Verified Student Community
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of verified students across Africa. Build your Cribn Score 
                and unlock exclusive features and discounts.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-cribn-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Student Verification</h3>
                <p className="text-gray-600">Upload your student ID and join the verified community</p>
                <div className="mt-4 text-2xl font-bold text-green-500">+400 Score</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">National ID Verification</h3>
                <p className="text-gray-600">Verify your national identity for enhanced security</p>
                <div className="mt-4 text-2xl font-bold text-green-500">+500 Score</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Runner Verification</h3>
                <p className="text-gray-600">Become a verified runner and earn money helping others</p>
                <div className="mt-4 text-2xl font-bold text-purple-500">+25 Runner Score</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-cribn-blue">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students already using Cribn to simplify their campus life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-cribn-blue hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
