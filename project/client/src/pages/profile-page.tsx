import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Order, Event, Ticket } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  TicketIcon, 
  CalendarIcon, 
  MapPinIcon,
  User, 
  LogOut,
  Settings,
  ShoppingBag,
  Mail,
  Clock,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const { data: orders, isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });
  
  if (!user) {
    navigate("/auth");
    return null;
  }
  
  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      }
    });
  }
  
  const initials = user.fullName
    ? user.fullName.split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 mb-8">
              <Avatar className="h-24 w-24">
                {user.profilePicture && <AvatarImage src={user.profilePicture} alt={user.fullName || user.username} />}
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-grow">
                <h1 className="text-3xl font-bold">{user.fullName}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{user.username}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 min-w-32">
                <Button variant="outline" className="w-full" onClick={() => {}}>
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-red-500 hover:text-red-600" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4 mr-2" />
                  )}
                  Sair
                </Button>
              </div>
            </div>
            
            <div className="mt-8">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-8">
                  <TabsTrigger value="tickets">
                    <TicketIcon className="h-4 w-4 mr-2" />
                    Meus Ingressos
                  </TabsTrigger>
                  <TabsTrigger value="orders">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Compras
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="tickets">
                  <div className="mb-4">
                    <h2 className="text-2xl font-semibold">Meus ingressos</h2>
                    <p className="text-gray-600">Gerencie todos os seus ingressos</p>
                  </div>
                  
                  {isOrdersLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {orders.map(order => (
                        <OrderTicketCard key={order.id} order={order} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <TicketIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium">Nenhum ingresso encontrado</h3>
                      <p className="text-gray-500 mb-6">Você ainda não comprou nenhum ingresso</p>
                      <Button onClick={() => navigate("/events")}>
                        Explorar eventos
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="orders">
                  <div className="mb-4">
                    <h2 className="text-2xl font-semibold">Minhas compras</h2>
                    <p className="text-gray-600">Histórico de todas as suas compras</p>
                  </div>
                  
                  {isOrdersLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <Card key={order.id}>
                          <CardContent className="py-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Pedido #{order.id}</p>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(order.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-primary">R$ {order.totalPrice.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">
                                  {order.quantity} {order.quantity === 1 ? "ingresso" : "ingressos"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium">Nenhuma compra encontrada</h3>
                      <p className="text-gray-500 mb-6">Você ainda não realizou nenhuma compra</p>
                      <Button onClick={() => navigate("/events")}>
                        Explorar eventos
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Order Ticket Card component
function OrderTicketCard({ order }: { order: Order }) {
  const [, navigate] = useLocation();
  
  const { data: ticket } = useQuery<Ticket>({
    queryKey: [`/api/tickets/${order.ticketId}`],
  });
  
  const { data: event } = useQuery<Event>({
    queryKey: [`/api/events/${ticket?.eventId}`],
    enabled: !!ticket,
  });
  
  if (!ticket || !event) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 bg-gray-100 relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
          {ticket.type}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-1">{event.title}</h3>
        
        <div className="flex flex-col gap-1 mt-2 text-sm text-gray-600">
          <div className="flex items-center">
            <CalendarIcon className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              {format(new Date(event.startDate), "d MMM yyyy, HH:mm", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center">
            <TicketIcon className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{order.quantity} {order.quantity === 1 ? "ingresso" : "ingressos"}</span>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-primary font-semibold">
          Total: R$ {order.totalPrice.toFixed(2)}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/events/${event.id}`)}
        >
          Ver evento
        </Button>
      </CardFooter>
    </Card>
  );
}
