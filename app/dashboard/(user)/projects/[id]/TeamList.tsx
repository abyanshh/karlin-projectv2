"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, SquarePen, Check, Crown } from "lucide-react"; // Import icon Crown untuk PM
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileMember } from "@/type/ProjectList/project";
import { useStaffRole } from "@/hooks/useStaffList";
import api from "@/lib/axios";

interface TeamListProps {
  initialMembers: ProfileMember[];
  projectId: string | undefined;
  ID_pic: string | undefined; // <--- TAMBAHAN: ID Project Manager
}

export function TeamList({ initialMembers, projectId, ID_pic }: TeamListProps) {
  // Members berisi SEMUA (PM + Staff)
  const [members, setMembers] = useState<ProfileMember[]>(initialMembers);
  const user = useUser();
  
  // State kandidat EDITABLE (Hanya Staff, PM tidak ikut diedit di sini)
  const [selectedCandidates, setSelectedCandidates] = useState<ProfileMember[]>([]);
  
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { staffRoleList, loading, error } = useStaffRole("staff");

  // Update state jika props initialMembers berubah (misal setelah refresh data)
  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  // --- Logic Dialog ---
  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (open) {
      // Saat dialog buka, ambil member yang BUKAN PM untuk jadi initial selected
      // Karena dialog ini khusus untuk mengatur STAFF tambahan
      const currentStaffs = members.filter((m) => m && m.id !== ID_pic);
      setSelectedCandidates(currentStaffs);
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleToggleCandidate = (user: ProfileMember) => {
    const isSelected = selectedCandidates.find((u) => u.id === user.id);

    if (isSelected) {
      setSelectedCandidates((prev) => prev.filter((u) => u.id !== user.id));
    } else {
      if (selectedCandidates.length >= 3) {
        alert("Maksimal hanya 3 staff tambahan.");
        return;
      }
      setSelectedCandidates((prev) => [...prev, user]);
    }
  };

  const handleSubmit = async () => {
    if (!projectId) return;
    setIsSubmitting(true);

    try {
      const emails = selectedCandidates
        .map((u) => u.email)
        .filter((email): email is string => !!email);

      // Kirim array staff baru ke backend
      // Backend akan menimpa UserID_1, 2, 3 (PM/UserID_PIC tidak akan terganggu)
      const res = await api.post(`/project/${projectId}/assign-staff`, {
        emailStaff: emails,
      });

      // Update UI: Gabungkan PM (dari state lama) + Staff Baru (dari response/selection)
      // Cara paling aman adalah menggunakan data balikan dari backend jika ada,
      // tapi untuk responsivitas instan kita racik manual:
      
      const pmData = members.find(m => m?.id === ID_pic); // Ambil data PM dari state lama
      const newStaffs = selectedCandidates;
      
      // Set members baru: PM (jika ada) + Staff Baru
      const newTeamList = pmData ? [pmData, ...newStaffs] : [...newStaffs];
      
      setMembers(newTeamList);
      setDialogOpen(false);
      console.log("Team updated");

    } catch (err: any) {
      console.error("Gagal update:", err);
      alert(err.response?.data?.message || "Gagal menyimpan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper untuk render Avatar (Supaya kodenya bersih)
  const renderAvatar = (user: ProfileMember) => {
    // Pastikan URL gambar valid, jika null pakai string kosong
    // Supaya AvatarImage error handler bekerja dan menampilkan Fallback
    const imageUrl = user.image_url ? user.image_url : ""; 

    return (
      <Avatar className="h-10 w-10 border border-border">
        <AvatarImage src={imageUrl} alt={user.user_nama} className="object-cover" />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {user.user_nama?.charAt(0).toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className="space-y-4 md:p-5">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold">Team</h2>

        {user?.id === ID_pic && (
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="link">
              <SquarePen className="mr-2 h-4 w-4" />
              Edit Anggota
            </Button>
          </DialogTrigger>
        

          {/* ... Dialog Content (sama seperti sebelumnya) ... */}
           <DialogContent className="sm:max-w-md flex flex-col h-[500px]">
            <DialogHeader>
              <DialogTitle>Kelola Staff Tambahan</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
              {loading ? (
                 <p className="text-sm text-center py-4">Loading...</p>
              ) : (
                staffRoleList.map((user) => {
                  // Jangan tampilkan PM di list kandidat staff (supaya tidak double/edit diri sendiri)
                  if (user.id === ID_pic) return null;

                  const isSelected = !!selectedCandidates.find((u) => u.id === user.id);
                  return (
                    <Card key={user.id} onClick={() => handleToggleCandidate(user)}
                      className={`cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/5" : "hover:bg-accent"}`}
                    >
                      <CardContent className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          {/* Pakai Helper Avatar yang baru */}
                          <div className="scale-90">{renderAvatar(user)}</div>
                          <div>
                            <p className="font-medium text-sm">{user.user_nama}</p>
                            <p className="text-xs text-muted-foreground">{user.role}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-primary" />}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
            <DialogFooter className="pt-4 border-t">
               <div className="flex w-full justify-between items-center">
                  <span className="text-xs text-muted-foreground">{selectedCandidates.length}/3 Staff dipilih</span>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : "Simpan Tim"}
                  </Button>
               </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
       )}
      </div>

      {/* --- LIST TEAM UTAMA --- */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {members.map((member) => {
          if (!member) return null;

          // Cek apakah user ini adalah PIC / Project Manager
          const isPM = member.id === ID_pic;

          return (
            <Card key={member.id} className={isPM ? "border-primary/40 bg-primary/5" : ""}>
              <CardContent className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-3">
                  
                  {/* FOTO PROFIL */}
                  {renderAvatar(member)}

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{member.user_nama}</p>
                      {/* Badge Khusus PM */}
                      {isPM && (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                           <Crown className="w-3 h-3 mr-1" /> PM
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {member.jabatan || (isPM ? "Project Manager" : "Staff")}
                    </p>
                  </div>
                </div>

             
                
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}