import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Plus,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar
} from "lucide-react";
import Link from "next/link";

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
      description: "Redesign website perusahaan dengan UI/UX modern"
    },
    {
      id: 2,
      name: "Mobile App Development", 
      client: "CV. Inovasi Digital",
      status: "completed",
      progress: 100,
      dueDate: "2023-12-20",
      team: 8,
      description: "Pengembangan aplikasi mobile untuk e-commerce"
    },
    {
      id: 3,
      name: "Infrastructure Setup",
      client: "PT. Infrastruktur Nusa",
      status: "planning",
      progress: 25,
      dueDate: "2024-02-28",
      team: 12,
      description: "Setup infrastruktur cloud dan server"
    },
    {
      id: 4,
      name: "ERP Implementation",
      client: "PT. Manufaktur Indo",
      status: "in-progress", 
      progress: 45,
      dueDate: "2024-03-10",
      team: 6,
      description: "Implementasi sistem ERP untuk manufaktur"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Selesai</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Berlangsung</Badge>;
      case "planning":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Perencanaan</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "planning":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-secondary font-bold">Daftar Proyek</h1>
          <p className="text-muted-foreground">Kelola semua proyek Anda di sini</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Proyek Baru
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari proyek..."
            className="bg-card pl-10"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-elegant transition-all duration-300">
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(project.status)}
                  <div>
                    <h3 className="text-xl text-secondary font-semibold">{project.name}</h3>
                    <p className="text-muted-foreground">{project.client}</p>
                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(project.status)}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Progress */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Progress</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-muted rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium">{project.dueDate}</p>
                  </div>
                </div>

                {/* Team */}
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tim</p>
                    <p className="text-sm font-medium">{project.team} orang</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/projects/${project.id}`}>Detail</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/projects/${project.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;