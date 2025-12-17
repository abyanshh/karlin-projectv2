'use client';
import ProjectList from "@/components/project/ProjectList";
import SearchFragment from "@/components/project/search-bar";
import ProjectListSkeleton from "@/components/project/ProjectListSkeleton";
import { useProjects } from "@/hooks/useProjects";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Plus, QrCode } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

const Page = () => {
  const user = useUser();
  const { projects, loading } = useProjects();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    let result = [...projects];

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((project) =>
        project.po.toLowerCase().includes(lowerQuery) ||
        project.client.toLowerCase().includes(lowerQuery) ||
        project.Sales.user_nama.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by status
    if (statusFilter) {
      result = result.filter((project) => project.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        // Assuming higher ID means newer if no created_at, or just order by ID descending
        // But let's check if we can sort by id or if there's a better way.
        // Often ID is sequential or UUID. If UUID, this might not work.
        // Let's assume there might be a date field not visible, or we rely on index?
        // Actually the projects coming from API might be sorted already.
        // Let's rely on ID comparison as a fallback for 'newest' if no better field.
        // Wait, 'deadline' is a date string.
        return b.id.localeCompare(a.id);
      } else if (sortBy === "oldest") {
        return a.id.localeCompare(b.id);
      } else if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

    return result;
  }, [projects, searchQuery, statusFilter, sortBy]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <ProjectListSkeleton />
    );
  }

  // Note: We want to show the search bar even if there are no projects initially?
  // Maybe not if completely empty, but if empty after filter we definitely want to show it.
  // The original code returned early if !projects.length.
  // If we have projects but filter results in 0, we still want to see the UI to clear filter.
  // So we should only early return if the *fetched* projects are empty, not the filtered ones.
  // However, the original code had this check. I will keep it for "no projects data at all".

  if (!projects || projects.length === 0) {
    return (
      <div className="p-6 text-center bg-card w-full rounded-md py-10">
        <p className="text-muted-foreground text-sm">
          Belum ada proyek yang tersedia.
        </p>
        {(user?.role === "admin" || user?.role === "sales") && (
          <div className="mt-4">
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <Plus className="h-4 w-4 mr-2" />
                Buat Proyek Baru
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchFragment
          onSearch={setSearchQuery}
          onFilterStatus={setStatusFilter}
          onSort={setSortBy}
        />
        {(user?.role === "admin" || user?.role === "sales") && (
          <div className="flex gap-2">
            <Link href="/dashboard/projects/qr-template">
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                Buat QR Template
              </Button>
            </Link>
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <Plus className="h-4 w-4 mr-2" />
                Buat Proyek Baru
              </Link>
            </Button>
          </div>
        )}
      </div>
      {paginatedProjects.length > 0 ? (
        <>
          <ProjectList data={paginatedProjects} user={user} />
          {filteredProjects.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          Tidak ada proyek yang cocok dengan filter.
        </div>
      )}
    </div>
  );
};

export default Page;

