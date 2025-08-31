import { Sprout, Droplets, Bug, Wheat, Play, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    id: "solo",
    title: "Solo 🌱",
    icon: Sprout,
    description: "Aprenda sobre tipos de solo, nutrientes e preparação",
    color: "bg-gradient-earth",
    lessons: 12
  },
  {
    id: "irrigacao",
    title: "Irrigação 💧",
    icon: Droplets,
    description: "Técnicas de irrigação eficiente e economia de água",
    color: "bg-gradient-water",
    lessons: 8
  },
  {
    id: "pragas",
    title: "Pragas 🐛",
    icon: Bug,
    description: "Identificação e controle de pragas e doenças",
    color: "bg-gradient-primary",
    lessons: 15
  },
  {
    id: "culturas",
    title: "Culturas 🌾",
    icon: Wheat,
    description: "Guias específicos para diferentes tipos de plantação",
    color: "bg-gradient-sunset",
    lessons: 20
  }
];

const recentLessons = [
  {
    title: "Como identificar solo ácido",
    duration: "5 min",
    type: "vídeo",
    progress: 100
  },
  {
    title: "Irrigação por gotejamento",
    duration: "8 min", 
    type: "vídeo",
    progress: 60
  },
  {
    title: "Combate natural às formigas",
    duration: "3 min",
    type: "áudio",
    progress: 0
  }
];

const Aprender = () => {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-roboto font-bold text-primary mb-2 flex items-center gap-2">
          <BookOpen className="text-eden-green" />
          Aprender
        </h1>
        <p className="text-muted-foreground font-lato">
          Conteúdos educativos para melhorar sua agricultura
        </p>
      </div>

      {/* Continue Learning */}
      <Card className="mb-6 shadow-card border-eden-blue/20 bg-eden-blue/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Play className="text-eden-blue" size={20} />
            <h3 className="font-roboto font-bold text-eden-blue">Continue Aprendendo</h3>
          </div>
          <div className="space-y-3">
            {recentLessons.map((lesson, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50">
                <div className="flex-1">
                  <p className="font-lato font-medium text-sm">{lesson.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      {lesson.type}
                    </Badge>
                  </div>
                  {lesson.progress > 0 && (
                    <div className="w-full bg-muted rounded-full h-1 mt-2">
                      <div
                        className="bg-eden-blue h-1 rounded-full transition-all"
                        style={{ width: `${lesson.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <Play size={16} className="text-eden-blue ml-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-roboto font-bold text-primary mb-4">
          Categorias
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className={`shadow-card cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-soft border-0 ${category.color}`}
              >
                <CardContent className="p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Icon size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-roboto font-bold text-lg mb-1">
                          {category.title}
                        </h3>
                        <p className="text-white/90 font-lato text-sm leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 rounded-lg px-3 py-1 backdrop-blur-sm">
                        <span className="font-roboto font-bold text-lg">{category.lessons}</span>
                        <p className="text-xs text-white/80">aulas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Featured Content */}
      <Card className="mt-6 shadow-card">
        <CardHeader>
          <CardTitle className="font-roboto">Destaque da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Droplets className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-roboto font-bold mb-1">
                Irrigação Inteligente com IoT
              </h3>
              <p className="text-sm text-muted-foreground font-lato mb-2">
                Aprenda a usar sensores para otimizar sua irrigação
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-eden-yellow text-eden-brown">Novo</Badge>
                <span className="text-xs text-muted-foreground">12 min • vídeo</span>
              </div>
            </div>
            <Play className="text-eden-blue" size={20} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Aprender;