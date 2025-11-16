'use client';

import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfileForm from "@/components/profile/ProfileForm";
import { useUser } from "@/hooks/useUser";

export default function ProfilePage() {
  
  const user = useUser();
  const profile = {
    user_nama: "John Doe",
    email: "john.doe@karlinmastrindo.com",
    phone: "+62 812 3456 7890",
    birthdate: "2000-01-01",
    position: "Senior Project Manager",
    department: "Project Management",
    location: "Jakarta, Indonesia",
    bio: "Experienced project manager with 8+ years in managing complex IT projects.",
    joinDate: "January 2020",
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil Pengguna</h1>
        <p className="text-muted-foreground">
          Kelola informasi akun dan preferensi Anda
        </p>
      </div>

      <ProfileOverview data={user} />
      <ProfileForm data={user} />
    </div>
  );
}
