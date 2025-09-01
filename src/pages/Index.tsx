import { useState } from 'react';
import { PixelMascot } from '@/components/PixelMascot';
import { SavingsGoal } from '@/components/SavingsGoal';
import { SpendSmart } from '@/components/SpendSmart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'goals' | 'spend' | 'split'>('goals');

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
            <Button variant="outline" size="sm">
              ⚡ 47 streak
            </Button>
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
                💰 goals
              </button>
              <button
                onClick={() => setActiveTab('spend')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'spend' 
                    ? 'bg-background shadow-sm' 
                    : 'hover:bg-background/50'
                }`}
              >
                🧮 spend smart
              </button>
              <button
                onClick={() => setActiveTab('split')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'split' 
                    ? 'bg-background shadow-sm' 
                    : 'hover:bg-background/50'
                }`}
              >
                💸 bill split
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
              <SavingsGoal />
            </div>
          )}
          
          {activeTab === 'spend' && (
            <div className="animate-slide-up">
              <SpendSmart />
            </div>
          )}
          
          {activeTab === 'split' && (
            <div className="animate-slide-up">
              <Card className="p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <PixelMascot size="lg" isAnimating={true} />
                </div>
                <h2 className="text-xl font-bold">bill split coming soon!</h2>
                <p className="text-muted-foreground">
                  we're cooking up something fire for splitting bills with your squad 🔥
                </p>
                <Button variant="outline">
                  get notified when it drops ✨
                </Button>
              </Card>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-success">₹2,550</div>
              <div className="text-xs text-muted-foreground">saved this month</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold">🔥 47</div>
              <div className="text-xs text-muted-foreground">day streak</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-celebration">2/3</div>
              <div className="text-xs text-muted-foreground">goals completed</div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <PixelMascot size="sm" />
          </div>
          <p className="text-sm text-muted-foreground">
            made with 💜 for gen z by gen z
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            remember bestie: you're already winning ✨
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
