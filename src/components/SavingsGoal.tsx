import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PixelMascot } from './PixelMascot';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  emoji: string;
}

export const SavingsGoal = () => {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'concert tickets', target: 1500, current: 450, emoji: '🎵' },
    { id: '2', title: 'new airpods', target: 25000, current: 18000, emoji: '🎧' },
    { id: '3', title: 'thrift haul', target: 800, current: 250, emoji: '👕' }
  ]);
  
  const [celebratingGoal, setCelebratingGoal] = useState<string | null>(null);

  const addMoney = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.current + amount, goal.target);
        const wasComplete = goal.current >= goal.target;
        const isNowComplete = newCurrent >= goal.target;
        
        if (!wasComplete && isNowComplete) {
          setCelebratingGoal(goalId);
          setTimeout(() => setCelebratingGoal(null), 2000);
        }
        
        return { ...goal, current: newCurrent };
      }
      return goal;
    }));
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getMotivationalMessage = (percentage: number) => {
    if (percentage === 100) return "slay queen! goal crushed";
    if (percentage >= 75) return "almost there bestie";
    if (percentage >= 50) return "halfway there, no cap";
    if (percentage >= 25) return "good start, keep going";
    return "let's get this bag";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">your savings goals</h2>
        <p className="text-muted-foreground">track your progress and slay those targets</p>
      </div>

      <div className="grid gap-4">
        {goals.map((goal) => {
          const percentage = getProgressPercentage(goal.current, goal.target);
          const isCelebrating = celebratingGoal === goal.id;
          
          return (
            <Card key={goal.id} className="p-6 space-y-4 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.emoji}</span>
                  <div>
                    <h3 className="font-semibold">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      ₹{goal.current} / ₹{goal.target}
                    </p>
                  </div>
                </div>
                
                {isCelebrating && (
                  <PixelMascot 
                    isAnimating={true}
                    message="goal complete! you did that"
                    size="sm"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Progress 
                  value={percentage} 
                  className="h-3"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {getMotivationalMessage(percentage)}
                  </span>
                  <span className="font-medium">{Math.round(percentage)}%</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => addMoney(goal.id, 100)}
                  className="flex-1"
                >
                  +₹100
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => addMoney(goal.id, 250)}
                  className="flex-1"
                >
                  +₹250
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => addMoney(goal.id, 500)}
                  className="flex-1"
                >
                  +₹500
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Button 
        variant="outline" 
        className="w-full py-6 text-lg"
      >
        + add new goal
      </Button>
    </div>
  );
};