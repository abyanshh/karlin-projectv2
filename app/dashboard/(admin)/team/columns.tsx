"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Copy,
  MoreHorizontal,
  Trash2,
  User2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileMember } from "@/type/ProjectList/project";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/axios";
import { handleDelete } from "@/hooks/useStaffList";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


export const columns: ColumnDef<ProfileMember>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user_nama",
    header: ({ column }) => (
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="w-4 h-4" />
      </div>
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          {user.image_url ? (
            <Image
              src={user.image_url}
              alt={user.user_nama}
              width={28}
              height={28}
              className="rounded-full object-cover h-7 w-7"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
              <User2 className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div className="font-medium">{user.user_nama}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="w-4 h-4" />
      </div>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "no_hp",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("no_hp") as string | null;
      return <div>{phone || "-"}</div>;
    },
  },
  {
    accessorKey: "jabatan",
    header: ({ column }) => (
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Jabatan
        <ArrowUpDown className="w-4 h-4" />
      </div>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("jabatan")}</div>,
  },
  // {
  //   accessorKey: "ttl",
  //   header: () => <div className="text-left">TTL</div>,
  //   cell: ({ row }) => {
  //     const ttl = row.getValue("ttl") as string | null;
  //     return <div className="text-left font-medium">{ttl || "-"}</div>;
  //   },
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const { toast } = useToast();
     
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            <Link 
            key={user.id}
            href={`/dashboard/team/${user.id}`}>
            <DropdownMenuItem>
                  <User2 /> View Profile
            </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Dialog>
            <DialogTrigger asChild> 
            <DropdownMenuItem className="text-destructive" key={user.id} onSelect={(e) => e.preventDefault()}>
              <Trash2 />
              Hapus User
            </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
    
            <DialogHeader>
              <DialogTitle>Hapus User</DialogTitle>
              <DialogDescription>
                Apakah anda yakin ingin menghapus user {user.user_nama} dari daftar staff?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
              <Button variant="outline" type="button">Batal</Button>
              </DialogClose>

              
                <Button
                variant="destructive"
                type="button"
                onClick={async () => {
                  await handleDelete(user.id);
                  window.location.reload();
                   toast({
                    title: "User Dihapus",
                    description: `User ${user.user_nama} telah berhasil dihapus dari daftar staff.`,
                    });
                }}
                > Hapus User
                </Button>
            </DialogFooter>
            </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];