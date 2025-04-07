import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser, InsertUser, LoginData } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Tipo para o contexto de autenticação
type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

// Criação do contexto com valor padrão null
const AuthContext = createContext<AuthContextType | null>(null);

// Provedor do contexto de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Busca o usuário atual na API
  const {
    data: user,
    error,
    isLoading,
    refetch
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      // Atualiza o cache com o usuário logado
      queryClient.setQueryData(["/api/user"], user);
      
      // Força uma atualização de todas as queries dependentes
      setIsRefreshing(true);
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo(a) de volta, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no login",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      // Atualiza o cache com o usuário registrado
      queryClient.setQueryData(["/api/user"], user);
      
      // Força uma atualização de todas as queries dependentes
      setIsRefreshing(true);
      
      toast({
        title: "Registro bem-sucedido",
        description: `Bem-vindo(a), ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no registro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      // Limpa o cache do usuário
      queryClient.setQueryData(["/api/user"], null);
      
      // Força uma atualização de todas as queries após logout
      queryClient.invalidateQueries();
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Redireciona para a página principal após logout
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no logout",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Efeito para forçar atualização quando isRefreshing mudar
  useEffect(() => {
    if (isRefreshing) {
      // Recarrega os dados do usuário
      refetch();
      setIsRefreshing(false);
    }
  }, [isRefreshing, refetch]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para utilizar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Exportando o contexto para uso em testes
export { AuthContext };