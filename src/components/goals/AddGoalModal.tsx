import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PixelMascot } from '@/components/PixelMascot';
import { Plus } from 'lucide-react';

interface AddGoalModalProps {
  onAddGoal: (goal: { title: string; target_amount: number; emoji: string; deadline?: string }) => void;
  loading?: boolean;
}

const EMOJI_OPTIONS = ['🎯', '💰', '🏠', '🚗', '✈️', '🎮', '📱', '👟', '🎧', '💻'];

const AddGoalModal = ({ onAddGoal, loading = false }: AddGoalModalProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !targetAmount) return;

    onAddGoal({
      title: title.trim(),
      target_amount: parseFloat(targetAmount),
      emoji: selectedEmoji,
      deadline: deadline || undefined
    });

    // Reset form
    setTitle('');
    setTargetAmount('');
    setSelectedEmoji('🎯');
    setDeadline('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full animate-bounce-party">
          <Plus className="w-4 h-4 mr-2" />
          add new goal ✨
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <PixelMascot size="sm" isAnimating={true} />
              <span>create new goal!</span>
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

          {/* Deadline (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">deadline (optional)</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="lowercase"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !title.trim() || !targetAmount}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-pixel-pulse">⌛</div>
                creating goal...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                ✨ create goal
              </div>
            )}
          </Button>
        </form>

        {/* Motivational Message */}
        <div className="text-center text-sm text-muted-foreground">
          <div className="animate-pixel-pulse mb-1">🎯</div>
          <p>every big goal starts with a small step bestie!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalModal;