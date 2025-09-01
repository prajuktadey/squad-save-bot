import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PixelMascot } from './PixelMascot';

export const SpendSmart = () => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [hourlyWage, setHourlyWage] = useState('15'); // default min wage
  const [calculation, setCalculation] = useState<{
    hours: number;
    days: number;
    message: string;
  } | null>(null);

  const calculateWorkTime = () => {
    const price = parseFloat(itemPrice);
    const wage = parseFloat(hourlyWage);
    
    if (!price || !wage || price <= 0 || wage <= 0) return;
    
    const hours = Math.ceil(price / wage);
    const days = Math.ceil(hours / 8); // assuming 8 hour work day
    
    let message = '';
    if (hours <= 2) {
      message = "that's quick money! go for it bestie 💅";
    } else if (hours <= 8) {
      message = "a few hours of work - worth it? 🤔";
    } else if (hours <= 24) {
      message = "that's like 1-3 days of work... think twice! 💭";
    } else {
      message = "bestie... that's a lot of work hours 😬";
    }
    
    setCalculation({ hours, days, message });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">spend smart calculator</h2>
        <p className="text-sm text-muted-foreground">see how much work time that purchase really costs</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="item">what do you want to buy?</Label>
          <Input
            id="item"
            placeholder="e.g. new shoes, coffee, etc."
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">price ($)</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="wage">your hourly wage ($)</Label>
            <Input
              id="wage"
              type="number"
              placeholder="15.00"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculateWorkTime} className="w-full">
          calculate work time ⏰
        </Button>

        {calculation && (
          <div className="mt-6 p-4 bg-muted rounded-lg space-y-3 animate-slide-up">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <PixelMascot size="sm" isAnimating={true} />
                <div>
                  <p className="font-semibold text-lg">
                    {itemName || 'that item'} = {calculation.hours} hours of work
                  </p>
                  <p className="text-sm text-muted-foreground">
                    (about {calculation.days} day{calculation.days > 1 ? 's' : ''})
                  </p>
                </div>
              </div>
              
              <div className="bg-background p-3 rounded-lg border">
                <p className="text-sm font-medium">{calculation.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};