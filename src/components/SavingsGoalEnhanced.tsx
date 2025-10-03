import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { PixelMascot } from '@/components/PixelMascot';
import { useGoals } from '@/hooks/useGoals';
import AddGoalModal from '@/components/goals/AddGoalModal';
import EditGoalModal from '@/components/goals/EditGoalModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

const SavingsGoalEnhanced = () => {
  const { goals, loading, addGoal, updateGoal, deleteGoal, addMoneyToGoal } = useGoals();
  const [celebratingGoal, setCelebratingGoal] = useState<string | null>(null);
  const [addingMoney, setAddingMoney] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleAddMoney = async (goalId: string) => {
    const amount = parseFloat(addingMoney[goalId] || '0');
    if (amount <= 0) return;

    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const newTotal = await addMoneyToGoal(goalId, amount);
      
      // Check for goal completion and trigger celebration
      if (newTotal >= goal.target_amount && goal.current_amount < goal.target_amount) {
        setCelebratingGoal(goalId);
        setTimeout(() => setCelebratingGoal(null), 3000);
      }

      // Reset input
      setAddingMoney(prev => ({ ...prev, [goalId]: '' }));
    } catch (error) {
      // Error already handled in useGoals hook
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "signed out",
        description: "see you later bestie!",
      });
    } catch (error: any) {
      toast({
        title: "couldn't sign out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
  };

  const getMotivationalMessage = (percentage: number): string => {
    if (percentage >= 100) return "goal crushed! you're a savings legend";
    if (percentage >= 75) return "so close bestie! the finish line is right there";
    if (percentage >= 50) return "halfway there! keep that momentum going";
    if (percentage >= 25) return "making moves! small steps, big dreams";
    return "every rupee counts! you got this bestie";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <PixelMascot size="lg" isAnimating={true} />
          <p className="text-muted-foreground mt-4">loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Sign Out */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">your savings squad</h2>
          <p className="text-muted-foreground">
            {goals.length === 0 
              ? "time to set your first goal bestie!" 
              : `${goals.length} goal${goals.length === 1 ? '' : 's'} in progress`
            }
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          sign out
        </Button>
      </div>

      {/* Celebration Mascot */}
      {celebratingGoal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-bounce-party">
            <PixelMascot size="lg" isAnimating={true} />
          </div>
        </div>
      )}

      {/* Goals List */}
      {goals.map((goal) => {
        const progress = getProgressPercentage(goal.current_amount, goal.target_amount);
        const isCompleted = progress >= 100;
        
        return (
          <Card key={goal.id} className={`p-6 space-y-4 transition-all ${
            isCompleted ? 'border-success bg-success/5' : ''
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{goal.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{goal.title}</h3>
                    <EditGoalModal 
                      goal={goal}
                      onUpdateGoal={updateGoal}
                      onDeleteGoal={deleteGoal}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ₹{goal.current_amount.toLocaleString()} / ₹{goal.target_amount.toLocaleString()}
                  </p>
                  {goal.deadline && (
                    <p className="text-xs text-muted-foreground">
                      deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{Math.round(progress)}%</div>
              </div>
            </div>

            <Progress value={progress} className="h-2" />
            
            <div className="text-sm text-muted-foreground">
              {getMotivationalMessage(progress)}
            </div>

            {!isCompleted && (
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="add ₹..."
                  value={addingMoney[goal.id] || ''}
                  onChange={(e) => setAddingMoney(prev => ({ ...prev, [goal.id]: e.target.value }))}
                  className="flex-1"
                  min="1"
                />
                <Button
                  onClick={() => handleAddMoney(goal.id)}
                  disabled={!addingMoney[goal.id] || parseFloat(addingMoney[goal.id] || '0') <= 0}
                  className="whitespace-nowrap"
                >
                  add money
                </Button>
              </div>
            )}
            
            {isCompleted && (
              <div className="text-center">
                <div className="text-success font-medium mb-2">goal completed!</div>
                <p className="text-sm text-muted-foreground">
                  time to celebrate and set a new challenge!
                </p>
              </div>
            )}
          </Card>
        );
      })}

      {/* Add Goal Button */}
      <AddGoalModal onAddGoal={addGoal} />

      {/* Empty State */}
      {goals.length === 0 && (
        <Card className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <PixelMascot size="lg" isAnimating={true} />
          </div>
          <h3 className="text-xl font-bold">ready to start saving?</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            create your first savings goal and watch your money grow! 
            whether it's for that dream vacation or the latest gadget, 
            every goal starts with a single step.
          </p>
        </Card>
      )}
    </div>
  );
};

export default SavingsGoalEnhanced;