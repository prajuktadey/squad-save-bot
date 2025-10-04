import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PixelMascot } from '@/components/PixelMascot';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect authenticated users to main page
        if (session?.user) {
          setTimeout(() => {
            navigate('/');
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast({
          title: "welcome back bestie",
          description: "you're now logged in",
        });
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "squad sign up complete", 
          description: "check your email to verify your account",
        });
      }
    } catch (error: any) {
      let message = "something went wrong bestie";
      
      if (error.message.includes('Invalid login credentials')) {
        message = "wrong email or password bestie";
      } else if (error.message.includes('User already registered')) {
        message = "this email is already in the squad! try logging in instead";
      } else if (error.message.includes('Password should be')) {
        message = "password needs to be at least 6 characters";
      }
      
      toast({
        title: "oops!",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) throw error;

      toast({
        title: "check your email",
        description: "we sent you a password reset link",
      });
      setIsForgotPassword(false);
      setEmail("");
    } catch (error: any) {
      toast({
        title: "oops!",
        description: error.message || "something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Header with Mascot */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <PixelMascot size="lg" isAnimating={true} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">squad save bot</h1>
            <p className="text-muted-foreground">
              {isForgotPassword
                ? "reset your password"
                : isLogin
                ? "welcome back bestie!"
                : "join the savings squad!"}
            </p>
          </div>
        </div>

        {/* Toggle Form Type */}
        {!isForgotPassword && (
          <div className="flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                isLogin 
                  ? 'bg-background shadow-sm' 
                  : 'hover:bg-background/50'
              }`}
            >
              login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                !isLogin 
                  ? 'bg-background shadow-sm' 
                  : 'hover:bg-background/50'
              }`}
            >
              sign up
            </button>
          </div>
        )}

        {/* Forgot Password Form */}
        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="font-mono lowercase"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  sending reset link...
                </div>
              ) : (
                "send reset link"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setIsForgotPassword(false);
                setEmail("");
              }}
            >
              back to login
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>enter your email to receive a password reset link</p>
            </div>
          </form>
        ) : (
          /* Auth Form */
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="font-mono lowercase"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="min 6 characters"
                className="font-mono"
                minLength={6}
                required
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setPassword("");
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  forgot password?
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  {isLogin ? "logging in..." : "signing up..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isLogin ? "login" : "join squad"}
                </div>
              )}
            </Button>

            {/* Pixel Character Messages */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                {isLogin 
                  ? "ready to crush those savings goals?" 
                  : "let's build that savings empire together!"}
              </p>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AuthPage;