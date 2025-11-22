'use client';

import StaffProfileOverview from "@/components/profile/StaffProfileOverview";
import StaffProfileForm from "@/components/profile/StaffProfileForm";
import { useProfile } from "@/hooks/useProfile";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { useParams } from "next/navigation";



export default function ProfilePage() {
  
  const params = useParams();
  const id = params.id as string;
  const {user, loading} = useProfile(id as string);

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

      <StaffProfileOverview data={user} />
      <StaffProfileForm data={user} />
    </div>
  );
}


