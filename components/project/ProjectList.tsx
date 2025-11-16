import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
} from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import type { Project } from "@/type/ProjectList/project";
import { UserSession } from "@/hooks/useUser";

interface ProjectListProps {
  data: Project[];
  user: UserSession | null;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "done":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Selesai
        </Badge>
      );
    case "active":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Berlangsung
        </Badge>
      );
    case "planning":
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          Perencanaan
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "done":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "active":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "planning":
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    default:
      return null;
  }
};

const ProjectList: React.FC<ProjectListProps> = ({ data: projects, user }) => {
  return (
    <>
      <div className="grid gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="hover:shadow-elegant transition-all duration-300"
          >
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(project.status)}
                  <div>
                    <h3 className="text-xl font-semibold">{project.po}</h3>
                    <p className="text-muted-foreground">{project.client}</p>
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
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Sales</p>
                    <p className="text-sm font-medium">{project.ID_sales}</p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium">{project.deadline}</p>
                  </div>
                </div>

                {/* Team */}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">PIC</p>
                    <p className="text-sm font-medium">
                      {project.ID_pic || "Belum ada"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 items-center gap-2 justify-end">
                  {user?.role === "admin" ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/projects/${project.id}`}>
                      Detail
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ProjectList;
