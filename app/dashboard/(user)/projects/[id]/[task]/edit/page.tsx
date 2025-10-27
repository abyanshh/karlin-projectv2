import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TaskForm from "./component/TaskForm";

interface PageProps {
  params: { id: string; task: string };
}


const EditTaskPage = async ({ params }: PageProps) => {
  const { id, task } = params;

  const data = {
    title: "Dokumentasi Projek Tahap 1",
    description:
      "Dokumentasikan seluruh progres tahap 1 termasuk kebutuhan, desain awal, dan alur sistem.",
    status: "berlangsung",
    deadline: "2025-11-05",
  };

  return (
    <div className=" space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/projects/${id}/${task}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </Button>
        </Link>
        <h2 className="text-xl font-semibold">Edit Task</h2>
      </div>

      <TaskForm projectId={id} taskId={task} defaultValues={data} />
    </div>
  );
};

export default EditTaskPage;
