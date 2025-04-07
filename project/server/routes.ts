import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertEventSchema, 
  insertTicketSchema, 
  insertOrderSchema,
  insertTicketCategorySchema,
  insertTicketBatchSchema
} from "@shared/schema";
import { sendTicketConfirmation, sendWelcomeEmail } from "./email";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Category routes
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    
    const category = await storage.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  });

  // City routes
  app.get("/api/cities", async (req, res) => {
    const cities = await storage.getCities();
    res.json(cities);
  });

  app.get("/api/cities/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid city ID" });
    }
    
    const city = await storage.getCityById(id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    
    res.json(city);
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    const { categoryId, city } = req.query;
    
    let events;
    if (categoryId) {
      const id = parseInt(categoryId as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      events = await storage.getEventsByCategory(id);
    } else if (city) {
      events = await storage.getEventsByCity(city as string);
    } else {
      events = await storage.getEvents();
    }
    
    res.json(events);
  });

  app.get("/api/events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    
    const event = await storage.getEventById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(event);
  });

  app.post("/api/events", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertEventSchema.parse({
        ...req.body,
        sellerId: req.user.id
      });
      
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  // Ticket Category routes
  app.get("/api/ticket-categories", async (req, res) => {
    const { eventId } = req.query;
    
    let categories;
    if (eventId) {
      const id = parseInt(eventId as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      categories = await storage.getTicketCategoriesByEventId(id);
    } else {
      categories = await storage.getTicketCategories();
    }
    
    res.json(categories);
  });

  app.get("/api/ticket-categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ticket category ID" });
    }
    
    const category = await storage.getTicketCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: "Ticket category not found" });
    }
    
    res.json(category);
  });

  app.post("/api/ticket-categories", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertTicketCategorySchema.parse(req.body);
      
      // Verificar se o evento existe
      const event = await storage.getEventById(validatedData.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Verificar se o usuário é o dono do evento
      if (event.sellerId !== req.user.id) {
        return res.status(403).json({ message: "You can only create ticket categories for your own events" });
      }
      
      const category = await storage.createTicketCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ticket category" });
    }
  });

  // Ticket Batch routes
  app.get("/api/ticket-batches", async (req, res) => {
    const { eventId, categoryId } = req.query;
    
    let batches;
    if (eventId) {
      const id = parseInt(eventId as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      batches = await storage.getTicketBatchesByEventId(id);
    } else if (categoryId) {
      const id = parseInt(categoryId as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      batches = await storage.getTicketBatchesByCategoryId(id);
    } else {
      batches = await storage.getTicketBatches();
    }
    
    res.json(batches);
  });

  app.get("/api/ticket-batches/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ticket batch ID" });
    }
    
    const batch = await storage.getTicketBatchById(id);
    if (!batch) {
      return res.status(404).json({ message: "Ticket batch not found" });
    }
    
    res.json(batch);
  });

  app.post("/api/ticket-batches", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertTicketBatchSchema.parse({
        ...req.body,
        sellerId: req.user.id,
        available: req.body.quantity // Inicialmente todos os ingressos estão disponíveis
      });
      
      // Verificar se a categoria de ingresso existe
      const category = await storage.getTicketCategoryById(validatedData.categoryId);
      if (!category) {
        return res.status(404).json({ message: "Ticket category not found" });
      }
      
      // Verificar se o evento existe
      const event = await storage.getEventById(validatedData.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Verificar se o usuário é o dono do evento
      if (event.sellerId !== req.user.id) {
        return res.status(403).json({ message: "You can only create ticket batches for your own events" });
      }
      
      const batch = await storage.createTicketBatch(validatedData);
      res.status(201).json(batch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket batch data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ticket batch" });
    }
  });

  // Ticket routes
  app.get("/api/tickets", async (req, res) => {
    const { eventId, sellerId } = req.query;
    
    let tickets;
    if (eventId) {
      const id = parseInt(eventId as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      tickets = await storage.getTicketsByEventId(id);
    } else if (sellerId) {
      const id = parseInt(sellerId as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid seller ID" });
      }
      tickets = await storage.getTicketsBySellerId(id);
    } else {
      tickets = await storage.getTickets();
    }
    
    res.json(tickets);
  });

  app.get("/api/tickets/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }
    
    const ticket = await storage.getTicketById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    res.json(ticket);
  });

  app.post("/api/tickets", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertTicketSchema.parse({
        ...req.body,
        sellerId: req.user.id
      });
      
      // Verificar se o lote de ingressos existe
      const batch = await storage.getTicketBatchById(validatedData.batchId);
      if (!batch) {
        return res.status(404).json({ message: "Ticket batch not found" });
      }
      
      // Verificar se o lote tem ingressos disponíveis
      if (batch.available <= 0) {
        return res.status(400).json({ message: "No tickets available in this batch" });
      }
      
      // Criar o ticket e reduzir a disponibilidade do lote
      const ticket = await storage.createTicket(validatedData);
      await storage.updateTicketBatchAvailability(batch.id, batch.available - 1);
      
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ticket" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const orders = await storage.getOrdersByBuyerId(req.user.id);
    res.json(orders);
  });

  app.get("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    const order = await storage.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Only allow users to see their own orders
    if (order.buyerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    res.json(order);
  });

  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { ticketId, quantity } = req.body;
      
      // Verificar se o ticket existe
      const ticket = await storage.getTicketById(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Verificar se o lote tem ingressos suficientes
      const batch = await storage.getTicketBatchById(ticket.batchId);
      if (!batch) {
        return res.status(404).json({ message: "Ticket batch not found" });
      }
      
      if (batch.available < quantity) {
        return res.status(400).json({ message: "Not enough tickets available" });
      }
      
      const totalPrice = ticket.price * quantity;
      
      const validatedData = insertOrderSchema.parse({
        buyerId: req.user.id,
        ticketId,
        quantity,
        totalPrice
      });
      
      const order = await storage.createOrder(validatedData);
      
      // Atualizar a disponibilidade do lote
      await storage.updateTicketBatchAvailability(batch.id, batch.available - quantity);
      
      // Obter informações do evento para o email
      const event = await storage.getEventById(ticket.eventId);
      if (event && req.user.email) {
        try {
          // Obter informações da categoria de ingresso
          const ticketCategory = await storage.getTicketCategoryById(batch.categoryId);
          
          // Enviar email de confirmação de forma assíncrona
          sendTicketConfirmation(
            req.user.email,
            req.user.username,
            {
              orderId: order.id,
              eventName: event.title,
              eventDate: event.startDate,
              ticketType: ticketCategory ? ticketCategory.name : batch.name,
              ticketPrice: ticket.price,
              quantity: quantity,
              totalPrice: totalPrice,
              purchaseDate: order.createdAt,
              venueLocation: `${event.venue}, ${event.street}, ${event.number}, ${event.city}`
            }
          ).then(sent => {
            if (!sent) {
              console.warn(`Falha ao enviar email de confirmação para pedido #${order.id}`);
            }
          }).catch(error => {
            console.error("Erro ao enviar email de confirmação:", error);
          });
        } catch (emailError) {
          console.error("Erro ao processar envio de email de confirmação:", emailError);
          // Não cancela a compra se o email falhar
        }
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
