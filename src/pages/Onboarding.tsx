import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

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

const onboardingSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  preferences: z.object({
    theme: z.string().optional(),
    notifications_enabled: z.boolean().optional(),
  }).optional(),
});

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState("Partner");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      preferences: {
        theme: "light",
        notifications_enabled: true,
      },
    },
  });

  const handleContinue = async (values: z.infer<typeof onboardingSchema>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please verify your email before continuing.",
          variant: "destructive",
        });
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          full_name: values.full_name,
          email: values.email,
          phone: values.phone,
          address: values.address,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .update({ 
          membership_tier: selectedTier,
          theme: values.preferences?.theme,
          notifications_enabled: values.preferences?.notifications_enabled,
        })
        .eq("id", user.id);

      if (preferencesError) throw preferencesError;

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
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-isabelline flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-semibold text-cafe">Complete Your Profile</h1>
          <p className="text-walnut">Fill in your details to get started</p>
        </div>

        <Progress value={(step / 3) * 100} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-6">
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <FormControl>
                            <Input {...field} placeholder="Enter your full name" />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent>
                          Please enter your full legal name.
                        </TooltipContent>
                      </Tooltip>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <FormControl>
                            <Input {...field} placeholder="Enter your email" />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent>
                          We'll use this email to contact you.
                        </TooltipContent>
                      </Tooltip>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <FormControl>
                            <Input {...field} placeholder="Enter your phone number" />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent>
                          Optional: Provide a phone number for urgent contact.
                        </TooltipContent>
                      </Tooltip>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <FormControl>
                            <Input {...field} placeholder="Enter your address" />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent>
                          Optional: Provide your address for personalized services.
                        </TooltipContent>
                      </Tooltip>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="preferences.theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme</FormLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <FormControl>
                            <Input {...field} placeholder="Enter your preferred theme" />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent>
                          Choose between light or dark theme.
                        </TooltipContent>
                      </Tooltip>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferences.notifications_enabled"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enable Notifications</FormLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <FormControl>
                            <Input type="checkbox" {...field} />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent>
                          Enable to receive important updates and reminders.
                        </TooltipContent>
                      </Tooltip>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 3 && (
              <>
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
              </>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  variant="default"
                  onClick={nextStep}
                  disabled={isLoading}
                >
                  Next
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-amber hover:bg-amber/90 text-cafe"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Continue to Dashboard"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Onboarding;
