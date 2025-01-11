import { useEffect, useState } from "react";
import { Hotel, Plane, Car, Calendar, Coffee, AlertTriangle } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  full_name: string | null;
  avatar_url: string | null;
}

interface UserPreferences {
  membership_tier: string | null;
  theme: string | null;
  notifications_enabled: boolean | null;
}

interface VisaDocument {
  id: string;
  country: string;
  expiry_date: string;
  document_type: string;
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [expiringVisas, setExpiringVisas] = useState<VisaDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const services = [
    {
      icon: Hotel,
      title: "Book a Hotel",
      description: "Find and book luxury accommodations worldwide",
      path: "/hotel-request"
    },
    {
      icon: Plane,
      title: "Flight Booking",
      description: "Premium flight reservations and travel arrangements",
      path: "/flight-request"
    },
    {
      icon: Coffee,
      title: "Restaurant Reservations",
      description: "Access to exclusive dining experiences",
      path: "/dining-request"
    },
    {
      icon: Car,
      title: "Transportation",
      description: "Luxury vehicle rentals and chauffeur services",
      path: "/transport-request"
    },
    {
      icon: Calendar,
      title: "Event Planning",
      description: "Curated experiences and event organization",
      path: "/event-request"
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error("No user found");

        const [profileResult, preferencesResult, visasResult] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("user_preferences").select("*").eq("id", user.id).single(),
          supabase.from("visa_documents")
            .select("*")
            .eq("user_id", user.id)
            .gte("expiry_date", new Date().toISOString().split('T')[0])
            .lte("expiry_date", new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
            .order("expiry_date")
        ]);

        if (profileResult.error) throw profileResult.error;
        if (preferencesResult.error) throw preferencesResult.error;
        if (visasResult.error) throw visasResult.error;

        setProfile(profileResult.data);
        setPreferences(preferencesResult.data);
        setExpiringVisas(visasResult.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
          <h1 className="text-4xl md:text-5xl text-cafe">
            Welcome, {profile?.full_name || "Partner"}
          </h1>
          <p className="text-walnut mt-2">
            {preferences?.membership_tier || "Partner"} Member
          </p>
        </div>
      </header>

      <main className="container mx-auto py-12 space-y-12">
        {expiringVisas.length > 0 && (
          <section className="bg-amber/20 p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-amber w-6 h-6 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-cafe mb-2">Visa Alerts</h3>
                <ul className="space-y-2">
                  {expiringVisas.map((visa) => (
                    <li key={visa.id} className="text-walnut">
                      Your {visa.document_type} for {visa.country} expires on{" "}
                      {new Date(visa.expiry_date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl text-cafe">How May We Assist You Today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard 
                key={service.title} 
                {...service} 
                onClick={() => {
                  navigate(service.path);
                }}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuoteCard 
            quote="Nothing is impossible. The word itself says 'I'm possible!'"
            author="Audrey Hepburn"
          />
          <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-2xl text-cafe">Your Membership Benefits</h3>
            <p className="text-walnut">
              {preferences?.membership_tier === "Premium" 
                ? "Enjoy exclusive access to premium services and VIP support."
                : "Upgrade to Premium for exclusive benefits and VIP support."}
            </p>
            {preferences?.membership_tier !== "Premium" && (
              <Button 
                className="w-full bg-amber hover:bg-amber/90 text-cafe"
                onClick={() => {
                  navigate("/upgrade");
                }}
              >
                Upgrade to Premium
              </Button>
            )}
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

export default Index;