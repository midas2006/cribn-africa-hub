
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useReportHostel } from '@/hooks/useHostels';

interface ReportHostelDialogProps {
  hostelId: string;
  hostelName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reportReasons = [
  { value: 'misleading_info', label: 'Misleading Information' },
  { value: 'fake_listing', label: 'Fake Listing' },
  { value: 'inappropriate_content', label: 'Inappropriate Content' },
  { value: 'scam', label: 'Suspected Scam' },
  { value: 'poor_condition', label: 'Poor Condition' },
  { value: 'other', label: 'Other' },
];

export const ReportHostelDialog: React.FC<ReportHostelDialogProps> = ({
  hostelId,
  hostelName,
  open,
  onOpenChange,
}) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const reportMutation = useReportHostel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    try {
      await reportMutation.mutateAsync({
        hostelId,
        reason,
        description: description.trim() || undefined,
      });
      onOpenChange(false);
      setReason('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Hostel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Report issues with "{hostelName}"
            </p>
            
            <Label className="text-base">Reason for report</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2">
              {reportReasons.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="description">Additional Details (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide additional context about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!reason || reportMutation.isPending}
            >
              {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
