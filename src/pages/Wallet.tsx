
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, Award, Star, Trophy, CreditCard, Smartphone, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useUserScores } from '@/hooks/useUserScores';
import { useAuth } from '@/hooks/useAuth';
import TopUpDialog from '@/components/TopUpDialog';
import WithdrawalDialog from '@/components/WithdrawalDialog';
import { format } from 'date-fns';

const Wallet = () => {
  const { wallet, transactions, loading, fetchTransactions } = useWallet();
  const { scores, badges, getCribnLevel, getRunnerLevel } = useUserScores();
  const { user } = useAuth();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'spending' | 'earning'>('all');

  const formatAmount = (amount: number) => {
    return `₵${(amount / 100).toFixed(2)}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'top_up':
      case 'earning':
      case 'refund':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'spending':
      case 'withdrawal':
        return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
      default:
        return <WalletIcon className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'top_up':
      case 'earning':
      case 'refund':
        return 'text-green-500';
      case 'spending':
      case 'withdrawal':
        return 'text-red-500';
      default:
        return 'text-foreground';
    }
  };

  const handleFilterChange = (filter: 'all' | 'spending' | 'earning') => {
    setTransactionFilter(filter);
    fetchTransactions(filter);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading wallet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to access your wallet</h1>
          </div>
        </div>
      </div>
    );
  }

  const cribnLevel = scores ? getCribnLevel(scores.cribn_score) : { level: 'Newbie', color: 'text-gray-500' };
  const runnerLevel = scores ? getRunnerLevel(scores.runner_score) : { level: 'Inactive', color: 'text-gray-500' };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Cribn Wallet</h1>
            <p className="text-muted-foreground">Manage your balance, scores, and transactions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Wallet Balance Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WalletIcon className="h-5 w-5" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-4">
                {wallet ? formatAmount(wallet.balance) : '₵0.00'}
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowTopUp(true)} className="flex-1">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Top Up
                </Button>
                <Button variant="outline" onClick={() => setShowWithdrawal(true)} className="flex-1">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scores Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Your Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Cribn Score</span>
                  <Badge variant="secondary" className={cribnLevel.color}>
                    {cribnLevel.level}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {scores?.cribn_score || 0}
                </div>
              </div>
              
              {scores && scores.errands_completed > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Runner Score</span>
                    <Badge variant="secondary" className={runnerLevel.color}>
                      {runnerLevel.level}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {scores.runner_score}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Score Breakdown */}
        {scores && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Score Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{scores.notes_uploaded}</div>
                  <div className="text-sm text-muted-foreground">Notes Shared</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{scores.events_attended}</div>
                  <div className="text-sm text-muted-foreground">Events Attended</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{scores.errands_completed}</div>
                  <div className="text-sm text-muted-foreground">Errands Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{scores.average_rating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Star className="h-3 w-3" />
                    Avg Rating
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="text-center p-3 border rounded-lg">
                    <div className="text-2xl mb-2">{badge.badge_icon || '🏆'}</div>
                    <div className="font-medium text-sm">{badge.badge_name}</div>
                    {badge.badge_description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {badge.badge_description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <Tabs value={transactionFilter} onValueChange={(value) => handleFilterChange(value as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="earning">Earnings</TabsTrigger>
                <TabsTrigger value="spending">Spending</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <WalletIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No transactions yet</h3>
                <p className="text-muted-foreground">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="font-medium">
                          {transaction.description || transaction.type.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(transaction.created_at), 'PPp')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'spending' || transaction.type === 'withdrawal' ? '-' : '+'}
                        {formatAmount(transaction.amount)}
                      </div>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <TopUpDialog open={showTopUp} onOpenChange={setShowTopUp} />
        <WithdrawalDialog open={showWithdrawal} onOpenChange={setShowWithdrawal} />
      </div>
    </div>
  );
};

export default Wallet;
