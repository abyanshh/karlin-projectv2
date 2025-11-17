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
        Role
        <ArrowUpDown className="w-4 h-4" />
      </div>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("jabatan")}</div>,
  },
  {
    accessorKey: "ttl",
    header: () => <div className="text-right">TTL</div>,
    cell: ({ row }) => {
      const ttl = row.getValue("ttl") as string | null;
      return <div className="text-right font-medium">{ttl || "-"}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              <Copy />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User2 /> View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];