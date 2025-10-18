'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState } from 'react';

interface SetAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stock?: {
    symbol: string;
    company: string;
    currentPrice: number;
  };
}

export default function SetAlertDialog({ isOpen, onClose, stock }: SetAlertDialogProps) {
  const [priceAbove, setPriceAbove] = useState('');
  const [priceBelow, setPriceBelow] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate inputs
      const above = priceAbove ? parseFloat(priceAbove) : null;
      const below = priceBelow ? parseFloat(priceBelow) : null;

      if (!above && !below) {
        toast.error('Please set at least one price alert');
        setIsSubmitting(false);
        return;
      }

      if (above && below && above <= below) {
        toast.error('Price Above must be greater than Price Below');
        setIsSubmitting(false);
        return;
      }

      // TODO: Save to database - you'll need to create a price alerts collection
      // For now, just show a success message
      toast.success(`Price alert set for ${stock?.symbol}!`, {
        description: `You'll be notified when the price ${above ? `goes above $${above}` : ''}${above && below ? ' or ' : ''}${below ? `drops below $${below}` : ''}.`,
      });

      // Reset form and close
      setPriceAbove('');
      setPriceBelow('');
      onClose();
    } catch (error) {
      toast.error('Failed to set price alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-gray-100 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Set Price Alert {stock && `for ${stock.symbol}`}
          </DialogTitle>
        </DialogHeader>

        {stock && (
          <div className="mb-4 p-4 bg-gray-900 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Current Price</p>
                <p className="text-2xl font-bold text-yellow-500">
                  ${stock.currentPrice.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">{stock.company}</p>
                <p className="text-sm text-gray-400">{stock.symbol}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="priceAbove" className="text-gray-300">
              Alert me when price goes above ($)
            </Label>
            <Input
              id="priceAbove"
              type="number"
              step="0.01"
              placeholder="e.g., 300.00"
              value={priceAbove}
              onChange={(e) => setPriceAbove(e.target.value)}
              className="bg-gray-900 border-gray-700 text-gray-100 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="priceBelow" className="text-gray-300">
              Alert me when price drops below ($)
            </Label>
            <Input
              id="priceBelow"
              type="number"
              step="0.01"
              placeholder="e.g., 200.00"
              value={priceBelow}
              onChange={(e) => setPriceBelow(e.target.value)}
              className="bg-gray-900 border-gray-700 text-gray-100 mt-2"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
            >
              {isSubmitting ? 'Setting...' : 'Set Alert'}
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          💡 Tip: You'll receive an email notification when the stock reaches your target price.
        </p>
      </DialogContent>
    </Dialog>
  );
}

