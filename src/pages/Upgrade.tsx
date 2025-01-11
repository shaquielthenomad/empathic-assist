import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UpgradePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [membershipTiers, setMembershipTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembershipTiers = async () => {
      try {
        const { data, error } = await supabase
          .from("membership_tiers")
          .select("*");

        if (error) throw error;

        setMembershipTiers(data);
      } catch (error) {
        console.error("Error fetching membership tiers:", error);
        toast({
          title: "Error",
          description: "Failed to load membership tiers. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipTiers();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-isabelline flex items-center justify-center">
        <p className="text-cafe">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-isabelline">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-6">
          <h1 className="text-4xl md:text-5xl text-cafe">Upgrade Your Membership</h1>
          <p className="text-walnut mt-2">Choose a tier that best suits your needs</p>
        </div>
      </header>

      <main className="container mx-auto py-12 space-y-12">
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl text-cafe">Membership Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {membershipTiers.map((tier) => (
              <Card key={tier.id}>
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{tier.benefits}</p>
                  <Button 
                    className="mt-4 bg-amber hover:bg-amber/90 text-cafe"
                    onClick={() => navigate(`/upgrade/${tier.id}`)}
                  >
                    Select {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-cafe text-white py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl mb-4">Location</h4>
              <p>London, United Kingdom</p>
            </div>
            <div>
              <h4 className="text-xl mb-4">Industry</h4>
              <p>Luxury Services</p>
            </div>
            <div>
              <h4 className="text-xl mb-4">Contact</h4>
              <p>contact@heypartner.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UpgradePage;
