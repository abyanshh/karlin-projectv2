"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Save,
  FolderCog,
  UserPen,
  User,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  position?: string;
  department?: string;
  location?: string;
  bio?: string;
  joinDate?: string;
}

export default function ProfileForm({ data } : { data: ProfileData }) {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState(data);
  console.log(profileData);
  const handleChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    if (res.ok) {
      toast({
        title: "Profil berhasil diperbarui",
        description: "Perubahan telah disimpan.",
      });
    } else {
      toast({
        title: "Gagal memperbarui profil",
        description: "Terjadi kesalahan saat menyimpan.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Informasi Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nama, Posisi & email */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Nama lengkap"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Posisi</Label>
              <div className="relative">
                <UserPen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="position"
                  value={profileData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  placeholder="Posisi/Jabatan"
                  className="pl-10"
                />
              </div>
            </div>

             <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-10"
                  placeholder="email@example.com"
                  disabled
                />
              </div>
            </div>

            
          </div>

          {/* ttl & Telepon */}
          <div className="grid md:grid-cols-2 gap-4">
            
            <div className="space-y-2">
                <Label htmlFor="birthdate">Tanggal Lahir</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="birthdate"
                    type="date"
                    value={profileData.birthdate || ""}
                    onChange={(e) => handleChange("birthdate", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="pl-10"
                  placeholder="+62"
                />
              </div>
            </div>
          </div>

          {/* Departemen & Lokasi */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Departemen</Label>
              <div className="relative">
                <FolderCog className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="department"
                  value={profileData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  placeholder="Departemen"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="pl-10"
                  placeholder="Kota, Negara"
                />
              </div>
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Save className="h-4 w-4 mr-2" /> Simpan Perubahan
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
