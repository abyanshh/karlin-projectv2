import SearchFragment from "@/components/project/search-bar";
import ProjectList from "@/components/project/ProjectList";
import api from "@/lib/axios";
import { projectDataList } from "@/data/project";
import type { Project } from "@/type/ProjectList/project";




const page = async () => {
  
  let projects: Project[] = [];

  try {
    const { data } = await api.get("/api/project");
    projects = data;
  } catch (error) {
    console.error("Gagal memuat data project:", error);
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="p-6 text-center bg-card w-full rounded-md py-10">
        <p className="text-muted-foreground text-sm">
          Belum ada proyek yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchFragment />
      <ProjectList data={projects} />
    </div>
  );
};

export default page;

