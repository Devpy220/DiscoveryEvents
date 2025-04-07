import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import TicketCard from "@/components/ticket/ticket-card";
import { Event, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

export default function ListingPage() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  // Parse URL parameters
  const params = new URLSearchParams(location.split("?")[1]);
  const categoryParam = params.get("category");
  
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const { data: events, isLoading: isEventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", categoryParam ? { categoryId: categoryParam } : null],
    queryFn: async ({ queryKey }) => {
      const categoryId = (queryKey[1] as any)?.categoryId;
      const url = categoryId 
        ? `/api/events?categoryId=${categoryId}` 
        : "/api/events";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }
      return res.json();
    },
  });
  
  // Filter events based on search term
  const filteredEvents = events?.filter(event => {
    const matchesSearch = searchTerm
      ? event.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesCategory = selectedCategory && selectedCategory !== "all"
      ? event.categoryId === parseInt(selectedCategory)
      : true;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Encontre ingressos para seus eventos favoritos</h1>
            
            {/* Search and Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar eventos, shows, esportes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div className="md:w-48">
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="button">
                  Buscar
                </Button>
              </div>
            </div>
            
            {/* Results Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {categoryParam 
                  ? `Eventos na categoria: ${categories?.find(c => c.id === parseInt(categoryParam))?.name || "Carregando..."}`
                  : "Todos os eventos"}
              </h2>
              
              {isEventsLoading ? (
                <div className="flex justify-center my-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredEvents && filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <TicketCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Nenhum evento encontrado</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
