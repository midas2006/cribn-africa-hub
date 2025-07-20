
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Smartphone, Building } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WithdrawalDialog: React.FC<WithdrawalDialogProps> = ({ open, onOpenChange }) => {
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('mtn_momo');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { wallet, initiateWithdrawal } = useWallet();
  const { toast } = useToast();

  const withdrawalMethods = [
    { id: 'mtn_momo', name: 'MTN Mobile Money', icon: Smartphone },
    { id: 'vodafone_cash', name: 'Vodafone Cash', icon: Smartphone },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: Building },
  ];

  const handleWithdrawal = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!wallet || parseFloat(amount) * 100 > wallet.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (!accountNumber || !accountName) {
      toast({
        title: "Missing Details",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const accountDetails = {
        account_number: accountNumber,
        account_name: accountName,
        bank_code: destination === 'bank_transfer' ? bankCode : undefined,
      };

      const result = await initiateWithdrawal(parseFloat(amount), destination, accountDetails);
      if (result) {
        toast({
          title: "Withdrawal Initiated",
          description: "Your withdrawal request has been submitted",
        });
        onOpenChange(false);
        // Reset form
        setAmount('');
        setAccountNumber('');
        setAccountName('');
        setBankCode('');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw from Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
            <div className="text-sm text-muted-foreground mt-1">
              Available: ₵{wallet ? (wallet.balance / 100).toFixed(2) : '0.00'}
            </div>
          </div>

          <div>
            <Label>Withdrawal Method</Label>
            <RadioGroup value={destination} onValueChange={setDestination} className="mt-2">
              {withdrawalMethods.map((method) => (
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

          <div>
            <Label htmlFor="accountNumber">
              {destination === 'bank_transfer' ? 'Account Number' : 'Phone Number'}
            </Label>
            <Input
              id="accountNumber"
              placeholder={destination === 'bank_transfer' ? 'Enter account number' : 'Enter phone number'}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              placeholder="Enter account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          {destination === 'bank_transfer' && (
            <div>
              <Label htmlFor="bankCode">Bank Code</Label>
              <Input
                id="bankCode"
                placeholder="Enter bank code"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleWithdrawal} disabled={loading} className="flex-1">
              {loading ? "Processing..." : "Withdraw"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;
