import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelMascot } from '@/components/PixelMascot';
import SavingsGoalEnhanced from '@/components/SavingsGoalEnhanced';
import { SpendSmart } from '@/components/SpendSmart';
import { BillSplit } from '@/components/BillSplit';
import { Button } from '@/components/ui/button';
import { useGoals } from '@/hooks/useGoals';
import { useTheme } from '@/hooks/useTheme';
import UserStats from '@/components/UserStats';
import { Moon, Sun, Info } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'goals' | 'spend' | 'split'>('goals');
  const { goals } = useGoals();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PixelMascot size="md" />
              <div>
                <h1 className="text-2xl font-bold">squad save bot</h1>
                <p className="text-sm text-muted-foreground">your gen z finance bestie</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/about')}
                className="gap-2"
              >
                <Info className="h-4 w-4" />
                about
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleTheme}
                className="gap-2"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? 'light' : 'dark'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('goals')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'goals' 
                    ? 'bg-background shadow-sm' 
                    : 'hover:bg-background/50'
                }`}
              >
                goals
              </button>
              <button
                onClick={() => setActiveTab('spend')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'spend' 
                    ? 'bg-background shadow-sm' 
                    : 'hover:bg-background/50'
                }`}
              >
                spend smart
              </button>
              <button
                onClick={() => setActiveTab('split')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'split' 
                    ? 'bg-background shadow-sm' 
                    : 'hover:bg-background/50'
                }`}
              >
                bill split
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {activeTab === 'goals' && (
            <div className="animate-slide-up">
              <SavingsGoalEnhanced />
            </div>
          )}
          
          {activeTab === 'spend' && (
            <div className="animate-slide-up">
              <SpendSmart />
            </div>
          )}
          
          {activeTab === 'split' && (
            <div className="animate-slide-up">
              <BillSplit />
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="max-w-2xl mx-auto mt-8">
          <UserStats goals={goals} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <PixelMascot size="sm" />
          </div>
          <p className="text-sm text-muted-foreground">
            made with love by prajukta
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
