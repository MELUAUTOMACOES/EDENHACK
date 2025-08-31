import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: "primary" | "water" | "earth" | "sunset";
  onClick?: () => void;
  className?: string;
}

const gradientClasses = {
  primary: "bg-gradient-primary",
  water: "bg-gradient-water", 
  earth: "bg-gradient-earth",
  sunset: "bg-gradient-sunset",
};

export function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  onClick, 
  className 
}: ActionCardProps) {
  return (
    <Card 
      className={cn(
        "shadow-card cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-soft border-0",
        gradientClasses[gradient],
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon size={24} />
          </div>
          <h3 className="font-roboto font-bold text-lg">{title}</h3>
        </div>
        <p className="text-white/90 font-lato text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}