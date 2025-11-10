"use client";

import { useState, DragEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, Trash2, Edit, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import Link from "next/link";

const page = () => {
  const params = useParams();
  const { id, task } = params;

 
  const data = {
    id: task,
    title: "Dokumentasi Projek Tahap 1",
    status: "waiting for verification",
    description:
      "Dokumentasikan seluruh progres tahap 1 termasuk kebutuhan, desain awal, dan alur sistem.",
    deadline: "2025-11-05",
  };

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
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ====== HEADER TASK ====== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex justify-between items-center">
            <div className="">{data.title}</div>
            <Button asChild>
              <Link href={`/dashboard/projects/${id}/${task}/edit`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
          </CardTitle>
          <div className="flex gap-4">
            <Badge
              variant={
                data.status === "berlangsung"
                  ? "progress"
                  : data.status === "completed"
                  ? "success"
                  : "failed"
              }
            >
              {data.status}
            </Badge>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{data.deadline}</span>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mt-2">
            {data.description}
          </p>
        </CardHeader>
      </Card>

      {/* ====== UPLOAD AREA ====== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Upload Hasil Kerja
          </CardTitle>
        </CardHeader>
        <CardContent>
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

          {/* ====== FILE LIST ====== */}
          {uploadedFiles.length > 0 && (
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
          )}
          <div className="flex justify-end">
            <Button className="mt-4">
              Mark As Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
