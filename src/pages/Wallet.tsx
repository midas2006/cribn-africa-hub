import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Gift,
  Star,
  Trophy,
  Award,
  Plus,
  Minus
} from "lucide-react";

const WalletPage = () => {
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'spending' | 'earning'>('all');

  // Mock data - will be replaced with real data from hooks
  const walletBalance = 2543.50;
  const cribnScore = 850;
  const runnerScore = 1200;

  const mockTransactions = [
    {
      id: '1',
      type: 'top_up',
      amount: 100.00,
      description: 'Mobile Money Top-up',
      created_at: '2024-01-20T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2', 
      type: 'spending',
      amount: 25.50,
      description: 'Party Ticket Purchase',
      created_at: '2024-01-19T15:45:00Z',
      status: 'completed'
    },
    {
      id: '3',
      type: 'earning',
      amount: 75.00,
      description: 'Errand Completion',
      created_at: '2024-01-18T09:15:00Z',
      status: 'completed'
    }
  ];

  const mockBadges = [
    {
      id: '1',
      badge_name: 'Trusted Scholar',
      badge_description: 'Uploaded 50+ quality notes',
      badge_icon: '📚',
      earned_at: '2024-01-15T12:00:00Z'
    },
    {
      id: '2',
      badge_name: 'Event Explorer', 
      badge_description: 'Attended 10+ campus events',
      badge_icon: '🎉',
      earned_at: '2024-01-10T18:30:00Z'
    }
  ];

  const formatAmount = (amount: number): string => {
    return `₵${amount.toFixed(2)}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'top_up':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'spending':
        return <Minus className="h-4 w-4 text-red-500" />;
      case 'earning':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string): string => {
    switch (type) {
      case 'top_up':
      case 'earning':
        return 'text-green-500';
      case 'spending':
        return 'text-red-500';
      default:
        return 'text-foreground';
    }
  };

  const getCribnLevel = (score: number) => {
    if (score >= 1000) return { level: 'Expert', color: 'text-purple-500' };
    if (score >= 500) return { level: 'Advanced', color: 'text-blue-500' };
    if (score >= 200) return { level: 'Intermediate', color: 'text-green-500' };
    if (score >= 50) return { level: 'Beginner', color: 'text-yellow-500' };
    return { level: 'Newbie', color: 'text-gray-500' };
  };

  const getRunnerLevel = (score: number) => {
    if (score >= 2000) return { level: 'Super Runner', color: 'text-purple-500' };
    if (score >= 1000) return { level: 'Pro Runner', color: 'text-blue-500' };
    if (score >= 500) return { level: 'Active Runner', color: 'text-green-500' };
    if (score >= 100) return { level: 'New Runner', color: 'text-yellow-500' };
    return { level: 'Inactive', color: 'text-gray-500' };
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    if (transactionFilter === 'all') return true;
    if (transactionFilter === 'spending') return transaction.type === 'spending';
    if (transactionFilter === 'earning') return ['earning', 'top_up'].includes(transaction.type);
    return true;
  });

  const cribnLevel = getCribnLevel(cribnScore);
  const runnerLevel = getRunnerLevel(runnerScore);

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cribn Wallet</h1>
            <p className="text-muted-foreground">Manage your campus finances and track your progress</p>
          </div>
          <Wallet className="h-8 w-8 text-primary" />
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">Current Balance</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">
              {formatAmount(walletBalance)}
            </div>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => setShowTopUp(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Top Up
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowWithdrawal(true)}
                className="flex items-center gap-2"
              >
                <TrendingDown className="h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scores Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cribn Score */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cribn Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cribnScore}</div>
              <p className={`text-sm ${cribnLevel.color} font-medium`}>
                {cribnLevel.level}
              </p>
              <Progress value={(cribnScore / 1000) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Based on notes, events, and community engagement
              </p>
            </CardContent>
          </Card>

          {/* Runner Score */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Runner Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{runnerScore}</div>
              <p className={`text-sm ${runnerLevel.color} font-medium`}>
                {runnerLevel.level}
              </p>
              <Progress value={(runnerScore / 2000) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Based on errands completed and ratings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        {mockBadges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {mockBadges.map((badge) => (
                  <Badge 
                    key={badge.id}
                    variant="secondary" 
                    className="flex items-center gap-2 py-2 px-3"
                  >
                    <span className="text-lg">{badge.badge_icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{badge.badge_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {badge.badge_description}
                      </div>
                    </div>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <Tabs 
              value={transactionFilter} 
              onValueChange={(value) => setTransactionFilter(value as typeof transactionFilter)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="earning">Earning</TabsTrigger>
                <TabsTrigger value="spending">Spending</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions found</p>
                  <p className="text-sm">Start by topping up your wallet!</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="font-medium text-sm">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'spending' ? '-' : '+'}
                      {formatAmount(transaction.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <CreditCard className="h-6 w-6" />
                <span className="text-sm">Pay Bills</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Gift className="h-6 w-6" />
                <span className="text-sm">Send Money</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Earn Points</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Star className="h-6 w-6" />
                <span className="text-sm">Leaderboard</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs would go here */}
      {showTopUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Top Up Wallet</h3>
            <p className="text-muted-foreground mb-4">Top-up functionality coming soon with Paystack integration.</p>
            <Button onClick={() => setShowTopUp(false)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}

      {showWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
            <p className="text-muted-foreground mb-4">Withdrawal functionality coming soon with Paystack integration.</p>
            <Button onClick={() => setShowWithdrawal(false)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default WalletPage;