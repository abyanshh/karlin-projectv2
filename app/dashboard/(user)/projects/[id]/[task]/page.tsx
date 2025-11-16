"use client";

import { useState, DragEvent, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, Trash2, Edit, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTaskDetail } from "@/hooks/useTaskDetail";
import api from "@/lib/axios";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import {
  InputTaskSkeleton,
  TaskHeaderSkeleton,
} from "@/components/task/TaskSkeleton";

const Page = ({
  params,
}: {
  params: Promise<{ id: string; task: string }>;
}) => {
  const user = useUser();
  const { id, task } = use(params);
  const { data, loading, refetch } = useTaskDetail(id, task);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // ==== DRAG & DROP HANDLER ====
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const newFiles = Array.from(e.dataTransfer.files);
    if (newFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      uploadFiles(newFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (newFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      uploadFiles(newFiles);
    }

    if (e.target) {
      e.target.value = "";
    }
  };

  const handleVerify = async () => {
    try {
      await api.put(`/project/${id}/tasks/${task}/verify`, {
        verified: true,
      });

      await refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      await api.post(`/project/${id}/tasks/${task}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refetch();
    } catch (error) {
      console.error("Gagal mengunggah file:", error);
    }
  };
  const handleRemoveFile = (index: number) => {
    try {
      api.delete(
        `/project/${id}/tasks/${task}/files/${uploadedFiles[index].name}`
      );
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Gagal menghapus file:", error);
    }
  };

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
              <Button asChild>
                <Link href={`/dashboard/projects/${id}/${task}/edit`}>
                  <Edit className="w-4 h-4" />
                </Link>
              </Button>
            </CardTitle>

            <div className="flex gap-4">
              <Badge
                variant={
                  data?.status === "berlangsung"
                    ? "progress"
                    : data?.status === "completed"
                    ? "success"
                    : "failed"
                }
              >
                {data?.status}
              </Badge>
            </div>

            <p className="text-muted-foreground text-sm mt-2">
              {data?.deskripsi}
            </p>
          </CardHeader>
        </Card>
      )}

      {/* ====== UPLOAD AREA ====== */}
      {loading ? (
        <InputTaskSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Upload Hasil Kerja
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user?.role == "staff" && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition ${
                  dragActive
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/30"
                }`}
              >
                <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">
                  Tarik & letakkan file di sini, atau klik untuk memilih
                </p>
                <Input
                  type="file"
                  multiple
                  className="hidden"
                  id="fileUpload"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("fileUpload")?.click()}
                >
                  Pilih File
                </Button>
              </div>
            )}

            {/* ====== FILE LIST ====== */}
            {uploadedFiles.length > 0 ? (
              <div className="mt-6 space-y-2">
                <h3 className="font-medium mb-2">File yang telah diupload:</h3>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-md p-3 bg-muted/40"
                  >
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ):(
              <div className="mt-6 text-muted-foreground">Belum ada file yang diupload</div>
            )}
            {(user?.role === "admin" || user?.role === "sales") && (
              <div className="flex justify-end">
                <Button onClick={handleVerify} className="mt-4">
                  Mark As Done
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;
