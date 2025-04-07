import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema, loginSchema, LoginData, InsertUser } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Extended schemas for frontend validation
const extendedLoginSchema = loginSchema.extend({
  username: z.string().min(3, "Usuário deve ter no mínimo 3 caracteres"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const extendedRegisterSchema = insertUserSchema.extend({
  username: z.string().min(3, "Usuário deve ter no mínimo 3 caracteres"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  email: z.string().email("Email inválido"),
  fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof extendedRegisterSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  
  // Verificar se existe um parâmetro 'tab' na URL para definir a aba ativa
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'register') {
      setActiveTab('register');
    }
  }, []);
  
  // Efeito para redirecionar se já estiver logado ou após autenticação bem-sucedida
  useEffect(() => {
    if (user) {
      // Redirecionar para a página principal após login/registro bem-sucedido
      navigate("/");
    }
  }, [user, navigate]);
  
  // Efeito adicional para monitorar o status das mutations
  useEffect(() => {
    if (loginMutation.isSuccess || registerMutation.isSuccess) {
      // Após login/registro bem-sucedido, forçar a navegação
      navigate("/");
    }
  }, [loginMutation.isSuccess, registerMutation.isSuccess, navigate]);
  
  // Login form
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(extendedLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(extendedRegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      fullName: "",
      confirmPassword: "",
      profilePicture: "",
    },
  });
  
  function onLoginSubmit(data: LoginData) {
    loginMutation.mutate(data);
  }
  
  function onRegisterSubmit(data: RegisterFormValues) {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData as InsertUser);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            {/* Left side - Authentication Forms */}
            <div>
              <Card className="backdrop-blur-xl bg-white/60 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Bem-vindo ao Discovery Event's</CardTitle>
                  <CardDescription className="text-gray-700">
                    Entre para comprar ou vender ingressos para os melhores eventos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="login">Entrar</TabsTrigger>
                      <TabsTrigger value="register">Cadastrar</TabsTrigger>
                    </TabsList>
                    
                    {/* Login Tab */}
                    <TabsContent value="login">
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Usuário</FormLabel>
                                <FormControl>
                                  <Input placeholder="Digite seu usuário" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Digite sua senha" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Entrar
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                    
                    {/* Register Tab */}
                    <TabsContent value="register">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                          <FormField
                            control={registerForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl>
                                  <Input placeholder="Digite seu nome completo" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Digite seu email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Usuário</FormLabel>
                                <FormControl>
                                  <Input placeholder="Digite um nome de usuário" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Digite uma senha" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirmar Senha</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Confirme sua senha" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Cadastrar
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-500">
                    Ao continuar, você concorda com os Termos de Uso e Política de Privacidade
                  </p>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right side - Hero Section */}
            <div className="relative overflow-hidden rounded-lg p-0 hidden md:block">
              {/* Imagem de fundo do show */}
              <div className="w-full h-full absolute inset-0 bg-black">
                <img 
                  src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1000&q=80" 
                  alt="Concerto musical com luzes coloridas" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-black/80"></div>
              </div>
              
              {/* Conteúdo sobreposição */}
              <div className="relative p-8 text-white z-10">
                <div className="max-w-md mx-auto">
                  <h2 className="text-3xl font-bold mb-6 drop-shadow-lg">O melhor lugar para comprar e vender ingressos</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start drop-shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Acesso a milhares de eventos em todo o Brasil</span>
                    </li>
                    <li className="flex items-start drop-shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Compra segura com garantia de autenticidade</span>
                    </li>
                    <li className="flex items-start drop-shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Receba seus ingressos digitais instantaneamente</span>
                    </li>
                    <li className="flex items-start drop-shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Venda seus ingressos de forma fácil e rápida</span>
                    </li>
                  </ul>
                  
                  <div className="mt-8 p-4 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-lg">
                    <p className="italic text-white">
                      "Comprei meus ingressos para o Rock in Rio em menos de 5 minutos. 
                      Processo super fácil e rápido!"
                    </p>
                    <div className="flex items-center mt-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold">A</div>
                      <div className="ml-2">
                        <p className="font-semibold">Ana Silva</p>
                        <p className="text-sm text-white/80">Rio de Janeiro</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
