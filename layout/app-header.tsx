
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus, Search } from "lucide-react";
import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";

const AppHeader = () => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari proyek..." className="pl-10 w-64" />
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
        <Link href="/dashboard/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Proyek Baru
        </Link>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
