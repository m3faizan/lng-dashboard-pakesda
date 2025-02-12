
import { Hero } from "@/components/blocks/hero";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Linkedin, X, Globe, Mail } from "lucide-react";

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

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "mailto:pakenergydata@gmail.com";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F1117] w-full absolute inset-0">
      <div className="container max-w-5xl mx-auto px-4">
        <Hero
          title="LNG"
          subtitle="Explore Pakistan's LNG market insights and analytics"
          actions={[
            {
              label: "Get Started",
              href: "#",
              variant: "default",
              onClick: handleGetStarted,
            },
          ]}
        >
          <footer className="mt-auto pt-8 pb-4 text-center">
            <div className="flex justify-center space-x-4 mb-3">
              <a 
                href="https://www.linkedin.com/company/pakesda/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#1A1E2D] p-2 rounded-full hover:bg-[#252936] transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://x.com/pakesda" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#1A1E2D] p-2 rounded-full hover:bg-[#252936] transition-colors"
              >
                <X size={20} />
              </a>
              <a 
                href="https://pakistanenergydata.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#1A1E2D] p-2 rounded-full hover:bg-[#252936] transition-colors"
              >
                <Globe size={20} />
              </a>
              <a 
                href="#"
                onClick={handleEmailClick}
                className="bg-[#1A1E2D] p-2 rounded-full hover:bg-[#252936] transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 PakESDA. All rights reserved.
            </p>
          </footer>
        </Hero>
      </div>
    </div>
  );
}
