
import { Hero } from "@/components/blocks/hero";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Linkedin, X } from "lucide-react";

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
    <div className="min-h-screen flex flex-col">
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
      
      <footer className="mt-auto pt-8 pb-4 text-center">
        <div className="flex justify-center space-x-4 mb-3">
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#1A1E2D] p-2 rounded-full hover:bg-[#252936] transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a 
            href="https://x.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#1A1E2D] p-2 rounded-full hover:bg-[#252936] transition-colors"
          >
            <X size={20} />
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2025 PakESDA. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
