import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  insertEventSchema, 
  insertTicketCategorySchema, 
  insertTicketBatchSchema, 
  Category, 
  InsertEvent, 
  InsertTicketCategory, 
  InsertTicketBatch 
} from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, ImageIcon, Video } from "lucide-react";

// Esquema estendido para formulário de criação de evento
const createEventSchema = insertEventSchema.extend({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  image: z.string().url("URL da mídia inválida"),
  mediaType: z.enum(["image", "video"]).default("image"),
  city: z.string().min(2, "Informe a cidade"),
  street: z.string().min(3, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  venue: z.string().min(3, "O local deve ter pelo menos 3 caracteres"),
  complement: z.string().optional(),
  startDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Data inválida",
  }),
  endDate: z.string().optional(),
  categoryId: z.string().refine(val => !isNaN(parseInt(val)), {
    message: "Selecione uma categoria",
  }),
  totalTickets: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Informe a quantidade total de ingressos",
  }),
  ticketCategories: z.array(
    z.object({
      name: z.string().min(1, "Informe o nome da categoria"),
      description: z.string().optional(),
      batches: z.array(
        z.object({
          name: z.string().min(1, "Informe o nome do lote"),
          price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
            message: "O preço deve ser um valor válido",
          }),
          quantity: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
            message: "A quantidade deve ser maior que zero",
          }),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
      ).min(1, "Adicione pelo menos um lote")
    })
  ).min(1, "Adicione pelo menos uma categoria de ingresso"),
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;

