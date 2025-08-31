import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { get, authenticatedRequest } from "@/lib/http";
import { useToast } from "@/hooks/use-toast";

const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
});

type AuthForm = z.infer<typeof authSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { signIn, signUp, signOut, user } = useAuth();
  const { toast } = useToast();

  const form = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const handleSignIn = async (data: AuthForm) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      toast({
        title: "Erro no login",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login realizado",
        description: "Bem-vindo ao Éden!",
      });
    }
    setIsLoading(false);
  };

  const handleSignUp = async (data: AuthForm) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.name);
    
    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cadastro realizado",
        description: "Conta criada com sucesso!",
      });
    }
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserProfile(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const testApiHealth = async () => {
    try {
      const health = await get('/api/health');
      setApiStatus(health);
      toast({
        title: "API Status",
        description: `Status: ${health.status}`,
      });
    } catch (error) {
      toast({
        title: "Erro na API",
        description: "Não foi possível conectar com o servidor",
        variant: "destructive",
      });
    }
  };

  const fetchProfile = async () => {
    try {
      const profile = await authenticatedRequest<{ name?: string }>('/api/profiles/me');
      setUserProfile(profile);
      toast({
        title: "Perfil carregado",
        description: `Olá, ${profile.name || 'Usuário'}!`,
      });
    } catch (error) {
      toast({
        title: "Erro no perfil",
        description: "Não foi possível carregar o perfil",
        variant: "destructive",
      });
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-primary">
                Bem-vindo ao Éden! 🌱
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Logado como: {user.email}
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={testApiHealth} 
                  variant="outline" 
                  className="w-full"
                >
                  Testar API Health
                </Button>
                
                <Button 
                  onClick={fetchProfile} 
                  variant="outline" 
                  className="w-full"
                >
                  Carregar Perfil
                </Button>
                
                <Button 
                  onClick={handleSignOut} 
                  variant="destructive" 
                  className="w-full"
                >
                  Sair
                </Button>
              </div>

              {apiStatus && (
                <Card className="bg-muted">
                  <CardContent className="p-3">
                    <h4 className="font-semibold">API Status:</h4>
                    <pre className="text-xs">
                      {JSON.stringify(apiStatus, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {userProfile && (
                <Card className="bg-muted">
                  <CardContent className="p-3">
                    <h4 className="font-semibold">Perfil:</h4>
                    <pre className="text-xs">
                      {JSON.stringify(userProfile, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-primary">
            Éden 🌱
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="seu@email.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    placeholder="••••••••"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Seu nome"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    {...form.register("email")}
                    placeholder="seu@email.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-register">Senha</Label>
                  <Input
                    id="password-register"
                    type="password"
                    {...form.register("password")}
                    placeholder="••••••••"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={testApiHealth} 
              variant="ghost" 
              size="sm" 
              className="w-full"
            >
              Testar Conexão API
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
