"use client";

import { useState } from "react";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Label } from "@/components/ui/label";
import { useStaffList } from "@/hooks/useStaffList";
import { columns } from "./columns";
import { TableSkeleton } from "./TableSkeleton";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react"; // Import icon mata

export function TeamTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();
  const { staffList, loading, refetch } = useStaffList();
  const [showPassword, setShowPassword] = useState(false);

  const data = staffList || [];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    globalFilterFn: "includesString",
  });

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdding(true);

    try {
      const form = new FormData(e.currentTarget);

      await addUser(form);
      await refetch();

      toast({
        title: "Berhasil menambahkan user",
        description: "User baru telah ditambahkan ke bagian paling belakang",
      });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast({
        title: "Gagal menambahkan user",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  async function addUser(formData: FormData) {
    const response = await api.post("/staff/add", formData);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  }

  if (loading) {
    return <TableSkeleton columns={columns.length} />;
  }


  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Cari nama atau email..."
          // Ambil state globalFilter, bukan column specific
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(event.target.value)
          }
          className="max-w-sm bg-card"
        />
        <Dialog>
  <DialogTrigger asChild>
    <Button size="sm" variant="outline">
      <Plus /> Tambah User
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-[425px]">
    <form onSubmit={handleAddUser}>
      <DialogHeader>
        <DialogTitle>Tambah User</DialogTitle>
        <DialogDescription>
          Isi data dibawah ini untuk menambahkan user baru
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 mt-4">
        <div className="grid gap-3">
          <Label htmlFor="user_nama">Name</Label>
          <Input id="user_nama" name="user_nama" required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" required />
        </div>

        <div className="grid gap-3">
  <Label htmlFor="password">Password</Label>
  
  <div className="relative">
    <Input
      id="password"
      name="password"
      // Logika utama: jika true jadi text, jika false jadi password
      type={showPassword ? "text" : "password"} 
      required
      // Tambahkan pr-10 (padding-right) agar teks tidak tertutup icon
      className="pr-10" 
    />
    
            {/* Tombol Icon Mata */}
            <button
              type="button" // PENTING: agar tidak men-submit form saat diklik
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" /> // Icon mata dicoret (sembunyikan)
              ) : (
                <Eye className="h-4 w-4" />    // Icon mata biasa (lihat)
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="role">Role</Label>
          <Select  name="role" required>
            <SelectTrigger className="w-full" id="role">
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="pm">Project Manager</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="jabatan">Jabatan</Label>
          <Input id="jabatan" name="jabatan" required />
        </div>
      </div>

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline" type="button">Cancel</Button>
        </DialogClose>

        <Button type="submit" disabled={adding}>
          {adding ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

      </div>

      <div className="rounded-md border bg-card">
        <Table className="min-w-6x1">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
