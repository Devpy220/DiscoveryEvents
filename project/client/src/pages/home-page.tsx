import { useQuery } from "@tanstack/react-query";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/layout/hero-section";
import CategoryCard from "@/components/category/category-card";
import TicketCard from "@/components/ticket/ticket-card";
import CityCard from "@/components/city/city-card";
import { Loader2, Clock } from "lucide-react";
import { Category, City, Event } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HomePage() {
  const [, navigate] = useLocation();
  
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const { data: events, isLoading: isEventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });
  
  const { data: cities, isLoading: isCitiesLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Categories Section */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 dark:text-white">Explore por categoria</h2>
            
            {isCategoriesLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories?.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Featured Events Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold dark:text-white">Eventos em destaque</h2>
              <div className="flex mt-4 md:mt-0 space-x-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {}} 
                  className="p-2 rounded-full"
                >
                  <Clock className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {isEventsLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.slice(0, 3).map(event => (
                  <TicketCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">Nenhum evento disponível no momento</p>
              </div>
            )}
            
            <div className="text-center mt-10">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => navigate("/events")}
              >
                Ver todos os eventos
              </Button>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 dark:text-white">Como funciona</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
              Nossa plataforma torna a compra e venda de ingressos simples, segura e conveniente para todos.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Encontre</h3>
                <p className="text-gray-600 dark:text-gray-400">Busque entre milhares de eventos e encontre ingressos para qualquer ocasião.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Compre</h3>
                <p className="text-gray-600 dark:text-gray-400">Processo de compra seguro e rápido, com múltiplas opções de pagamento.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Receba</h3>
                <p className="text-gray-600 dark:text-gray-400">Ingressos digitais enviados diretamente para seu dispositivo móvel ou e-mail.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Divirta-se</h3>
                <p className="text-gray-600 dark:text-gray-400">Basta apresentar seu ingresso digital no dia do evento e aproveitar!</p>
              </div>
            </div>
            
            <div className="mt-14 text-center">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Quer vender ingressos?</h3>
              <Button 
                onClick={() => navigate("/create-listing")}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Comece a vender
              </Button>
            </div>
          </div>
        </section>
        
        {/* Cities Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 dark:text-white">Eventos por cidade</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
              Encontre eventos perto de você ou planeje sua próxima viagem.
            </p>
            
            {isCitiesLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {cities?.map(city => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
            )}
            
            <div className="text-center mt-10">
              <Button 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Ver todas as cidades
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary text-white hero-section">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Pronto para encontrar seu próximo evento?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/90">
              Junte-se a milhares de pessoas que já estão aproveitando shows, esportes e eventos culturais com o TicketHub.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => navigate("/events")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Explorar eventos
              </Button>
              <Button 
                onClick={() => navigate("/create-listing")}
                variant="outline"
                className="bg-transparent border border-white text-white hover:bg-white/10"
              >
                Vender ingressos
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
