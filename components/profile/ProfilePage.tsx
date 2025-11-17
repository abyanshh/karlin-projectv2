'use client';

import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfileForm from "@/components/profile/ProfileForm";
import { useProfile } from "@/hooks/useProfile";
import { ProfileSkeleton } from "./ProfileSkeleton";

export default function ProfilePage() {
  
  const {user, loading} = useProfile();

  if (loading) return <ProfileSkeleton/>;
  if (!user) {
    return <div>Gagal memuat profil. Silakan coba lagi.</div>;
  }
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
