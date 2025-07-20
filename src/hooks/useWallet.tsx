
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  user_id: string;
  type: 'top_up' | 'withdrawal' | 'spending' | 'earning' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method?: 'mtn_momo' | 'vodafone_cash' | 'airteltigo_money' | 'bank_card' | 'bank_transfer';
  paystack_reference?: string;
  paystack_transaction_id?: string;
  description?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchWallet = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setWallet(data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet",
        variant: "destructive",
      });
    }
  };

  const fetchTransactions = async (filter?: 'spending' | 'earning' | 'all') => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filter && filter !== 'all') {
        if (filter === 'spending') {
          query = query.in('type', ['spending', 'withdrawal']);
        } else if (filter === 'earning') {
          query = query.in('type', ['earning', 'top_up', 'refund']);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initiateTopUp = async (amount: number, paymentMethod: string) => {
    if (!user || !wallet) return null;

    try {
      const { data, error } = await supabase.functions.invoke('paystack-topup', {
        body: {
          amount: amount * 100, // Convert to pesewas
          payment_method: paymentMethod,
          wallet_id: wallet.id,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error initiating top-up:', error);
      toast({
        title: "Error",
        description: "Failed to initiate top-up",
        variant: "destructive",
      });
      return null;
    }
  };

  const initiateWithdrawal = async (amount: number, destination: string, accountDetails: any) => {
    if (!user || !wallet) return null;

    try {
      const { data, error } = await supabase.functions.invoke('paystack-withdrawal', {
        body: {
          amount: amount * 100, // Convert to pesewas
          destination,
          account_details: accountDetails,
          wallet_id: wallet.id,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error initiating withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to initiate withdrawal",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchWallet();
      fetchTransactions();
    }
  }, [user]);

  return {
    wallet,
    transactions,
    loading,
    fetchWallet,
    fetchTransactions,
    initiateTopUp,
    initiateWithdrawal,
  };
};
