import { Home, Droplets, MessageCircle, BookOpen, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/irrigacao", icon: Droplets, label: "Irrigação" },
  { path: "/chat", icon: MessageCircle, label: "Adan AI" },
  { path: "/aprender", icon: BookOpen, label: "Aprender" },
  { path: "/perfil", icon: User, label: "Perfil" },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px]",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium font-lato">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}