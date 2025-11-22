"use client";

import { useState, use } from "react"; // Tambah useState
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Tambah useRouter
import { useUser } from "@/hooks/useUser";
import { User, Clock, Handshake, SquarePen, CheckCircle, Loader2, Hand } from "lucide-react"; // Tambah Icon
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { useProjectTasks } from "@/hooks/useProjectTasks";
import api from "@/lib/axios"; // Pastikan import axios instance ada

import { TaskList } from "./TaskList";
import { TeamList } from "./TeamList";
import { ProfileMember } from "@/type/ProjectList/project";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = useUser();
  const { project, loading: loadingProject, refetch: refetchProject } = useProjectDetail(id);
  const { tasks, loading: loadingTasks, refetch: refetchTasks } = useProjectTasks(id);
  const [isClaiming, setIsClaiming] = useState(false);
  
  const [isUpdating, setIsUpdating] = useState(false); // State loading tombol

  const loading = loadingProject || loadingTasks;

  // === FUNGSI UPDATE STATUS PROJECT ===
  const handleMarkProjectDone = async () => {

    setIsUpdating(true);
    try {
      await api.put(`/project/${id}`, {
        status: "done",
      });
      
    await refetchProject();
      router.refresh();
    } catch (error) {
      console.error("Gagal update status project:", error);
      alert("Gagal menyelesaikan proyek.");
    } finally {
      setIsUpdating(false);
    }
  };

  // === FUNGSI AMBIL PROYEK ===
  const handleClaimProject = async () => {

    setIsClaiming(true);
    try {
      // Panggil endpoint yang baru kita buat
      await api.put(`/project/${id}/accept`);
      
      await refetchProject();
      router.refresh();
      
    } catch (error: any) {
      console.error("Gagal claim project:", error);
      alert(error.response?.data?.error || "Gagal mengambil proyek.");
    } finally {
      setIsClaiming(false);
    }
  };

  if (loading) return <Card className="text-muted-foreground text-center p-10">Loading...</Card>;
  if (!project) return <Card className="p-10 text-center">Projek tidak Tersedia</Card>;

  // Logic Permission: Tombol muncul jika user adalah ADMIN atau PIC dari project ini
  const canMarkAsDone = (user?.role === "admin" || user?.id === project.ID_pic) && project.status !== "done";

  return (
    <Card>
      {/* ==== HEADER ==== */}
      <CardHeader>
        <div className="relative mt-2">
          <div className="dark:hidden bg-gradient-to-r from-orange-500/70 to-amber-400/50 h-50 md:h-100 rounded-xl mask-b-from-0"></div>
          <div className="dark:block hidden bg-gradient-to-r from-slate-900/80 to-blue-600/50 h-50 md:h-40 rounded-xl mask-b-from-0"></div>
          <div className="absolute inset-0 bg-black/20 rounded-t-xl mask-b-from-0"></div>
          
          <div className="absolute space-y-2 w-full bottom-0 p-6 md:block hidden">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-4">
                <CardTitle className="text-xl md:text-3xl text-white drop-shadow-md">
                  {project?.po}
                </CardTitle>
                {/* Badge Status jika Done */}
                {project?.status === "done" && (
                  <span className="bg-green-500/90 text-white text-xs px-3 py-1 rounded-full font-bold border border-white/20 backdrop-blur-sm flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> DONE
                  </span>
                )}
              </div>
            
              {/* GROUP BUTTONS (DESKTOP) */}
              <div className="flex gap-2">
                {/* 1. Tombol Assign/Edit (Logic Lama) */}
                {(user?.role === "admin" || user?.role === "sales") && project?.ID_pic == null && (
                  <Link href={`/dashboard/projects/${project?.id}/edit`}>
                    <Button className="cursor-pointer bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md">
                      <SquarePen className="mr-2 w-4 h-4" />
                      Edit Proyek
                    </Button>
                  </Link>
                )}

               {/* === TOMBOL AMBIL PROYEK (PM ONLY) === */}
                {user?.role === "pm" && project?.ID_pic == null && (
                  <Button 
                    onClick={handleClaimProject}
                    disabled={isClaiming}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border-0 backdrop-blur-md shadow-md"
                  >
                    {isClaiming ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Memproses...
                        </>
                    ) : (
                        <>
                          <Hand className="mr-2 w-4 h-4" /> Ambil Proyek
                        </>
                    )}
                  </Button>
                )}

                {/* 2. Tombol Mark Project as Done (BARU) */}
                {canMarkAsDone && (
                    <Button 
                        onClick={handleMarkProjectDone}
                        disabled={isUpdating}
                        className="bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all"
                    >
                        {isUpdating ? (
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="mr-2 w-4 h-4" />
                        )}
                        Mark as Done
                    </Button>
                )}
              </div>
            </div>

            {/* INFO DETAILS */}
            <div className="flex gap-6 text-white/90 mt-2 font-medium text-sm drop-shadow-sm">
              <span className="flex gap-2 items-center">
                <User className="h-4 w-4" />
                <span>PIC : </span>
                <h2>{project?.PIC?.user_nama || "-"}</h2>
              </span>
              <span className="flex gap-2 items-center">
                <Handshake className="h-4 w-4" />
                <span>Client : </span>
                <h2>{project?.client}</h2>
              </span>
              <span className="flex gap-2 items-center">
                <Clock className="h-4 w-4" />
                {project?.deadline}
              </span>
              <span className="flex gap-2 items-center">
                <User className="h-4 w-4" />
                <span>Sales : </span>
                <h2>{project?.Sales?.user_nama || "-"}</h2>
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* ==== HEADER (Mobile) ==== */}
      <CardContent>
        <div className="space-y-4 w-full md:hidden block mt-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
                <CardTitle className="text-xl capitalized">
                {project?.po}
                </CardTitle>
                {project?.status === "done" && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> DONE
                    </span>
                )}
            </div>
            
            <div className="flex gap-2">
                {/* Tombol Edit Mobile */}
                <Button asChild size="icon" variant="outline">
                    <Link href={`/dashboard/projects/${project?.id}/edit`}>
                        <SquarePen className="w-4 h-4" />
                    </Link>
                </Button>
            </div>
          </div>

          {/* Tombol Mark Done Mobile */}
          {canMarkAsDone && (
             <Button 
                onClick={handleMarkProjectDone}
                disabled={isUpdating}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
            >
                {isUpdating ? "Saving..." : "Mark Project as Done"}
            </Button>
          )}

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="flex gap-2 items-center justify-between border-b pb-2">
                <span className="flex gap-2 items-center"><User className="h-4 w-4" /> PIC</span>
                <span className="font-medium">{project?.PIC?.user_nama || "-"}</span>
            </span>
            <span className="flex gap-2 items-center justify-between border-b pb-2">
                <span className="flex gap-2 items-center"><Handshake className="h-4 w-4" /> Client</span>
                <span className="font-medium">{project?.client}</span>
            </span>
            <span className="flex gap-2 items-center justify-between border-b pb-2">
                <span className="flex gap-2 items-center"><Clock className="h-4 w-4" /> Deadline</span>
                <span className="font-medium">{project?.deadline}</span>
            </span>
          </div>
        </div>
      </CardContent>

      {/* ==== TASK LIST ==== */}
      <CardContent>
        <TaskList
          initialTasks={tasks}
          projectId={project?.id}
          onTaskCreated={refetchTasks}
        />
      </CardContent>

      {/* ==== TEAM LIST ==== */}
      <CardContent>
        <TeamList
          initialMembers={Object.values(project.team ?? {}).filter(
            (m): m is ProfileMember => m !== null
          )}
          projectId={project?.id}
          ID_pic={project.ID_pic} // Sesuaikan dengan nama prop di TeamList.tsx (picId atau ID_pic)
        />
      </CardContent>
    </Card>
  );
}