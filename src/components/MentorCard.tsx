"use client";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Sparkles } from "lucide-react";
import { Mentor } from "@/types";

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const isHighMatch = mentor.matchScore > 0.9;

  return (
    <Card className="h-full flex flex-col overflow-hidden border-border/50 hover:border-primary/50 transition-colors group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12 border-2 border-background ring-2 ring-border group-hover:ring-primary/50 transition-all">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.id}`} />
              <AvatarFallback>{mentor.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold leading-none text-lg">{mentor.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{mentor.role}</p>
            </div>
          </div>
          <Badge variant={isHighMatch ? "default" : "secondary"} className={isHighMatch ? "bg-green-500 hover:bg-green-600" : ""}>
            {Math.round(mentor.matchScore * 100)}% Coincidencia
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3 h-3" /> {mentor.campus}
        </div>
        <p className="text-sm text-foreground/90 line-clamp-3 mb-4">
          &quot;{mentor.bio}&quot;
        </p>
        <div className="flex flex-wrap gap-2">
          {mentor.tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-primary/5 border-primary/10 text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full gap-2 bg-gradient-to-r from-primary to-violet-600 hover:opacity-90 transition-opacity">
          <Sparkles className="w-4 h-4" /> Solicitar Conexión
        </Button>
      </CardFooter>
    </Card>
  );
}
