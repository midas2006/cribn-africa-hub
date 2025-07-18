import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Building, UtensilsCrossed, Calendar, Truck, ShoppingBag, Clock, Wallet, Star, Users, Shield, Zap } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
const Index = () => {
  const features = [{
    icon: BookOpen,
    title: 'Smart Notes',
    description: 'Organize your study materials with AI-powered note-taking and collaboration tools.',
    color: 'bg-blue-100 text-blue-600'
  }, {
    icon: Building,
    title: 'Hostel Finder',
    description: 'Find verified, affordable accommodation near your campus with real reviews.',
    color: 'bg-green-100 text-green-600'
  }, {
    icon: UtensilsCrossed,
    title: 'Food Delivery',
    description: 'Order meals from campus restaurants and local vendors with student discounts.',
    color: 'bg-orange-100 text-orange-600'
  }, {
    icon: Calendar,
    title: 'Campus Events',
    description: 'Stay updated with academic events, social gatherings, and career opportunities.',
    color: 'bg-purple-100 text-purple-600'
  }, {
    icon: Truck,
    title: 'Errands Service',
    description: 'Get help with shopping, deliveries, and other tasks from verified student runners.',
    color: 'bg-red-100 text-red-600'
  }, {
    icon: ShoppingBag,
    title: 'Marketplace',
    description: 'Buy and sell textbooks, electronics, and other student essentials safely.',
    color: 'bg-indigo-100 text-indigo-600'
  }];
  const stats = [{
    value: '50K+',
    label: 'Active Students'
  }, {
    value: '200+',
    label: 'Universities'
  }, {
    value: '15+',
    label: 'Countries'
  }, {
    value: '4.8★',
    label: 'User Rating'
  }];
  return <Layout>
      <div className="bg-background min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background to-card border-b border-border">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-semibold text-foreground mb-6 tracking-tight">
                Professional Student
                <span className="block text-accent">Platform</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Streamlined tools and services designed for modern student 
                productivity and academic excellence worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3 font-medium">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-6 py-3 font-medium">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => <div key={index}>
                  <div className="text-2xl sm:text-3xl font-semibold text-accent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>)}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-foreground mb-4">
                Core Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools for modern student productivity and academic success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
              const Icon = feature.icon;
              return <Card key={index} className="hover:border-accent/50 transition-colors border-border bg-card">
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="text-lg font-medium text-card-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>;
            })}
            </div>
          </div>
        </section>

        {/* Verification Section */}
        <section className="py-20 bg-muted/20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-3xl font-semibold text-foreground mb-4">
                Verified Community
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Build trust through verification and unlock enhanced features with our scoring system.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-card-foreground">Student Verification</h3>
                <p className="text-sm text-muted-foreground mb-3">Upload student ID to join verified community</p>
                <div className="text-lg font-semibold text-accent">+400 Score</div>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-card-foreground">National ID Verification</h3>
                <p className="text-sm text-muted-foreground mb-3">Verify identity for enhanced security</p>
                <div className="text-lg font-semibold text-accent">+500 Score</div>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-card-foreground">Runner Verification</h3>
                <p className="text-sm text-muted-foreground mb-3">Become verified runner and earn income</p>
                <div className="text-lg font-semibold text-accent">+25 Runner Score</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        
      </div>
    </Layout>;
};
export default Index;