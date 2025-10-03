import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PixelMascot } from '@/components/PixelMascot';
import { Edit2, Trash2 } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  emoji: string;
  deadline?: string | null;
}

interface EditGoalModalProps {
  goal: Goal;
  onUpdateGoal: (goalId: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (goalId: string) => void;
  loading?: boolean;
}

const EMOJI_OPTIONS = ['🎯', '💰', '🏠', '🚗', '✈', '🎮', '📱', '👟', '🎧', '💻'];

const EditGoalModal = ({ goal, onUpdateGoal, onDeleteGoal, loading = false }: EditGoalModalProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(goal.title);
  const [targetAmount, setTargetAmount] = useState(goal.target_amount.toString());
  const [selectedEmoji, setSelectedEmoji] = useState(goal.emoji);
  const [deadline, setDeadline] = useState(goal.deadline || '');

  // Reset form when goal changes
  useEffect(() => {
    setTitle(goal.title);
    setTargetAmount(goal.target_amount.toString());
    setSelectedEmoji(goal.emoji);
    setDeadline(goal.deadline || '');
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !targetAmount) return;

    onUpdateGoal(goal.id, {
      title: title.trim(),
      target_amount: parseFloat(targetAmount),
      emoji: selectedEmoji,
      deadline: deadline || null
    });

    setOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm('are you sure you want to delete this goal bestie?')) {
      onDeleteGoal(goal.id);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <PixelMascot size="sm" isAnimating={true} />
              <span>edit goal</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">goal name</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., vacation fund, new phone"
              className="lowercase"
              required
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">target amount (₹)</label>
            <Input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="25000"
              min="1"
              step="1"
              required
            />
          </div>

          {/* Emoji Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">choose an emoji</label>
            <div className="grid grid-cols-5 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`p-3 text-xl rounded-lg border-2 transition-all ${
                    selectedEmoji === emoji
                      ? 'border-primary bg-accent scale-110'
                      : 'border-border hover:border-accent hover:scale-105'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label className="text-sm font-medium">deadline (optional)</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="lowercase"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={loading || !title.trim() || !targetAmount}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  updating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  update goal
                </div>
              )}
            </Button>
            
            <Button 
              type="button"
              variant="destructive" 
              size="sm"
              onClick={handleDelete}
              className="px-3"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Current Progress Info */}
        <div className="bg-muted p-3 rounded-lg text-sm">
          <div className="text-muted-foreground mb-1">current progress</div>
          <div className="font-medium">
            ₹{goal.current_amount.toLocaleString()} / ₹{goal.target_amount.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.round((goal.current_amount / goal.target_amount) * 100)}% complete
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditGoalModal;