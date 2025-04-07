import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HeroSection() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navegar para página de resultados com query params
    navigate(`/events?q=${searchQuery}&category=${category}&location=${location}`);
  };
  
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-r from-primary/10 to-purple-500/10">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Seu próximo evento está aqui
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-10">
            Descubra e compre ingressos para os melhores eventos. Shows, esportes, teatro, 
            workshops e muito mais em um só lugar.
          </p>
          
          {/* Search form with glass effect */}
          <div className="w-full max-w-4xl backdrop-blur-sm bg-white/70 rounded-xl p-6 shadow-lg border border-gray-100">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="O que você está procurando?"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-1 gap-4">
                <div className="w-1/2 relative">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-10">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas categorias</SelectItem>
                      <SelectItem value="music">Música</SelectItem>
                      <SelectItem value="sports">Esportes</SelectItem>
                      <SelectItem value="arts">Arte & Teatro</SelectItem>
                      <SelectItem value="food">Gastronomia</SelectItem>
                      <SelectItem value="workshops">Workshops</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-1/2 relative">
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-10">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Localização" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas cidades</SelectItem>
                      <SelectItem value="sao-paulo">São Paulo</SelectItem>
                      <SelectItem value="rio-de-janeiro">Rio de Janeiro</SelectItem>
                      <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
                      <SelectItem value="brasilia">Brasília</SelectItem>
                      <SelectItem value="salvador">Salvador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button type="submit" className="md:w-auto">
                Buscar
              </Button>
            </form>
          </div>
          
          {/* Featured Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 mt-14 max-w-3xl mx-auto text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">10k+</p>
              <p className="text-gray-600">Eventos</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">500+</p>
              <p className="text-gray-600">Locais</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">1M+</p>
              <p className="text-gray-600">Usuários</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">50+</p>
              <p className="text-gray-600">Cidades</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}