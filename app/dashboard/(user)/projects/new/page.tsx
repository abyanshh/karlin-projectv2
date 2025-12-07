import { ArrowLeft, QrCode } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProjectForm from "@/components/project/ProjectForm";

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Buat Proyek Baru</h1>
            <p className="text-muted-foreground">Isi data proyek untuk menambah proyek baru</p>
          </div>
        </div>

        {/* QR Sales quick access */}
        <div>
          <Link href="/dashboard/testing/qr-sales">
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4 mr-2" />
              QR Sales
            </Button>
          </Link>
        </div>
      </div>

      {/* Form */}
      <ProjectForm mode="create" />
    </div>
  );
}
