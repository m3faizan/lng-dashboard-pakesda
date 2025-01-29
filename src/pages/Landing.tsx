import { Hero } from "@/components/blocks/hero";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Landing() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGetStarted = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue.",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Hero
        title="LNG"
        subtitle="Explore real-time LNG market insights and analytics"
        actions={[
          {
            label: "Get Started",
            href: "#",
            variant: "default",
            onClick: handleGetStarted,
          },
        ]}
      />
    </div>
  );
}