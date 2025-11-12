"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layout/app-sidebar";
import AppHeader from "@/layout/app-header";
import HeaderSection from "@/components/dashboard/header-app";
import { refreshAccessToken } from "@/lib/auth";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { id, task } = useParams();

  const [isLoading, setIsLoading] = useState(true);

  const hideHeader =
    pathname.startsWith("/dashboard/profile") ||
    pathname.startsWith(`/dashboard/projects/${id}/edit`) ||
    pathname.startsWith(`/dashboard/projects/new`) ||
    pathname.startsWith(`/dashboard/projects/${id}/${task}/edit`);

  const mainContainerClass = hideHeader
    ? "p-6"
    : "absolute inset-x-0 top-30 px-6";

  useEffect(() => {
    const initSession = async () => {
      try {
        let token = sessionStorage.getItem("accessToken");

        if (!token) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            token = newToken;
            sessionStorage.setItem("accessToken", token);
          } else {
            router.push("/login");
            return;
          }
        }

        let user = sessionStorage.getItem("user");
        if (!user) {
          const response = await api.get("/profile/me");
          user = response.data.profile;
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize session:", error);
        router.push("/login");
      }
    };

    initSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <div className="bg-card p-4 rounded-xl">
          <Spinner className="w-5 h-5" />
        </div>
        <p className="text-muted-foreground">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">
        <AppHeader />
        <div className="relative">
          {!hideHeader && <HeaderSection />}
          <div className={mainContainerClass}>
            <main className="min-h-screen mb-4">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
