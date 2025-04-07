import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ChevronDown, 
  User, 
  Plus, 
  ShoppingCart, 
  LogOut, 
  HelpCircle, 
  Menu,
  CalendarDays,
  Search,
  Home,
  Ticket,
  Calendar,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Eventos", path: "/events", icon: CalendarDays },
    { label: "Buscar", path: "/events", icon: Search },
    { label: "Ingressos", path: "/profile", icon: Ticket },
    { label: "Ajuda", path: "/help", icon: HelpCircle },
  ];
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "backdrop-blur-xl bg-white/70 shadow-md" : "backdrop-blur-lg bg-white/60"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="font-bold text-xl md:text-2xl cursor-pointer flex items-center" 
            onClick={() => navigate("/")}
          >
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Discovery Event's
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.label}
                  className="flex flex-col items-center justify-center text-gray-700 hover:text-primary"
                  onClick={() => navigate(item.path)}
                  title={item.label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            })}
            
            {/* Categories dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col items-center justify-center text-gray-700 hover:text-primary" title="Categorias">
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs mt-1 flex items-center">
                    Categorias <ChevronDown className="h-3 w-3 ml-1" />
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/events?category=music")}>
                  Música
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/events?category=sports")}>
                  Esportes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/events?category=arts")}>
                  Arte & Teatro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/events?category=food")}>
                  Gastronomia
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/events?category=workshops")}>
                  Workshops
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/events")}>
                  Todos os eventos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User section */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/create-listing")}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Criar Evento
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-full p-2 h-9 w-9">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="h-4 w-4 mr-2" /> Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <ShoppingCart className="h-4 w-4 mr-2" /> Meus Ingressos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/help")}>
                        <HelpCircle className="h-4 w-4 mr-2" /> Ajuda
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                      >
                        {logoutMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <LogOut className="h-4 w-4 mr-2" />
                        )}
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    onClick={() => navigate("/auth")}
                  >
                    Entrar
                  </Button>
                  <Button 
                    variant="default"
                    onClick={() => navigate("/auth?tab=register")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Cadastrar
                  </Button>
                </>
              )}
            </div>
          </nav>
          
          {/* Mobile burger menu */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              className="h-9 w-9 p-0" 
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden backdrop-blur-xl bg-white/95 px-4 py-4 shadow-lg border-t border-gray-100">
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-5 gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={item.label}
                    className="flex flex-col items-center justify-center text-gray-700 hover:text-primary p-2"
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-6 w-6 mb-1" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="border-t border-gray-100 pt-3">
              <span className="text-gray-700 font-medium">Categorias</span>
              <div className="pl-4 mt-2 flex flex-col space-y-3">
                <span 
                  className="text-gray-600 hover:text-primary"
                  onClick={() => {
                    navigate("/events?category=music");
                    setMobileMenuOpen(false);
                  }}
                >
                  Música
                </span>
                <span 
                  className="text-gray-600 hover:text-primary"
                  onClick={() => {
                    navigate("/events?category=sports");
                    setMobileMenuOpen(false);
                  }}
                >
                  Esportes
                </span>
                <span 
                  className="text-gray-600 hover:text-primary"
                  onClick={() => {
                    navigate("/events?category=arts");
                    setMobileMenuOpen(false);
                  }}
                >
                  Arte & Teatro
                </span>
                <span 
                  className="text-gray-600 hover:text-primary"
                  onClick={() => {
                    navigate("/events?category=food");
                    setMobileMenuOpen(false);
                  }}
                >
                  Gastronomia
                </span>
                <span 
                  className="text-gray-600 hover:text-primary"
                  onClick={() => {
                    navigate("/events?category=workshops");
                    setMobileMenuOpen(false);
                  }}
                >
                  Workshops
                </span>
              </div>
            </div>
            
            {user ? (
              <div className="border-t border-gray-100 pt-3 flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate("/create-listing");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" /> Criar Evento
                </Button>
                
                <span 
                  className="text-gray-700 hover:text-primary flex items-center py-1"
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="h-4 w-4 mr-2" /> Perfil
                </span>
                
                <span 
                  className="text-gray-700 hover:text-primary flex items-center py-1"
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Meus Ingressos
                </span>
                
                <span 
                  className="text-gray-700 hover:text-primary flex items-center py-1"
                  onClick={() => {
                    navigate("/help");
                    setMobileMenuOpen(false);
                  }}
                >
                  <HelpCircle className="h-4 w-4 mr-2" /> Ajuda
                </span>
                
                <Button 
                  variant="outline"
                  className="flex items-center justify-center border-rose-500 text-rose-500 hover:bg-rose-50"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <LogOut className="h-4 w-4 mr-2" />
                  )}
                  Sair
                </Button>
              </div>
            ) : (
              <div className="border-t border-gray-100 pt-3 flex flex-col space-y-3">
                <Button 
                  variant="default"
                  onClick={() => {
                    navigate("/auth");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Entrar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    navigate("/auth?tab=register");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}