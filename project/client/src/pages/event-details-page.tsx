import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Footer from "@/components/layout/footer";
import { Event, Ticket, Category, City, TicketBatch, TicketCategory } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  Clock,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  const { data: event, isLoading: isEventLoading } = useQuery<Event>({
    queryKey: [`/api/events/${id}`],
  });
  
  const { data: ticketBatches, isLoading: isTicketsLoading } = useQuery<TicketBatch[]>({
    queryKey: ["/api/ticket-batches", { eventId: id }],
    queryFn: async () => {
      const res = await fetch(`/api/ticket-batches?eventId=${id}`, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch ticket batches");
      }
      return res.json();
    },
  });
  
  const { data: category, isLoading: isCategoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${event?.categoryId}`],
    enabled: !!event,
  });
  
  // O evento tem o city name integrado diretamente, não precisa buscar pelo cityId
  const { data: ticketCategories, isLoading: isCategoriesLoading } = useQuery<TicketCategory[]>({
    queryKey: ["/api/ticket-categories", { eventId: id }],
    enabled: !!event,
    queryFn: async () => {
      const res = await fetch(`/api/ticket-categories?eventId=${id}`, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch ticket categories");
      }
      return res.json();
    },
  });
  
  const isLoading = isEventLoading || isTicketsLoading || isCategoryLoading || isCategoriesLoading;
  
  // Format date for display
  const formatEventDate = (date: Date | string) => {
    return format(new Date(date), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Evento não encontrado</h1>
            <p className="text-gray-600 mb-6">O evento que você está procurando não existe ou foi removido.</p>
            <Button onClick={() => navigate("/events")}>Ver todos os eventos</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para eventos
          </Button>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Event Information */}
            <div className="md:col-span-2">
              <div className="mb-6">
                {category && (
                  <Badge className="mb-3" variant="secondary">
                    {category.name}
                  </Badge>
                )}
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <div className="flex items-center text-gray-500 mb-6">
                  <CalendarIcon className="h-5 w-5 mr-1" />
                  <span>{formatEventDate(event.startDate)}</span>
                  {event.endDate && (
                    <>
                      <span className="mx-2">até</span>
                      <span>{formatEventDate(event.endDate)}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  <span>{event.venue}, {event.city}</span>
                </div>
              </div>
              
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Sobre o evento</h2>
                <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Detalhes do evento</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <CalendarIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Data</h3>
                      <p className="text-gray-600">{formatEventDate(event.startDate)}</p>
                      {event.endDate && (
                        <p className="text-gray-600">até {formatEventDate(event.endDate)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Local</h3>
                      <p className="text-gray-600">{event.venue}</p>
                      <p className="text-gray-600">{event.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <TicketIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Organização</h3>
                      <p className="text-gray-600">TicketHub Eventos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Duração</h3>
                      <p className="text-gray-600">
                        {event.endDate 
                          ? "Vários dias" 
                          : "1 dia"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ticket Information */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Ingressos disponíveis</CardTitle>
                  <CardDescription>
                    Selecione o tipo de ingresso desejado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ticketBatches && ticketBatches.length > 0 ? (
                    ticketBatches.map((batch) => {
                      // Buscar o nome da categoria do ingresso
                      const category = ticketCategories?.find(cat => cat.id === batch.categoryId);
                      
                      return (
                        <div key={batch.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">
                                {category?.name || "Ingresso"} - {batch.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {batch.available} {batch.available === 1 ? "disponível" : "disponíveis"}
                              </p>
                            </div>
                            <p className="text-xl font-bold text-primary">R$ {batch.price.toFixed(2)}</p>
                          </div>
                          <div className="mt-4">
                            <Button 
                              onClick={() => {
                                if (user) {
                                  navigate(`/checkout/${batch.id}`);
                                } else {
                                  navigate("/auth");
                                }
                              }}
                              className="w-full"
                              disabled={batch.available === 0}
                            >
                              {batch.available > 0 ? "Comprar" : "Esgotado"}
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6">
                      <TicketIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Nenhum ingresso disponível</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <Separator className="mb-4" />
                  <div className="space-y-2 w-full">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>Pagamento seguro</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>Ingressos enviados por e-mail</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>Garantia de autenticidade</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
