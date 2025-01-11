import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const membershipTiers = [
  {
    name: "Partner",
    description: "Essential tools and concierge requests",
    features: ["Basic task management", "Standard support", "Basic concierge access"],
  },
  {
    name: "Premier",
    description: "Enhanced features and priority support",
    features: ["Priority support", "Extended functionality", "Travel perks"],
  },
  {
    name: "Private",
    description: "VIP experience with personalized service",
    features: ["24/7 dedicated concierge", "VIP travel benefits", "Exclusive offers"],
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState("");

  const handleContinue = async () => {
    if (!selectedTier) {
      toast({
        title: "Please select a membership tier",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("user_preferences")
        .update({ membership_tier: selectedTier })
        .eq("id", user.id);

      if (error) throw error;

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error saving preferences",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-isabelline p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-canela text-cafe">Choose Your Experience</h1>
          <p className="mt-4 text-walnut">Select a membership tier to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {membershipTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`p-6 cursor-pointer transition-all ${
                selectedTier === tier.name
                  ? "border-amber ring-2 ring-amber"
                  : "hover:border-amber"
              }`}
              onClick={() => setSelectedTier(tier.name)}
            >
              <h3 className="text-xl font-canela text-cafe">{tier.name}</h3>
              <p className="text-sm text-walnut mt-2">{tier.description}</p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="text-sm text-walnut flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            className="bg-amber hover:bg-amber/90 text-cafe"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;