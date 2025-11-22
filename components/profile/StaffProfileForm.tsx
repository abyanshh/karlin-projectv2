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
import { ProfileMember } from "@/type/ProjectList/project";
import api from "@/lib/axios";

export default function ProfileForm({ data }: { data: ProfileMember }) {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileMember>(
    {
      id: data?.id,
      user_nama: data?.user_nama ?? "",
      jabatan: data?.jabatan ?? "",
      email: data?.email ?? "",
      no_hp: data?.no_hp ?? "",
      ttl: data?.ttl ?? "",
      role: data?.role ?? "",
      image_url: data?.image_url ?? "",
    }
  );
  const handleChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/profile/${data.id}`, profileData);

      toast({
        title: "Profil berhasil diperbarui",
        description: "Perubahan telah disimpan.",
      });

      window.location.reload();
    } catch (error) {
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
              <Label htmlFor="user_nama">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="user_nama"
                  value={profileData.user_nama}
                  onChange={(e) => handleChange("user_nama", e.target.value)}
                  placeholder="Nama lengkap"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jabatan">Posisi</Label>
              <div className="relative">
                <UserPen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="jabatan"
                  value={profileData.jabatan}
                  onChange={(e) => handleChange("jabatan", e.target.value)}
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
                />
              </div>
            </div>
          </div>

          {/* ttl & Telepon */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ttl">Tanggal Lahir</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="ttl"
                  type="date"
                  value={profileData.ttl}
                  onChange={(e) => handleChange("ttl", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="no_hp">Nomor Telepon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="no_hp"
                  value={profileData.no_hp}
                  onChange={(e) => handleChange("no_hp", e.target.value)}
                  className="pl-10"
                  placeholder="+62"
                />
              </div>
            </div>
          </div>

          {/* Departemen & Lokasi */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <FolderCog className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="role"
                  value={profileData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  placeholder="Departemen"
                  className="pl-10"
                />
              </div>
            </div> */}

            {/* <div className="space-y-2">
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
            </div> */}
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