export default function CreateListingPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      mediaType: "image",
      city: "",
      street: "",
      number: "",
      venue: "",
      complement: "",
      startDate: "",
      endDate: "",
      categoryId: "",
      totalTickets: "",
      ticketCategories: [
        {
          name: "",
          description: "",
          batches: [
            {
              name: "1º Lote",
              price: "",
              quantity: "",
              startDate: "",
              endDate: ""
            }
          ]
        }
      ]
    },
  });
  
  // Configuração para os arrays de campos
  const { fields: ticketCategoryFields, append: appendTicketCategory, remove: removeTicketCategory } = 
    useFieldArray({
      control: form.control,
      name: "ticketCategories"
    });
  
  // Função para criar um evento
  const createEventMutation = useMutation({
    mutationFn: async (data: Omit<InsertEvent, "sellerId">) => {
      const res = await apiRequest("POST", "/api/events", data);
      return await res.json();
    },
  });
  
  // Função para criar categorias de ingressos
  const createTicketCategoryMutation = useMutation({
    mutationFn: async (data: Omit<InsertTicketCategory, "id">) => {
      const res = await apiRequest("POST", "/api/ticket-categories", data);
      return await res.json();
    },
  });
  
  // Função para criar lotes de ingressos
  const createTicketBatchMutation = useMutation({
    mutationFn: async (data: Omit<InsertTicketBatch, "id" | "sellerId" | "createdAt">) => {
      const res = await apiRequest("POST", "/api/ticket-batches", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: "Sucesso!",
        description: "Seu evento e ingressos foram criados com sucesso.",
      });
      navigate("/");
    },
  });
  
  async function onSubmit(data: CreateEventFormValues) {
    try {
      // 1. Criar o evento primeiro
      const eventData: Omit<InsertEvent, "sellerId"> = {
        title: data.title,
        description: data.description,
        image: data.image,
        mediaType: data.mediaType,
        categoryId: parseInt(data.categoryId),
        city: data.city,
        street: data.street,
        number: data.number,
        venue: data.venue,
        complement: data.complement || undefined,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        totalTickets: parseInt(data.totalTickets),
      };
      
      const createdEvent = await createEventMutation.mutateAsync(eventData);
      
      // 2. Para cada categoria de ingresso
      for (const category of data.ticketCategories) {
        // Criar a categoria
        const categoryData: Omit<InsertTicketCategory, "id"> = {
          eventId: createdEvent.id,
          name: category.name,
          description: category.description || undefined,
        };
        
        const createdCategory = await createTicketCategoryMutation.mutateAsync(categoryData);
        
        // 3. Para cada lote dessa categoria
        for (const batch of category.batches) {
          // Criar o lote
          const batchData = {
            eventId: createdEvent.id,
            categoryId: createdCategory.id,
            name: batch.name,
            price: parseFloat(batch.price),
            quantity: parseInt(batch.quantity),
            available: parseInt(batch.quantity), // Inicialmente todos estão disponíveis
            startDate: batch.startDate ? new Date(batch.startDate) : undefined,
            endDate: batch.endDate ? new Date(batch.endDate) : undefined,
            active: true
          };
          
          await createTicketBatchMutation.mutateAsync(batchData);
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o evento. Tente novamente.",
        variant: "destructive",
      });
    }
  }
  
  const isLoading = isCategoriesLoading || 
                    createEventMutation.isPending || 
                    createTicketCategoryMutation.isPending || 
                    createTicketBatchMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Crie seu evento</h1>
              <p className="text-gray-600">Preencha o formulário abaixo para listar seu evento e vender ingressos</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <Tabs defaultValue="event" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="event">Evento</TabsTrigger>
                      <TabsTrigger value="location">Local</TabsTrigger>
                      <TabsTrigger value="tickets">Ingressos</TabsTrigger>
                    </TabsList>
                    
                    {/* Aba de Informações do Evento */}
                    <TabsContent value="event" className="space-y-6 pt-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título do Evento*</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Rock in Rio 2023" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição*</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descreva seu evento em detalhes" 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria*</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories?.map(category => (
                                  <SelectItem 
                                    key={category.id} 
                                    value={category.id.toString()}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="mediaType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Mídia*</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo de mídia" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="image">
                                    <div className="flex items-center">
                                      <ImageIcon className="w-4 h-4 mr-2" />
                                      <span>Imagem</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="video">
                                    <div className="flex items-center">
                                      <Video className="w-4 h-4 mr-2" />
                                      <span>Vídeo</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL da {form.watch("mediaType") === "image" ? "Imagem" : "Vídeo"}*</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={form.watch("mediaType") === "image" 
                                    ? "https://exemplo.com/imagem.jpg" 
                                    : "https://youtube.com/watch?v=..."}
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                {form.watch("mediaType") === "image" 
                                  ? "Insira um link para uma imagem de alta qualidade" 
                                  : "Insira um link do Youtube ou Vimeo"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Início*</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Término (opcional)</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    
                    {/* Aba de Local */}
                    <TabsContent value="location" className="space-y-6 pt-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade*</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Rio de Janeiro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rua/Avenida*</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Avenida Atlântica" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número*</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: 2500" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="venue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Local/Estabelecimento*</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Estádio Maracanã" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="complement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Setor Norte, Entrada B" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    {/* Aba de Ingressos */}
                    <TabsContent value="tickets" className="space-y-6 pt-4">
                      <FormField
                        control={form.control}
                        name="totalTickets"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade Total de Ingressos*</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 2000" {...field} />
                            </FormControl>
                            <FormDescription>
                              Quantidade total de ingressos disponíveis para o evento
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Novo seletor de distribuição automática */}
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h3 className="text-lg font-medium mb-3">Distribuição Automática de Lotes</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Distribua automaticamente seus ingressos em 3 categorias (Meia, Inteira e VIP) e lotes
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Selecione a distribuição dos lotes</h4>
                            <div className="flex flex-wrap gap-2">
                              {[25, 50, 75, 100].map((percent) => (
                                <Button
                                  key={percent}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const totalTickets = parseInt(form.getValues('totalTickets') || '0');
                                    if (!totalTickets) {
                                      toast({
                                        title: "Atenção",
                                        description: "Informe a quantidade total de ingressos primeiro",
                                        variant: "destructive",
                                      });
                                      return;
                                    }
                                    
                                    // Limpar categorias existentes
                                    while (ticketCategoryFields.length > 0) {
                                      removeTicketCategory(0);
                                    }
                                    
                                    // Criar três categorias: Meia, Inteira, VIP
                                    const categories = [
                                      { 
                                        name: "Meia Entrada", 
                                        description: "Meia entrada conforme lei", 
                                        percent: 30
                                      },
                                      { 
                                        name: "Inteira", 
                                        description: "Ingresso padrão", 
                                        percent: 50
                                      },
                                      { 
                                        name: "VIP", 
                                        description: "Acesso a área VIP", 
                                        percent: 20
                                      }
                                    ];
                                    
                                    // Criar lotes dividindo pela porcentagem selecionada
                                    const numLots = percent === 100 ? 1 : percent === 75 ? 2 : percent === 50 ? 3 : 4;
                                    
                                    categories.forEach(category => {
                                      const catTickets = Math.floor(totalTickets * (category.percent / 100));
                                      const batches = [];
                                      
                                      // Distribuir os ingressos pelos lotes
                                      for (let i = 1; i <= numLots; i++) {
                                        const lotTickets = Math.floor(catTickets / numLots);
                                        // Ajustar o preço com base na categoria e número do lote
                                        let basePrice = category.name === "Meia Entrada" ? 25 : 
                                                       category.name === "Inteira" ? 50 : 100;
                                        // Aumentar o preço a cada lote
                                        const lotPrice = basePrice * (1 + (i-1) * 0.25);
                                        
                                        batches.push({
                                          name: `${i}º Lote`,
                                          price: lotPrice.toString(),
                                          quantity: lotTickets.toString(),
                                          startDate: "",
                                          endDate: ""
                                        });
                                      }
                                      
                                      appendTicketCategory({
                                        name: category.name,
                                        description: category.description,
                                        batches: batches
                                      });
                                    });
                                    
                                    toast({
                                      title: "Lotes criados",
                                      description: `Ingressos distribuídos em ${numLots} lotes para as 3 categorias`,
                                    });
                                  }}
                                >
                                  {percent}% ({Math.ceil(4 * (percent/100))} lote{percent < 100 ? 's' : ''})
                                </Button>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Escolha a porcentagem para definir o número de lotes
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Categorias de Ingressos</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendTicketCategory({
                              name: "",
                              description: "",
                              batches: [{ name: "1º Lote", price: "", quantity: "", startDate: "", endDate: "" }]
                            })}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Categoria
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {ticketCategoryFields.map((categoryField, categoryIndex) => (
                            <Card key={categoryField.id}>
                              <CardHeader className="px-5 py-4 flex flex-row items-center justify-between space-y-0">
                                <h4 className="font-medium">Categoria {categoryIndex + 1}</h4>
                                {ticketCategoryFields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeTicketCategory(categoryIndex)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </CardHeader>
                              <CardContent className="px-5 py-3 space-y-4">
                                <FormField
                                  control={form.control}
                                  name={`ticketCategories.${categoryIndex}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nome da Categoria*</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Ex: VIP, Pista, Camarote" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`ticketCategories.${categoryIndex}.description`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Descrição (opcional)</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Descreva os benefícios desta categoria" 
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value="lotes">
                                    <AccordionTrigger>Lotes de Ingressos</AccordionTrigger>
                                    <AccordionContent>
                                      {/* Aqui vamos usar useFieldArray aninhado para os lotes */}
                                      {form.watch(`ticketCategories.${categoryIndex}.batches`)?.map((_, batchIndex) => (
                                        <div key={batchIndex} className="p-4 border rounded-md mb-4">
                                          <div className="flex justify-between items-center mb-3">
                                            <h5 className="font-medium">Lote {batchIndex + 1}</h5>
                                            {form.watch(`ticketCategories.${categoryIndex}.batches`).length > 1 && (
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                  const currentBatches = form.getValues(`ticketCategories.${categoryIndex}.batches`);
                                                  const newBatches = [...currentBatches];
                                                  newBatches.splice(batchIndex, 1);
                                                  form.setValue(`ticketCategories.${categoryIndex}.batches`, newBatches);
                                                }}
                                              >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                              </Button>
                                            )}
                                          </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                              control={form.control}
                                              name={`ticketCategories.${categoryIndex}.batches.${batchIndex}.name`}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Nome do Lote*</FormLabel>
                                                  <FormControl>
                                                    <Input placeholder="Ex: 1º Lote" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                            
                                            <FormField
                                              control={form.control}
                                              name={`ticketCategories.${categoryIndex}.batches.${batchIndex}.price`}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Preço (R$)*</FormLabel>
                                                  <FormControl>
                                                    <Input placeholder="Ex: 150.00" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                          
                                          <div className="mt-3">
                                            <FormField
                                              control={form.control}
                                              name={`ticketCategories.${categoryIndex}.batches.${batchIndex}.quantity`}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Quantidade*</FormLabel>
                                                  <FormControl>
                                                    <Input placeholder="Ex: 100" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                            <FormField
                                              control={form.control}
                                              name={`ticketCategories.${categoryIndex}.batches.${batchIndex}.startDate`}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Data de Início do Lote</FormLabel>
                                                  <FormControl>
                                                    <Input type="datetime-local" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                            
                                            <FormField
                                              control={form.control}
                                              name={`ticketCategories.${categoryIndex}.batches.${batchIndex}.endDate`}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Data de Término do Lote</FormLabel>
                                                  <FormControl>
                                                    <Input type="datetime-local" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                      
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-full mt-2"
                                        onClick={() => {
                                          const currentBatches = form.getValues(`ticketCategories.${categoryIndex}.batches`) || [];
                                          const nextLotNumber = currentBatches.length + 1;
                                          form.setValue(`ticketCategories.${categoryIndex}.batches`, [
                                            ...currentBatches, 
                                            { 
                                              name: `${nextLotNumber}º Lote`, 
                                              price: "", 
                                              quantity: "", 
                                              startDate: "", 
                                              endDate: "" 
                                            }
                                          ]);
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar Lote
                                      </Button>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate("/")}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Evento
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
