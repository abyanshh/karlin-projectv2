"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus, Search } from "lucide-react";
import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";

const AppHeader = () => {
  const { user } = useSession();
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
      <div className="flex items-center space-x-4">
        {(user?.role === "admin" || user?.role === "pm") && (
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/dashboard/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              Proyek Baru
            </Link>
          </Button>
        )}
        <ModeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
