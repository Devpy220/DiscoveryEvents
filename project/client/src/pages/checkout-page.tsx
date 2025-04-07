import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Ticket, Event, insertOrderSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCard, AlertCircle, ArrowLeft, Check } from "lucide-react";

const checkoutFormSchema = z.object({
  quantity: z.string().refine(val => {
    const num = parseInt(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "A quantidade deve ser maior que zero",
  }),
  paymentMethod: z.string().min(1, "Selecione um método de pagamento"),
  cardName: z.string().min(3, "Nome no cartão é obrigatório"),
  cardNumber: z.string().min(16, "Número de cartão inválido").max(19),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Data deve estar no formato MM/AA"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { ticketId } = useParams<{ ticketId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      quantity: "1",
      paymentMethod: "",
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });
  
  const { data: ticket, isLoading: isTicketLoading } = useQuery<Ticket>({
    queryKey: [`/api/tickets/${ticketId}`],
  });
  
  const { data: event, isLoading: isEventLoading } = useQuery<Event>({
    queryKey: [`/api/events/${ticket?.eventId}`],
    enabled: !!ticket,
  });
  
  const orderMutation = useMutation({
    mutationFn: async (data: { ticketId: number, quantity: number }) => {
      const res = await apiRequest("POST", "/api/orders", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      setIsSuccess(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao processar o pedido. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  const isLoading = isTicketLoading || isEventLoading || orderMutation.isPending;
  
  function onSubmit(data: CheckoutFormValues) {
    if (!ticket) return;
    
    const quantity = parseInt(data.quantity);
    if (quantity > ticket.available) {
      return toast({
        title: "Quantidade indisponível",
        description: `Há apenas ${ticket.available} ingressos disponíveis.`,
        variant: "destructive",
      });
    }
    
    orderMutation.mutate({
      ticketId: ticket.id,
      quantity,
    });
  }
  
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-md text-center">
            <div className="bg-green-100 rounded-full p-6 inline-block mx-auto mb-6">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Compra realizada com sucesso!</h1>
            <p className="text-gray-600 mb-8">
              Seus ingressos foram enviados para o seu email. Você também pode visualizá-los na sua área de perfil.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full" 
                onClick={() => navigate(`/events/${event?.id}`)}
              >
                Voltar ao evento
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/profile")}
              >
                Ver meus ingressos
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (isLoading && !ticket) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!ticket || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Ingresso não encontrado</h1>
            <p className="text-gray-600 mb-6">O ingresso que você está procurando não existe ou foi removido.</p>
            <Button onClick={() => navigate("/events")}>Ver todos os eventos</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPrice = ticket.price * parseInt(form.watch("quantity") || "1");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o evento
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Finalizar compra</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo do pedido</CardTitle>
                    <CardDescription>
                      Revise os detalhes do seu pedido
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative h-40 rounded-md overflow-hidden mb-2">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <p className="text-gray-500">
                        {format(new Date(event.startDate), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                      </p>
                      <p className="text-gray-500">{event.venue}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Detalhes do ingresso</h3>
                      <div className="flex justify-between mb-1">
                        <span>Tipo:</span>
                        <span className="font-medium">{ticket.type}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Preço unitário:</span>
                        <span className="font-medium">R$ {ticket.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Quantidade:</span>
                        <span className="font-medium">{form.watch("quantity") || "1"}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">R$ {totalPrice.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Payment Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Informações de pagamento</CardTitle>
                    <CardDescription>
                      Preencha os dados para finalizar sua compra
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantidade</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a quantidade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: Math.min(ticket.available, 10) }, (_, i) => (
                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Método de pagamento</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um método de pagamento" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="credit">Cartão de crédito</SelectItem>
                                  <SelectItem value="debit">Cartão de débito</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome no cartão</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Digite o nome como está no cartão" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número do cartão</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="0000 0000 0000 0000"
                                  maxLength={19}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Data de expiração</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="MM/AA" maxLength={5} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="123" maxLength={4} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full mt-6"
                          disabled={orderMutation.isPending}
                        >
                          {orderMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CreditCard className="mr-2 h-4 w-4" />
                          )}
                          Finalizar compra
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex-col items-start">
                    <Separator className="mb-4" />
                    <div className="flex justify-between w-full text-sm text-gray-500">
                      <span>Pagamento seguro</span>
                      <div className="flex space-x-2">
                        <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
