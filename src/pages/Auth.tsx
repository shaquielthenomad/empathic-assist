import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const Auth = () => {
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  return (
    <div className="min-h-screen bg-isabelline flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-cafe">Welcome to Hey Partner</h1>
          <p className="text-walnut">Sign in to continue to your account</p>
        </div>

        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#967259',
                  brandAccent: '#7d5e49',
                },
              },
            },
          }}
          providers={["google"]}
          redirectTo={`${window.location.origin}/onboarding`}
        />
      </div>
    </div>
  );
};

export default Auth;