"use client";

import { useParams, usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layout/app-sidebar";
import AppHeader from "@/layout/app-header";
import HeaderSection from "@/components/dashboard/header-app"; 
import { useSession } from "@/context/SessionContext";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { id, task } = useParams();
  const user = useSession();
  const hideHeader = 
  pathname.startsWith("/dashboard/profile") || 
  pathname.startsWith(`/dashboard/projects/${id}/edit`)||
  pathname.startsWith(`/dashboard/projects/new`)||
  pathname.startsWith(`/dashboard/projects/${id}/${task}/edit`);

  const mainContainerClass = hideHeader
    ? "p-6"
    : "absolute inset-x-0 top-30 px-6";

  const getHeaderContent = (path: string) => {
    if (path === "/dashboard") {
      return {
        title: `Halo, ${user.name}`,
        subtitle: "Selamat datang di Karlin Mastrindo Project Manager.",
      };
    } else if (path === "/dashboard/projects") {
      return {
        title: "Proyek Anda",
        subtitle: "Lihat semua projek yang Anda miliki.",
      };
    } else if (path.startsWith("/dashboard/team")) {
      return {
        title: "Tim Anda",
        subtitle: "Lihat anggota tim Anda.",
      };
    } else if (path.startsWith("/dashboard/calendar")) {
      return {
        title: "Kalender",
        subtitle: "Lihat agenda tim Anda.",
      };
    } else if (path.startsWith("/dashboard/projects/")) {
      return {
        title: "Detail Proyek",
        subtitle: "Lihat detail proyek Anda.",
      };
    } else {
      return { title: "", subtitle: "" };
    }
  };

  const headerContent = getHeaderContent(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">
        <AppHeader />
        <div className="relative">
          {!hideHeader && (
            <HeaderSection
              title={headerContent.title}
              subtitle={headerContent.subtitle}
            />
          )}
          <div className={mainContainerClass}>
            <main className="min-h-screen mb-4">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
