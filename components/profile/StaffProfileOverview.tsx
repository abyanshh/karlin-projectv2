import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileMember } from "@/type/ProjectList/project";
import { useState, useRef } from "react";

export default function ProfileOverview({ data }: { data: ProfileMember & { id?: string | number } }) {

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref untuk input file
  const [isUploading, setIsUploading] = useState(false); // State untuk loading


  // Fungsi ketika user memilih file
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validasi sederhana (opsional)
    if (!file.type.startsWith("image/")) {
      alert("Mohon upload file gambar.");
      return;
    }

    const formData = new FormData();
    // PENTING: "image" adalah key yang harus sesuai dengan konfigurasi backend (Multer/FormFile)
    formData.append("image", file); 

    setIsUploading(true);

    try {
      // Sesuaikan endpoint dengan ID user dari data
      // Asumsi: data memiliki property 'id' atau 'user_id'
      const userId = data?.id; 
      
      const response = await fetch(`http://localhost:5000/api/profile/${userId}/image`, {
        method: "PUT", // Atau POST, tergantung backend kamu
        body: formData,
        // Jangan set header 'Content-Type', browser akan mengaturnya otomatis untuk FormData
      });

      if (!response.ok) {
        throw new Error("Gagal mengupload gambar");
      }

      const result = await response.json();
      console.log("Upload berhasil:", result);
      
      // Opsi: Reload halaman atau update state global agar gambar baru muncul
      window.location.reload(); 

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Gagal mengupload gambar. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
      // Reset input agar bisa upload file yang sama jika gagal sebelumnya
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Fungsi trigger klik input file
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Hidden Input File */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={data?.image_url} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {data?.user_nama
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              variant="outline"
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Camera className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-bold">{data?.user_nama}</h2>
            <p className="text-2x1 text-muted-foreground">
              {data?.jabatan}
            </p>

            <div className="flex items-center space-x-4 mt-3">
              <Badge variant="outline" className="text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                {data?.role}
              </Badge>
              {/* <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {data?.location}
              </div> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
