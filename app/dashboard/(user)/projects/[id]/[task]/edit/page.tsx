'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TaskForm from "./component/TaskForm";
import { useTaskDetail } from "@/hooks/useTaskDetail";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string; task: string }>;
}

const EditTaskPage = ({ params }: PageProps) => {
  const { id, task } = use(params);
  const { data, loading } = useTaskDetail(id, task);
  if (loading) return <div>Loading...</div>;
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
