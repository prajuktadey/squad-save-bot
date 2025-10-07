import { Card } from "@/components/ui/card";
import { PixelMascot } from "@/components/PixelMascot";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Target, Calculator, Users, Sparkles } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center">
            <PixelMascot size="lg" isAnimating={true} />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">squad save bot</h1>
            <p className="text-xl text-muted-foreground">
              your bestie for smarter saving & spending
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h2 className="text-2xl font-bold mb-4">our mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            squad save bot helps you build better financial habits through goal tracking, 
            smart spending insights, and seamless bill splitting with friends. we believe 
            saving money should be fun, social, and achievable for everyone.
          </p>
        </Card>

        {/* Features */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">what we do</h2>
          
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">savings goals</h3>
                <p className="text-muted-foreground">
                  set and track multiple savings goals with visual progress indicators. 
                  stay motivated as you watch your savings grow toward each target.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">spend smart calculator</h3>
                <p className="text-muted-foreground">
                  see how much work time a purchase really costs. understand the true 
                  value of your money by converting prices into hours worked based on 
                  your hourly wage.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">bill split</h3>
                <p className="text-muted-foreground">
                  upload a receipt photo and let our AI-powered OCR extract items automatically. 
                  assign items to friends, calculate splits including tax and tip, and share 
                  payment links instantly.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">user stats & insights</h3>
                <p className="text-muted-foreground">
                  track your financial journey with detailed statistics about your goals, 
                  progress, and achievements. celebrate milestones and stay accountable.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Technology */}
        <Card className="p-8 mb-8 bg-muted/50">
          <h2 className="text-2xl font-bold mb-4">powered by ai</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            our bill splitting feature uses <strong>Lovable AI with Google Gemini 2.5 Flash</strong> 
            for optical character recognition (OCR). this advanced AI model can accurately read 
            and extract text from receipt photos, making bill splitting effortless and precise.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            the AI processes your receipt image, identifies individual items with their prices, 
            and structures the data so you can easily assign items to different people.
          </p>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            ready to join the squad?
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/')}
            className="text-lg px-8"
          >
            get started
          </Button>
        </div>
      </main>
    </div>
  );
};

export default About;
