import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { MoreHorizontal, CheckCircle2, Clock, AlertCircle, Calendar, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";

type ProjectStatus = "completed" | "in-progress" | "planning" | string;

interface Project {
  id: number;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
  team: number;
  description: string;
}

interface ProjectListProps {
  data: Project[];
}

const getStatusBadge = (status: ProjectStatus) => {
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

const getStatusIcon = (status: ProjectStatus) => {
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

const ProjectList: React.FC<ProjectListProps> = ({ data: projects }) => {
  return (
    <div className="grid gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-elegant transition-all duration-300">
          <CardContent>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(project.status)}
                <div>
                  <h3 className="text-xl font-semibold">{project.name}</h3>
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
                  <p className="text-sm font-medium">
                    {new Date(project.dueDate).toLocaleDateString("id-ID")}
                  </p>
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
  );
};

export default ProjectList;
