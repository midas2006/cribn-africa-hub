
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Smartphone, CreditCard } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TopUpDialog: React.FC<TopUpDialogProps> = ({ open, onOpenChange }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mtn_momo');
  const [loading, setLoading] = useState(false);
  const { initiateTopUp } = useWallet();
  const { toast } = useToast();

  const paymentMethods = [
    { id: 'mtn_momo', name: 'MTN Mobile Money', icon: Smartphone },
    { id: 'vodafone_cash', name: 'Vodafone Cash', icon: Smartphone },
    { id: 'airteltigo_money', name: 'AirtelTigo Money', icon: Smartphone },
    { id: 'bank_card', name: 'Debit/Credit Card', icon: CreditCard },
  ];

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await initiateTopUp(parseFloat(amount), paymentMethod);
      if (result?.authorization_url) {
        // Open Paystack payment page in new tab
        window.open(result.authorization_url, '_blank');
        toast({
          title: "Payment Initiated",
          description: "Complete your payment in the new tab",
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Top-up error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Top Up Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="amount">Amount (₵)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
            />
          </div>

          <div>
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer">
                    <method.icon className="h-4 w-4" />
                    {method.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleTopUp} disabled={loading} className="flex-1">
              {loading ? "Processing..." : "Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpDialog;
