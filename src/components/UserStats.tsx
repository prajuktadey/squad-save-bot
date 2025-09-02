import { useMemo } from 'react';
import { Card } from '@/components/ui/card';

interface Goal {
  id: string;
  current_amount: number;
  target_amount: number;
  created_at: string;
  updated_at: string;
}

interface UserStatsProps {
  goals: Goal[];
}

const UserStats = ({ goals }: UserStatsProps) => {
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate total saved this month (based on goal progress)
    const savedThisMonth = goals.reduce((total, goal) => {
      const goalCreated = new Date(goal.created_at);
      const goalUpdated = new Date(goal.updated_at);
      
      // If goal was updated this month, count current amount
      if (goalUpdated.getMonth() === currentMonth && goalUpdated.getFullYear() === currentYear) {
        return total + goal.current_amount;
      }
      return total;
    }, 0);

    // Calculate completed goals
    const completedGoals = goals.filter(goal => goal.current_amount >= goal.target_amount).length;
    const totalGoals = goals.length;

    // Simple streak calculation (days since first goal created)
    const firstGoalDate = goals.length > 0 
      ? new Date(Math.min(...goals.map(g => new Date(g.created_at).getTime())))
      : new Date();
    
    const daysSinceFirst = Math.max(1, Math.floor((now.getTime() - firstGoalDate.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      savedThisMonth,
      streak: goals.length > 0 ? daysSinceFirst : 0,
      completedGoals,
      totalGoals
    };
  }, [goals]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-success">
          ₹{stats.savedThisMonth.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground">saved this month</div>
      </Card>
      
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold">🔥 {stats.streak}</div>
        <div className="text-xs text-muted-foreground">day streak</div>
      </Card>
      
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-celebration">
          {stats.completedGoals}/{stats.totalGoals}
        </div>
        <div className="text-xs text-muted-foreground">goals completed</div>
      </Card>
    </div>
  );
};

export default UserStats;