import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

export function ServiceCard({ icon: Icon, title, description, className, onClick }: ServiceCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-lg cursor-pointer animate-fadeIn",
        className
      )}
      onClick={onClick}
    >
      <CardHeader>
        <Icon className="w-8 h-8 text-amber mb-2" />
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}