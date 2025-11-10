import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProjectForm from "@/components/project/ProjectForm";

const Page = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/projects`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Proyek Baru</h1>
            <p className="text-muted-foreground">Silakan isi data terlebih dahulu</p>
          </div>
        </div>
      </div>

      <ProjectForm mode="create"/>
    </div>
  );
};

export default Page;
