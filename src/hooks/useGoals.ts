import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  emoji: string;
  deadline?: string | null;
  created_at: string;
  updated_at: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch goals from database
  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGoals(data || []);
    } catch (error: any) {
      toast({
        title: "failed to load goals 😔",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new goal
  const addGoal = async (goalData: {
    title: string;
    target_amount: number;
    emoji: string;
    deadline?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create goals');
      }

      const { data, error } = await supabase
        .from('savings_goals')
        .insert([{
          ...goalData,
          user_id: user.id,
          current_amount: 0
        }])
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      
      toast({
        title: "goal created! 🎯",
        description: "time to start saving bestie!",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "couldn't create goal 😔",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Update existing goal
  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .update(updates)
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => 
        prev.map(goal => goal.id === goalId ? data : goal)
      );

      toast({
        title: "goal updated! ✨",
        description: "looking good bestie!",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "couldn't update goal 😔",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Delete goal
  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      
      toast({
        title: "goal deleted 🗑️",
        description: "no worries, you got this!",
      });
    } catch (error: any) {
      toast({
        title: "couldn't delete goal 😔",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Add money to goal
  const addMoneyToGoal = async (goalId: string, amount: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) throw new Error('Goal not found');

      const newAmount = goal.current_amount + amount;
      
      await updateGoal(goalId, { current_amount: newAmount });

      // Check if goal is completed
      if (newAmount >= goal.target_amount && goal.current_amount < goal.target_amount) {
        toast({
          title: "goal completed! 🎉",
          description: "you absolute legend! time to celebrate!",
        });
      }

      return newAmount;
    } catch (error: any) {
      toast({
        title: "couldn't add money 😔",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    fetchGoals();

    const channel = supabase
      .channel('savings_goals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'savings_goals'
        },
        (payload) => {
          // Refetch goals when changes occur
          fetchGoals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    addMoneyToGoal,
    refetch: fetchGoals
  };
};