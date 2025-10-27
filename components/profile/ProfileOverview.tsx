import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Shield, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileOverview({ data }: { data: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {data.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              variant="outline"
            >
              <Camera className="h-3 w-3" />
            </Button>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-bold">{data.name}</h2>
            <p className="text-muted-foreground">{data.position}</p>
            <p className="text-sm text-muted-foreground">
              {data.department} • Bergabung {data.joinDate}
            </p>

            <div className="flex items-center space-x-4 mt-3">
              <Badge variant="outline" className="text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {data.location}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
