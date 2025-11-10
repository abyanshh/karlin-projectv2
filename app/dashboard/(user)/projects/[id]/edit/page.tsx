import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProjectForm from "@/components/project/ProjectForm";
import { projectDataList } from "@/data/project";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project/${id}`, {
  //   cache: "no-store",
  // });
  // if (!res.ok) {
  //   console.error("Gagal memuat data proyek");
  // }
  // const project = await res.json();

  const project = projectDataList

  if (!project) {
    return (
      <div className="p-6 text-center bg-card w-full rounded-md py-10">
        <p className="text-muted-foreground text-sm">
          Data proyek tidak ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/projects/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Proyek</h1>
            <p className="text-muted-foreground">Edit informasi proyek</p>
          </div>
        </div>
      </div>

      <ProjectForm mode="edit" initialData={project} id={id} />
    </div>
  );
};

