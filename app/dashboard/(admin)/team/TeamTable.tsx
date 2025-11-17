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

export function TeamTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();
  const { staffList, loading, refetch } = useStaffList();

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
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-card"
        />
        <Dialog>
  <DialogTrigger asChild>
    <Button size="sm" variant="outline">
      <Plus /> Add User
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-[425px]">
    <form onSubmit={handleAddUser}>
      <DialogHeader>
        <DialogTitle>Add User</DialogTitle>
        <DialogDescription>
          Add a new member to the app.
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
          <Input id="password" name="password" type="password" required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" required />
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
        <Table className="min-w-6xl">
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
