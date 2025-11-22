"use client";

import { useState, DragEvent, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, Trash2, Edit, ExternalLink, CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTaskDetail } from "@/hooks/useTaskDetail";
import api from "@/lib/axios";
import { useUser } from "@/hooks/useUser";
import {
  InputTaskSkeleton,
  TaskHeaderSkeleton,
} from "@/components/task/TaskSkeleton";

interface TaskFile {
  filename: string;
  url: string;
}

const Page = ({
  params,
}: {
  params: Promise<{ id: string; task: string }>;
}) => {
  const router = useRouter();
  const user = useUser();
  const { id, task } = use(params);
  
  const { data, loading, refetch } = useTaskDetail(id, task);
  
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return "";
    if (status === "completed") return "Selesai";
    if (status === "in_progress") return "Berlangsung";
    if (status === "waiting_for_verification") return "Menunggu Verifikasi";
    return status;
  };

  // ==== DRAG & DROP HANDLERS ====
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const newFiles = Array.from(e.dataTransfer.files);
    if (newFiles.length > 0) {
      await uploadFiles(newFiles);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (newFiles.length > 0) {
      await uploadFiles(newFiles);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  // ==== FUNGSI UPLOAD ====
  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file); 

        // Endpoint POST backend: /:taskId/upload
        await api.post(`/project/${id}/tasks/${task}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await refetch(); // Refresh data
    } catch (error: any) {
      console.error("Gagal mengunggah file:", error);
      alert(error.response?.data?.message || "Gagal mengunggah file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMarkAsDone = async () => {

    setIsUpdatingStatus(true);
    try {
      await api.put(`/project/${id}/tasks/${task}`, {
        status: "completed", 
      });
      
      router.push(`/dashboard/projects/${id}`); 
      router.refresh(); 
    } catch (error) {
      console.error("Gagal update status:", error);
      alert("Gagal mengubah status tugas.");
      setIsUpdatingStatus(false);
    } 
  };

  // ==== FUNGSI HAPUS FILE (UPDATED) ====
  const handleRemoveFile = async (filename: string) => {
    
    try {
      await api.delete(`project/${id}/tasks/${task}/upload`, {
      });

     
      
      await refetch();
    } catch (error) {
      console.error("Gagal menghapus file:", error);
      alert("Gagal menghapus file.");
    }
  };

  // Helper untuk memproses list file dari backend
  const fileList: TaskFile[] = (() => {
    if (!data) return [];
    
    // Jika backend mengirim 'file_url' (single string)
    if (data.file_url) {
        const url = data.file_url;
        // Extract filename dari URL Supabase
        // URL biasanya: .../file_upload/projects/taskId/timestamp.jpg
        const filename = url.split('/').pop() || "file";
        return [{ filename, url }];
    }

    // Fallback jika backend support array di masa depan
    if (Array.isArray(data.file_url)) {
        return data.file_url.map((f: any) => {
            if (typeof f === 'string') {
                return { filename: f.split('/').pop() || "file", url: f };
            }
            return f;
        });
    }

    return [];
  })();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ====== HEADER TASK ====== */}
      {loading ? (
        <TaskHeaderSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex justify-between items-center">
              <div>{data?.nama}</div>
              
              <Button asChild variant="ghost" size="sm">
                <Link href={`/dashboard/projects/${id}/${task}/edit`}>
                  <Edit className="w-4 h-4" />
                </Link>
              </Button>
             
            </CardTitle>

            <div className="flex gap-4 items-center">
              <Badge
                variant={
                  data?.status === "in_progress"
                    ? "progress"
                    : data?.status === "completed"
                    ? "secondary"
                    : "destructive"
                }
                className={data?.status === "completed" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
              >
                {getStatusLabel(data?.status)}
              </Badge>
            </div>

            <p className="text-muted-foreground text-m mt-2">
              {data?.deskripsi || "Tidak ada deskripsi."}
            </p>
          </CardHeader>
        </Card>
      )}

      {/* ====== UPLOAD AREA & FILE LIST ====== */}
      {loading ? (
        <InputTaskSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Hasil Kerja & File
            </CardTitle>
          </CardHeader>
          <CardContent>
            
            {user?.role === "staff" && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition mb-6 ${
                  dragActive
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/30"
                } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
              >
                {isUploading ? (
                    <Loader2 className="w-10 h-10 mb-2 text-primary animate-spin" />
                ) : (
                    <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
                )}
                
                <p className="text-muted-foreground mb-2 text-sm">
                  {isUploading ? "Mengunggah ke server..." : "Tarik & letakkan file di sini, atau klik untuk memilih"}
                </p>
                
                <Input
                  type="file"
                  multiple={false}
                  className="hidden"
                  id="fileUpload"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("fileUpload")?.click()}
                  disabled={isUploading}
                >
                  Pilih File
                </Button>
              </div>
            )}

            <div className="space-y-2 mb-6">
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                    File Terlampir
                </h3>
                
                {fileList.length > 0 ? (
                  fileList.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border rounded-md p-3 bg-card hover:bg-accent/10 transition"
                    >
                      <Link 
                        href={file.url} 
                        target="_blank" 
                        className="flex items-center gap-3 flex-1 overflow-hidden"
                      >
                        <div className="bg-primary/10 p-2 rounded">
                            <File className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm truncate hover:underline underline-offset-4">
                            {file.filename}
                        </span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground opacity-50" />
                      </Link>

                      {(user?.role === "staff" || user?.role === "admin") && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 ml-2"
                          onClick={() => handleRemoveFile(file.filename)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic border rounded-md p-4 text-center bg-muted/20">
                    Belum ada file yang diunggah.
                  </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                {user?.role === "pm" && (
                    <Button 
                        onClick={handleMarkAsDone}
                        disabled={isUpdatingStatus || data?.status === "completed"}
                        className={data?.status === "completed" ? "bg-green-600 hover:bg-green-700 cursor-default" : ""}
                    >
                        {isUpdatingStatus ? (
                            "Menyimpan..." 
                        ) : data?.status === "completed" ? (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" /> Selesai
                            </>
                        ) : (
                            "Mark as Done"
                        )}
                    </Button>
                )}
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;