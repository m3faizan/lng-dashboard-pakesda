import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarItems } from "@/pages/Index";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/components/hooks/use-character-limit";
import { useImageUpload } from "@/components/hooks/use-image-upload";
import { ImagePlus, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  onLogout?: () => void;
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  const handleItemClick = (item: any) => {
    if (item.isLogout && onLogout) {
      onLogout();
    } else if (item.isProfile) {
      setIsProfileOpen(true);
    }
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const NavigationContent = () => (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.title} className="group">
                {item.isProfile ? (
                  <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                    <DialogTrigger asChild>
                      <SidebarMenuButton className="transition-all duration-200 hover:bg-dashboard-navy/50 group-hover:translate-x-1">
                        <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        <span className="transition-all duration-200 group-hover:font-medium">{item.title}</span>
                      </SidebarMenuButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <ProfileForm onClose={() => setIsProfileOpen(false)} />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <SidebarMenuButton
                    asChild={!item.isLogout}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "transition-all duration-200 hover:bg-dashboard-navy/50 group-hover:translate-x-1",
                      location.pathname === item.url && "bg-dashboard-navy/50 font-medium"
                    )}
                  >
                    {item.isLogout ? (
                      <button className="flex w-full items-center gap-2">
                        <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        <span className="transition-all duration-200 group-hover:font-medium">{item.title}</span>
                      </button>
                    ) : (
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        <span className="transition-all duration-200 group-hover:font-medium">{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );

  return (
    <>
      {isMobile ? (
        <div className="fixed top-4 left-4 z-50">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                <NavigationContent />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      ) : (
        <Sidebar>
          <NavigationContent />
        </Sidebar>
      )}
    </>
  );
}

interface ProfileFormProps {
  onClose: () => void;
}

function ProfileForm({ onClose }: ProfileFormProps) {
  const maxLength = 180;
  const { value: bio, characterCount, handleChange: handleBioChange } = useCharacterLimit({
    maxLength,
    initialValue: "",
  });
  const { toast } = useToast();
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } = useImageUpload();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    company: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setProfileData({
            full_name: profile.full_name || "",
            email: user.email || "",
            phone_number: profile.phone_number || "",
            location: profile.location || "",
            company: profile.company || "",
          });
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
      }
    }

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone_number: profileData.phone_number,
          location: profileData.location,
          company: profileData.company,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="relative h-24 w-24">
            <div className="h-full w-full overflow-hidden rounded-full border-2 border-border">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleThumbnailClick}
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-sm"
            >
              <ImagePlus className="h-4 w-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={profileData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profileData.email}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={profileData.phone_number}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={profileData.location}
            onChange={handleChange}
            placeholder="Enter your location"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={profileData.company}
            onChange={handleChange}
            placeholder="Enter your company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={handleBioChange}
            maxLength={maxLength}
            placeholder="Tell us about yourself"
            className="resize-none"
          />
          <p className="text-right text-sm text-muted-foreground">
            {characterCount}/{maxLength} characters
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
