import SearchFragment from "@/components/project/search-bar";
import ProjectList from "@/components/project/ProjectList";

const page = () => {
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      client: "PT. Teknologi Maju",
      status: "in-progress",
      progress: 75,
      dueDate: "2024-01-15",
      team: 5,
      description: "Redesign website perusahaan dengan UI/UX modern",
    },
    {
      id: 2,
      name: "Mobile App Development",
      client: "CV. Inovasi Digital",
      status: "completed",
      progress: 100,
      dueDate: "2023-12-20",
      team: 8,
      description: "Pengembangan aplikasi mobile untuk e-commerce",
    },
    {
      id: 3,
      name: "Infrastructure Setup",
      client: "PT. Infrastruktur Nusa",
      status: "planning",
      progress: 25,
      dueDate: "2024-02-28",
      team: 12,
      description: "Setup infrastruktur cloud dan server",
    },
    {
      id: 4,
      name: "ERP Implementation",
      client: "PT. Manufaktur Indo",
      status: "in-progress",
      progress: 45,
      dueDate: "2024-03-10",
      team: 6,
      description: "Implementasi sistem ERP untuk manufaktur",
    },
  ];

  return (
    <div className="space-y-4">
      <SearchFragment />
      <ProjectList data={projects} />
    </div>
  );
};

export default page;
