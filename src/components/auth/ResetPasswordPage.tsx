import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ResetPasswordPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecoveryContext, setIsRecoveryContext] = useState(false);

  // Detect recovery context from URL hash or query params
  const isRecoveryFromUrl = useMemo(() => {
    const hash = location.hash || ""; // e.g. #access_token=...&type=recovery
    const search = location.search || ""; // just in case
    return hash.includes("type=recovery") || search.includes("type=recovery");
  }, [location.hash, location.search]);

  useEffect(() => {
    // SEO basics
    const prevTitle = document.title;
    document.title = "Reset Password | Squad Save Bot";

    // Canonical link
    const linkEl = document.createElement("link");
    linkEl.setAttribute("rel", "canonical");
    linkEl.setAttribute("href", `${window.location.origin}/auth/reset`);
    document.head.appendChild(linkEl);

    // Meta description (update or create)
    const existingMeta = document.querySelector('meta[name="description"]');
    const prevMetaContent = existingMeta?.getAttribute("content") || null;
    if (existingMeta) {
      existingMeta.setAttribute(
        "content",
        "Reset password page for Squad Save Bot. Update your account password securely."
      );
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute(
        "content",
        "Reset password page for Squad Save Bot. Update your account password securely."
      );
      document.head.appendChild(meta);
    }

    return () => {
      document.title = prevTitle;
      document.head.removeChild(linkEl);
      if (existingMeta && prevMetaContent !== null) {
        existingMeta.setAttribute("content", prevMetaContent);
      }
    };
  }, []);

  useEffect(() => {
    // Listen for Supabase auth events to detect PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsRecoveryContext(true);
        }
      }
    );

    // If URL already indicates recovery, enable immediately
    if (isRecoveryFromUrl) setIsRecoveryContext(true);

    return () => subscription.unsubscribe();
  }, [isRecoveryFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({
        title: "password too short",
        description: "minimum 6 characters",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "passwords don’t match",
        description: "please confirm the same password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast({
        title: "password updated",
        description: "you can now sign in with your new password",
      });

      // After successful update, send them to login or home
      navigate("/auth");
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
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">reset password</h1>
          <p className="text-muted-foreground">
            {isRecoveryContext
              ? "enter a new password to secure your account"
              : "open this page from the password reset link in your email"}
          </p>
        </div>

        {isRecoveryContext ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">new password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="min 6 characters"
                className="font-mono"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">confirm password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="retype your password"
                className="font-mono"
                minLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  updating password...
                </div>
              ) : (
                "update password"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Button className="w-full" variant="secondary" onClick={() => navigate("/auth")}>back to login</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
