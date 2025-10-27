'use client'

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProjectForm from "@/components/project/ProjectForm";

const Page = () => {
  const params = useParams();
  const id = params.id;
  const data = {
    name: "John Doe",
    client: "PT Abadi Jaya",
    description: "Follow the video tutorial above. Understand how to use each tool in the Figma application. Also learn how to make a good and correct design. Starting from spacing, typography, content, and many other design hierarchies. Then try to make it yourself with your imagination and inspiration.",
    deadline: "2024-01-15",
    pic: "Dimas Ukin",
    status: "Berlangsung",
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

      <ProjectForm mode="edit" initialData={data} />
    </div>
  );
};

export default Page;
