import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import { ImagePlus, X } from "lucide-react";
import { useState } from "react";

interface AppSidebarProps {
  onLogout?: () => void;
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleItemClick = (item: any) => {
    if (item.isLogout && onLogout) {
      onLogout();
    } else if (item.isProfile) {
      setIsProfileOpen(true);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.isProfile ? (
                    <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                      <DialogTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <ProfileForm />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <SidebarMenuButton
                      asChild={!item.isLogout}
                      onClick={() => handleItemClick(item)}
                    >
                      {item.isLogout ? (
                        <button className="flex w-full items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </button>
                      ) : (
                        <a href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      )}
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function ProfileForm() {
  const maxLength = 180;
  const { value, characterCount, handleChange } = useCharacterLimit({
    maxLength,
    initialValue: "Hey, I am a web developer who loves turning ideas into amazing websites!",
  });

  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } = useImageUpload();

  return (
    <form className="space-y-4">
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value="mfahadfaizan@gmail.com"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter your username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={value}
            onChange={handleChange}
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
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
}