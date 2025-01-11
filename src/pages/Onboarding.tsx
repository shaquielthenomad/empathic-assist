import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const membershipTiers = [
  {
    name: "Partner",
    description: "Essential tools and concierge requests",
  },
  {
    name: "Premier",
    description: "Enhanced features with priority support",
  },
  {
    name: "Private",
    description: "24/7 personalized concierge services",
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState("Partner");

  const handleContinue = async () => {
    try {
      const { error } = await supabase
        .from("user_preferences")
        .update({ membership_tier: selectedTier })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Welcome aboard!",
        description: `You're now a ${selectedTier} member.`,
      });

      navigate("/");
    } catch (error) {
      console.error("Error updating membership tier:", error);
      toast({
        title: "Error",
        description: "Failed to update membership tier. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-isabelline flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-semibold text-cafe">Choose Your Membership</h1>
          <p className="text-walnut">Select a tier that best suits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {membershipTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`cursor-pointer transition-all ${
                selectedTier === tier.name
                  ? "border-amber ring-2 ring-amber"
                  : "hover:border-amber/50"
              }`}
              onClick={() => setSelectedTier(tier.name)}
            >
              <CardHeader>
                <CardTitle className="text-cafe">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant={selectedTier === tier.name ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedTier(tier.name)}
                >
                  {selectedTier === tier.name ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-amber hover:bg-amber/90 text-cafe"
            onClick={handleContinue}
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;