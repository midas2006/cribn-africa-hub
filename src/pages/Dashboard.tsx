
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Building, UtensilsCrossed, Calendar, Truck, ShoppingBag, Clock, Wallet, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const quickActions = [
    { icon: BookOpen, title: 'Notes', description: 'Access your study materials', href: '/notes', color: 'bg-blue-100 text-blue-600' },
    { icon: Building, title: 'Hostels', description: 'Find accommodation', href: '/hostels', color: 'bg-green-100 text-green-600' },
    { icon: UtensilsCrossed, title: 'Food', description: 'Order meals', href: '/food', color: 'bg-orange-100 text-orange-600' },
    { icon: Calendar, title: 'Events', description: 'Campus happenings', href: '/events', color: 'bg-purple-100 text-purple-600' },
    { icon: Truck, title: 'Errands', description: 'Get help with tasks', href: '/errands', color: 'bg-red-100 text-red-600' },
    { icon: ShoppingBag, title: 'Marketplace', description: 'Buy & sell items', href: '/marketplace', color: 'bg-indigo-100 text-indigo-600' },
    { icon: Clock, title: 'Attendance', description: 'Track your classes', href: '/attendance', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Wallet, title: 'Wallet', description: 'Manage finances', href: '/wallet', color: 'bg-pink-100 text-pink-600' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Here's what's happening with your campus life today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cribn Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cribn-blue">850</div>
              <p className="text-xs text-muted-foreground">+25 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 food, 1 errand</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week's Classes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12/15</div>
              <p className="text-xs text-muted-foreground">80% attendance rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <a key={index} href={action.href} className="block">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <UtensilsCrossed className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Food order delivered</p>
                  <p className="text-xs text-gray-600">Jollof rice from Campus Kitchen • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New study notes shared</p>
                  <p className="text-xs text-gray-600">Mathematics 101 - Calculus • 1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Event reminder</p>
                  <p className="text-xs text-gray-600">Career Fair tomorrow at 10 AM • 2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
