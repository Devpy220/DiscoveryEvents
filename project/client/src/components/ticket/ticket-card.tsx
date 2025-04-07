import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocation } from "wouter";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event, Ticket, Category } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface TicketCardProps {
  event: Event;
}

export default function TicketCard({ event }: TicketCardProps) {
  const [, navigate] = useLocation();
  
  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${event.categoryId}`],
  });
  
  const { data: tickets } = useQuery<Ticket[]>({
    queryKey: ["/api/tickets", { eventId: event.id }],
    queryFn: async () => {
      const res = await fetch(`/api/tickets?eventId=${event.id}`, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch tickets");
      }
      return res.json();
    },
  });
  
  // Calculate days until event
  const daysUntil = () => {
    const today = new Date();
    const eventDate = new Date(event.startDate);
    const diffTime = Math.abs(eventDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (eventDate < today) {
      return "Finalizado";
    }
    
    return `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
  };
  
  // Format date
  const formatEventDate = (date: Date | string) => {
    return format(new Date(date), "d 'de' MMM, yyyy", { locale: ptBR });
  };
  
  // Get the minimum ticket price
  const getMinPrice = () => {
    if (!tickets || tickets.length === 0) return null;
    
    const prices = tickets.map((ticket: Ticket) => ticket.price);
    return Math.min(...prices);
  };
  
  const minPrice = getMinPrice();
  
  return (
    <a 
      className="glass-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-48 object-cover object-center"
        />
        {category && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              {category.name}
            </Badge>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {daysUntil()}
        </div>
      </div>
      <div className="p-5 dark:bg-gray-800">
        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors dark:text-white">{event.title}</h3>
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
          <Calendar className="h-5 w-5 mr-1" />
          <span>
            {formatEventDate(event.startDate)}
            {event.endDate && ` a ${formatEventDate(event.endDate)}`}
          </span>
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
          <MapPin className="h-5 w-5 mr-1" />
          <span>{event.venue}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">A partir de</span>
            <p className="text-xl font-bold text-primary">
              {minPrice !== null ? `R$ ${minPrice.toFixed(2)}` : 'Indisponível'}
            </p>
          </div>
          <Button 
            variant="secondary"
            className="bg-gray-100 hover:bg-primary hover:text-white text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-primary font-medium"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/events/${event.id}`);
            }}
          >
            Ver ingressos
          </Button>
        </div>
      </div>
    </a>
  );
}
