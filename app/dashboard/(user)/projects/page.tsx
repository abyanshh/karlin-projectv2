'use client';
import ProjectList from "@/components/project/ProjectList";
import SearchFragment from "@/components/project/search-bar";
import ProjectListSkeleton from "@/components/project/ProjectListSkeleton";
import { useProjects } from "@/hooks/useProjects";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Plus, QrCode } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const user = useUser();
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <ProjectListSkeleton />
    );
  }
  
  if (!projects || projects.length === 0) {
    return (
      <div className="p-6 text-center bg-card w-full rounded-md py-10">
        <p className="text-muted-foreground text-sm">
          Belum ada proyek yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchFragment />
        {(user?.role === "admin" || user?.role === "sales") && (
          <div className="flex gap-2">
            <Link href="/dashboard/projects/qr-template">
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                Buat QR Template
              </Button>
            </Link>
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <Plus className="h-4 w-4 mr-2" />
                Buat Proyek Baru
              </Link>
            </Button>
          </div>
        )}
      </div>
      <ProjectList data={projects} user={user} />
    </div>
  );
};

export default Page;

