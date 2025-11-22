"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Home,
  FolderOpen,
  Users,
  Clock,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Proyek",
    url: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Staff",
    url: "/dashboard/team",
    icon: Users,
    showIf: (user: { role: string }) => user?.role === "admin",
  },
  {
    title: "Projek Selesai",
    url: "/dashboard/history",
    icon: Clock,
    showIf: (user: { role: string }) => user?.role === "admin",
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const location = usePathname();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const handleLogout = () => {
    router.push("/");
  };
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader>
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Image
                src="/karlin-logo.png"
                alt="Karlin Mastrindo Logo"
                width={50}
                height={50}
                className="rounded-md"
              />
            </div>
            <div>
              <h2 className="font-semibold">Karlin Mastrindo</h2>
              <p className="text-sm text-muted-foreground">
                Project Management
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 p-2">
              {menuItems
                .filter((item) => {
                  if (item.showIf) return item.showIf(user);
                  return true;
                })
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url}>
                      <Link
                        href={item.url}
                        className="flex items-center space-x-3"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="mx-auto" />
      <SidebarFooter>
        <div className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 h-12"
              >
                <Avatar className="h-8 w-8">
                  {user?.image_url ? (
                    <AvatarImage
                      src={user?.image_url}
                      className="rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user?.usernama
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-left">
                  <p className="font-medium text-sm">{user?.user_nama}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.jabatan}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
