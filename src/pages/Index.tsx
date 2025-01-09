import { Hotel, Plane, Car, Calendar, Coffee } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  const services = [
    {
      icon: Hotel,
      title: "Book a Hotel",
      description: "Find and book luxury accommodations worldwide",
    },
    {
      icon: Plane,
      title: "Flight Booking",
      description: "Premium flight reservations and travel arrangements",
    },
    {
      icon: Coffee,
      title: "Restaurant Reservations",
      description: "Access to exclusive dining experiences",
    },
    {
      icon: Car,
      title: "Transportation",
      description: "Luxury vehicle rentals and chauffeur services",
    },
    {
      icon: Calendar,
      title: "Event Planning",
      description: "Curated experiences and event organization",
    },
  ];

  return (
    <div className="min-h-screen bg-isabelline">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-6">
          <h1 className="text-4xl md:text-5xl text-cafe">Hey Partner</h1>
          <p className="text-walnut mt-2">Human Powered, AI Supported</p>
        </div>
      </header>

      <main className="container mx-auto py-12 space-y-12">
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl text-cafe">How May We Assist You Today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuoteCard 
            quote="Nothing is impossible. The word itself says 'I'm possible!'"
            author="Audrey Hepburn"
          />
          <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-2xl text-cafe">Join 521,280 others</h3>
            <p className="text-walnut">Cultivating a life of gratitude and mindfulness</p>
            <Button className="w-full bg-amber hover:bg-amber/90 text-cafe">
              Become a Member
            </Button>
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