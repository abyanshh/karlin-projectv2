import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  FileText,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { BreadcrumbDemo } from "@/components/breadcrumb-project";

const ProjectDetailPage = () => {
  
  // Mock project data - in real app this would come from API
  const project = {
    id: 1,
    name: "Website Redesign",
    client: "PT. Teknologi Maju",
    status: "in-progress",
    progress: 75,
    dueDate: "2024-01-15",
    startDate: "2023-12-01",
    team: [
      { name: "John Doe", role: "Project Manager", avatar: "JD" },
      { name: "Jane Smith", role: "UI/UX Designer", avatar: "JS" },
      { name: "Bob Wilson", role: "Frontend Developer", avatar: "BW" },
      { name: "Alice Johnson", role: "Backend Developer", avatar: "AJ" },
      { name: "Mike Brown", role: "QA Tester", avatar: "MB" }
    ],
    description: "Redesign website perusahaan dengan UI/UX modern menggunakan teknologi terbaru untuk meningkatkan user experience dan conversion rate.",
    budget: "Rp 250,000,000",
    spent: "Rp 187,500,000"
  };

  const tasks = [
    { id: 1, name: "Analisis Requirement", status: "completed", assignee: "John Doe", dueDate: "2023-12-05" },
    { id: 2, name: "UI/UX Design", status: "completed", assignee: "Jane Smith", dueDate: "2023-12-15" },
    { id: 3, name: "Frontend Development", status: "in-progress", assignee: "Bob Wilson", dueDate: "2024-01-10" },
    { id: 4, name: "Backend Integration", status: "in-progress", assignee: "Alice Johnson", dueDate: "2024-01-12" },
    { id: 5, name: "Testing & QA", status: "pending", assignee: "Mike Brown", dueDate: "2024-01-15" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Selesai</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Berlangsung</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Menunggu</Badge>;
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
      case "pending":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            {/* <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link> */}
          </Button>
          <div>
            <BreadcrumbDemo />
            <div className="mt-2">
              <h1 className="text-2xl font-bold text-secondary">{project.name}</h1>
              <p className="text-muted-foreground">{project.client}</p>
            </div>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
          <Link href={`/dashboard/projects/${project.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Proyek
          </Link>
        </Button>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(project.status)}
              <h3 className="font-semibold">Status</h3>
            </div>
            {getStatusBadge(project.status)}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Deadline</h3>
            </div>
            <p className="text-lg font-medium">{project.dueDate}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Tim</h3>
            </div>
            <p className="text-lg font-medium">{project.team.length} orang</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Progress</h3>
            </div>
            <div className="space-y-2">
              <Progress value={project.progress} className="h-2" />
              <p className="text-lg font-medium">{project.progress}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Tim</TabsTrigger>
          <TabsTrigger value="budget">Anggaran</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi Proyek</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tanggal Mulai:</span>
                    <span className="font-medium">{project.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target Selesai:</span>
                    <span className="font-medium">{project.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durasi:</span>
                    <span className="font-medium">45 hari</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tasks Selesai:</span>
                    <span className="font-medium">12/16</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Milestone:</span>
                    <span className="font-medium">3/4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overall Progress:</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

            <Card>
            <CardHeader>
              <CardTitle>Daftar Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(task.status)}
                      <div>
                        <h4 className="font-medium">{task.name}</h4>
                        <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">{task.dueDate}</span>
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(task.status)}
                      <div>
                        <h4 className="font-medium">{task.name}</h4>
                        <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">{task.dueDate}</span>
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Anggota Tim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.team.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium text-sm">{member.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Anggaran Proyek</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Budget:</span>
                    <span className="font-medium text-lg">{project.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Terpakai:</span>
                    <span className="font-medium text-lg">{project.spent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sisa:</span>
                    <span className="font-medium text-lg">Rp 62,500,000</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-sm text-muted-foreground">75% budget terpakai</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Breakdown Biaya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Development:</span>
                    <span className="font-medium">Rp 150,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Design:</span>
                    <span className="font-medium">Rp 50,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Testing:</span>
                    <span className="font-medium">Rp 25,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deployment:</span>
                    <span className="font-medium">Rp 25,000,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailPage;
