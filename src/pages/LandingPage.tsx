import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LandingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*");

        if (error) throw error;

        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        toast({
          title: "Error",
          description: "Failed to load testimonials. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
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
          <h1 className="text-4xl md:text-5xl text-cafe">Welcome to Hey Partner</h1>
          <p className="text-walnut mt-2">Your personal planner and concierge service</p>
        </div>
      </header>

      <main className="container mx-auto py-12 space-y-12">
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl text-cafe">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Create, prioritize, and track tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Manage your personal and professional tasks efficiently.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Event Integration</CardTitle>
                <CardDescription>Sync with your favorite calendars</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Integrate with Google Calendar, Apple Calendar, or Outlook.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Concierge Services</CardTitle>
                <CardDescription>Request and track concierge services</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Submit requests for travel bookings, reservations, and more.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl text-cafe">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader>
                  <CardTitle>{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{testimonial.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl text-cafe">Get Started</h2>
          <p className="text-walnut">Join us today and experience the best personal planning and concierge services.</p>
          <Button 
            className="bg-amber hover:bg-amber/90 text-cafe"
            onClick={() => navigate("/auth")}
          >
            Sign Up Now
          </Button>
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

export default LandingPage;
