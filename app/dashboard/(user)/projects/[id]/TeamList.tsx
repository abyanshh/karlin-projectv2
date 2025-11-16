"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, SquarePen } from "lucide-react";
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

interface TeamListProps {
  initialMembers: ProfileMember[];
  allUsers: ProfileMember[];
  projectId: string | undefined;
}

export function TeamList({ initialMembers, allUsers, projectId }: TeamListProps) {
  const [members, setMembers] = useState<ProfileMember[]>(initialMembers);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleAddMember = (userToAdd: ProfileMember) => {
    if (!members.find(member => member.id === userToAdd.id)) {
      setMembers([...members, userToAdd]);

    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(member => member.id !== memberId));
  };


  return (
    <div className="space-y-4 md:p-5">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold">Team</h2>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="link">
              <SquarePen className="mr-2" />
              Add Anggota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Pilih Anggota</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 overflow-y-auto h-56 pr-4">
              {allUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.user_nama.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.user_nama}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="text-xs cursor-pointer"
                      onClick={() => handleAddMember(user)}
                      disabled={!!members.find(m => m.id === user.id)}
                    >
                      {members.find(m => m.id === user.id) ? "Ditambahkan" : "Tambahkan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Tutup</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.image_url} alt={member.user_nama} />
                  <AvatarFallback>{member.user_nama.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{member.user_nama}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
