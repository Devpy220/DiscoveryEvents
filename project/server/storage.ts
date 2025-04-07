import { 
  users, User, InsertUser, 
  categories, Category, InsertCategory, 
  cities, City, InsertCity, 
  events, Event, InsertEvent, 
  ticketCategories, TicketCategory, InsertTicketCategory,
  ticketBatches, TicketBatch, InsertTicketBatch,
  tickets, Ticket, InsertTicket, 
  orders, Order, InsertOrder 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
// ESM problema de importação, usando import dinâmico
import pg from 'pg';
const { Pool } = pg;

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Configurando o pool para o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Interface for storage operations
export interface IStorage {
  sessionStore: any; // Usando any para session.SessionStore

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // City operations
  getCities(): Promise<City[]>;
  getCityById(id: number): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  
  // Event operations
  getEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  getEventsByCategory(categoryId: number): Promise<Event[]>;
  getEventsByCity(cityId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Ticket Category operations
  getTicketCategories(): Promise<TicketCategory[]>;
  getTicketCategoryById(id: number): Promise<TicketCategory | undefined>;
  getTicketCategoriesByEventId(eventId: number): Promise<TicketCategory[]>;
  createTicketCategory(category: InsertTicketCategory): Promise<TicketCategory>;
  
  // Ticket Batch operations
  getTicketBatches(): Promise<TicketBatch[]>;
  getTicketBatchById(id: number): Promise<TicketBatch | undefined>;
  getTicketBatchesByEventId(eventId: number): Promise<TicketBatch[]>;
  getTicketBatchesByCategoryId(categoryId: number): Promise<TicketBatch[]>;
  createTicketBatch(batch: InsertTicketBatch): Promise<TicketBatch>;
  updateTicketBatchAvailability(id: number, quantity: number): Promise<TicketBatch | undefined>;
  
  // Ticket operations
  getTickets(): Promise<Ticket[]>;
  getTicketById(id: number): Promise<Ticket | undefined>;
  getTicketsByEventId(eventId: number): Promise<Ticket[]>;
  getTicketsBySellerId(sellerId: number): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByBuyerId(buyerId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private cities: Map<number, City>;
  private events: Map<number, Event>;
  private ticketCategories: Map<number, TicketCategory>;
  private ticketBatches: Map<number, TicketBatch>;
  private tickets: Map<number, Ticket>;
  private orders: Map<number, Order>;
  
  public sessionStore: any; // Usando any para session.SessionStore

  private userIdCounter: number;
  private categoryIdCounter: number;
  private cityIdCounter: number;
  private eventIdCounter: number;
  private ticketCategoryIdCounter: number;
  private ticketBatchIdCounter: number;
  private ticketIdCounter: number;
  private orderIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.cities = new Map();
    this.events = new Map();
    this.ticketCategories = new Map();
    this.ticketBatches = new Map();
    this.tickets = new Map();
    this.orders = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.cityIdCounter = 1;
    this.eventIdCounter = 1;
    this.ticketCategoryIdCounter = 1;
    this.ticketBatchIdCounter = 1;
    this.ticketIdCounter = 1;
    this.orderIdCounter = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });

    // Seed initial data
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categoriesData: InsertCategory[] = [
      { name: "Música", icon: "Music", color: "primary", eventCount: 428 },
      { name: "Esportes", icon: "ActivitySquare", color: "secondary", eventCount: 215 },
      { name: "Cinema", icon: "Film", color: "accent", eventCount: 187 },
      { name: "Stand-up", icon: "Mic2", color: "success", eventCount: 143 },
      { name: "Teatro", icon: "Theater", color: "warning", eventCount: 106 },
      { name: "Outros", icon: "MoreHorizontal", color: "gray", eventCount: 92 }
    ];
    
    for (const category of categoriesData) {
      this.createCategory(category);
    }

    // Seed cities
    const citiesData: InsertCity[] = [
      { name: "Rio de Janeiro", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325", eventCount: 246 },
      { name: "São Paulo", image: "https://images.unsplash.com/photo-1578002171197-b59e1f8c5ccf", eventCount: 312 },
      { name: "Belo Horizonte", image: "https://images.unsplash.com/photo-1564500601744-b4caa58f7e79", eventCount: 174 },
      { name: "Salvador", image: "https://images.unsplash.com/photo-1586904616934-593919871db4", eventCount: 156 }
    ];
    
    for (const city of citiesData) {
      this.createCity(city);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const newUser: User = { ...user, id, createdAt };
    this.users.set(id, newUser);
    return newUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // City operations
  async getCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }

  async getCityById(id: number): Promise<City | undefined> {
    return this.cities.get(id);
  }

  async createCity(city: InsertCity): Promise<City> {
    const id = this.cityIdCounter++;
    const newCity: City = { ...city, id };
    this.cities.set(id, newCity);
    return newCity;
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventsByCategory(categoryId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.categoryId === categoryId);
  }

  async getEventsByCity(cityId: number): Promise<Event[]> {
    // Na nova estrutura, eventos usam 'city' texto em vez de cityId
    return Array.from(this.events.values()).filter(event => {
      const city = this.cities.get(cityId);
      return city && event.city.toLowerCase() === city.name.toLowerCase();
    });
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    // Garantir que mediaType esteja definido
    const mediaType = event.mediaType || "image";
    const newEvent: Event = { 
      ...event, 
      id,
      mediaType 
    };
    this.events.set(id, newEvent);
    return newEvent;
  }
  
  // Ticket Category operations
  async getTicketCategories(): Promise<TicketCategory[]> {
    return Array.from(this.ticketCategories.values());
  }
  
  async getTicketCategoryById(id: number): Promise<TicketCategory | undefined> {
    return this.ticketCategories.get(id);
  }
  
  async getTicketCategoriesByEventId(eventId: number): Promise<TicketCategory[]> {
    return Array.from(this.ticketCategories.values())
      .filter(category => category.eventId === eventId);
  }
  
  async createTicketCategory(category: InsertTicketCategory): Promise<TicketCategory> {
    const id = this.ticketCategoryIdCounter++;
    const newCategory: TicketCategory = { ...category, id };
    this.ticketCategories.set(id, newCategory);
    return newCategory;
  }
  
  // Ticket Batch operations
  async getTicketBatches(): Promise<TicketBatch[]> {
    return Array.from(this.ticketBatches.values());
  }
  
  async getTicketBatchById(id: number): Promise<TicketBatch | undefined> {
    return this.ticketBatches.get(id);
  }
  
  async getTicketBatchesByEventId(eventId: number): Promise<TicketBatch[]> {
    return Array.from(this.ticketBatches.values())
      .filter(batch => batch.eventId === eventId);
  }
  
  async getTicketBatchesByCategoryId(categoryId: number): Promise<TicketBatch[]> {
    return Array.from(this.ticketBatches.values())
      .filter(batch => batch.categoryId === categoryId);
  }
  
  async createTicketBatch(batch: InsertTicketBatch): Promise<TicketBatch> {
    const id = this.ticketBatchIdCounter++;
    const createdAt = new Date();
    const newBatch: TicketBatch = { ...batch, id, createdAt };
    this.ticketBatches.set(id, newBatch);
    return newBatch;
  }
  
  async updateTicketBatchAvailability(id: number, quantity: number): Promise<TicketBatch | undefined> {
    const batch = this.ticketBatches.get(id);
    if (batch && batch.available >= quantity) {
      const updatedBatch = { ...batch, available: batch.available - quantity };
      this.ticketBatches.set(id, updatedBatch);
      return updatedBatch;
    }
    return undefined;
  }

  // Ticket operations
  async getTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  async getTicketById(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async getTicketsByEventId(eventId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.eventId === eventId);
  }

  async getTicketsBySellerId(sellerId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.sellerId === sellerId);
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const id = this.ticketIdCounter++;
    const createdAt = new Date();
    const newTicket: Ticket = { ...ticket, id, createdAt };
    this.tickets.set(id, newTicket);
    return newTicket;
  }

  async updateTicketAvailability(id: number, quantity: number): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (ticket && ticket.available >= quantity) {
      const updatedTicket = { ...ticket, available: ticket.available - quantity };
      this.tickets.set(id, updatedTicket);
      return updatedTicket;
    }
    return undefined;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByBuyerId(buyerId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.buyerId === buyerId);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const createdAt = new Date();
    const status = "completed";
    const newOrder: Order = { ...order, id, createdAt, status };
    this.orders.set(id, newOrder);
    
    // Update ticket availability
    this.updateTicketAvailability(order.ticketId, order.quantity);
    
    return newOrder;
  }
}

export class DatabaseStorage implements IStorage {
  public sessionStore: any; // Usando any para session.SessionStore
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
    
    // Seed initial data after migration
    this.seedInitialData();
  }

  private async seedInitialData() {
    // Verificar se já existem categorias e cidades no banco de dados
    const existingCategories = await this.getCategories();
    if (existingCategories.length === 0) {
      // Seed categories
      const categoriesData: InsertCategory[] = [
        { name: "Música", icon: "Music", color: "primary", eventCount: 428 },
        { name: "Esportes", icon: "ActivitySquare", color: "secondary", eventCount: 215 },
        { name: "Cinema", icon: "Film", color: "accent", eventCount: 187 },
        { name: "Stand-up", icon: "Mic2", color: "success", eventCount: 143 },
        { name: "Teatro", icon: "Theater", color: "warning", eventCount: 106 },
        { name: "Outros", icon: "MoreHorizontal", color: "gray", eventCount: 92 }
      ];
      
      for (const category of categoriesData) {
        await this.createCategory(category);
      }
    }

    const existingCities = await this.getCities();
    if (existingCities.length === 0) {
      // Seed cities
      const citiesData: InsertCity[] = [
        { name: "Rio de Janeiro", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325", eventCount: 246 },
        { name: "São Paulo", image: "https://images.unsplash.com/photo-1578002171197-b59e1f8c5ccf", eventCount: 312 },
        { name: "Belo Horizonte", image: "https://images.unsplash.com/photo-1564500601744-b4caa58f7e79", eventCount: 174 },
        { name: "Salvador", image: "https://images.unsplash.com/photo-1586904616934-593919871db4", eventCount: 156 }
      ];
      
      for (const city of citiesData) {
        await this.createCity(city);
      }
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  // City operations
  async getCities(): Promise<City[]> {
    return await db.select().from(cities);
  }

  async getCityById(id: number): Promise<City | undefined> {
    const result = await db.select().from(cities).where(eq(cities.id, id));
    return result[0];
  }

  async createCity(city: InsertCity): Promise<City> {
    const result = await db.insert(cities).values(city).returning();
    return result[0];
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async getEventsByCategory(categoryId: number): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.categoryId, categoryId));
  }

  async getEventsByCity(cityId: number): Promise<Event[]> {
    // Na nova estrutura, usar o nome da cidade para filtrar
    const cityResult = await db.select().from(cities).where(eq(cities.id, cityId));
    if (cityResult[0]) {
      return await db.select().from(events).where(sql`LOWER(${events.city}) = LOWER(${cityResult[0].name})`);
    }
    return [];
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    // Garantir que mediaType esteja definido
    const mediaType = event.mediaType || "image";
    const eventToInsert = { ...event, mediaType };
    
    const result = await db.insert(events).values(eventToInsert).returning();
    
    // Atualizar contador de eventos na categoria
    await db.update(categories)
      .set({eventCount: sql`${categories.eventCount} + 1`})
      .where(eq(categories.id, event.categoryId));
    
    // Encontrar a cidade pelo nome e atualizar seu contador
    const cityName = event.city;
    await db.update(cities)
      .set({eventCount: sql`${cities.eventCount} + 1`})
      .where(sql`LOWER(${cities.name}) = LOWER(${cityName})`);
    
    return result[0];
  }
  
  // Ticket Category operations
  async getTicketCategories(): Promise<TicketCategory[]> {
    return await db.select().from(ticketCategories);
  }
  
  async getTicketCategoryById(id: number): Promise<TicketCategory | undefined> {
    const result = await db.select().from(ticketCategories).where(eq(ticketCategories.id, id));
    return result[0];
  }
  
  async getTicketCategoriesByEventId(eventId: number): Promise<TicketCategory[]> {
    return await db.select().from(ticketCategories).where(eq(ticketCategories.eventId, eventId));
  }
  
  async createTicketCategory(category: InsertTicketCategory): Promise<TicketCategory> {
    const result = await db.insert(ticketCategories).values(category).returning();
    return result[0];
  }
  
  // Ticket Batch operations
  async getTicketBatches(): Promise<TicketBatch[]> {
    return await db.select().from(ticketBatches);
  }
  
  async getTicketBatchById(id: number): Promise<TicketBatch | undefined> {
    const result = await db.select().from(ticketBatches).where(eq(ticketBatches.id, id));
    return result[0];
  }
  
  async getTicketBatchesByEventId(eventId: number): Promise<TicketBatch[]> {
    return await db.select().from(ticketBatches).where(eq(ticketBatches.eventId, eventId));
  }
  
  async getTicketBatchesByCategoryId(categoryId: number): Promise<TicketBatch[]> {
    return await db.select().from(ticketBatches).where(eq(ticketBatches.categoryId, categoryId));
  }
  
  async createTicketBatch(batch: InsertTicketBatch): Promise<TicketBatch> {
    const result = await db.insert(ticketBatches).values(batch).returning();
    return result[0];
  }
  
  async updateTicketBatchAvailability(id: number, quantity: number): Promise<TicketBatch | undefined> {
    const batchResult = await db.select().from(ticketBatches).where(eq(ticketBatches.id, id));
    const batch = batchResult[0];
    
    if (batch && batch.available >= quantity) {
      const result = await db.update(ticketBatches)
        .set({available: batch.available - quantity})
        .where(eq(ticketBatches.id, id))
        .returning();
      
      return result[0];
    }
    
    return undefined;
  }

  // Ticket operations
  async getTickets(): Promise<Ticket[]> {
    return await db.select().from(tickets);
  }

  async getTicketById(id: number): Promise<Ticket | undefined> {
    const result = await db.select().from(tickets).where(eq(tickets.id, id));
    return result[0];
  }

  async getTicketsByEventId(eventId: number): Promise<Ticket[]> {
    return await db.select().from(tickets).where(eq(tickets.eventId, eventId));
  }

  async getTicketsBySellerId(sellerId: number): Promise<Ticket[]> {
    return await db.select().from(tickets).where(eq(tickets.sellerId, sellerId));
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const result = await db.insert(tickets).values(ticket).returning();
    return result[0];
  }

  async updateTicketAvailability(id: number, quantity: number): Promise<Ticket | undefined> {
    const ticketResult = await db.select().from(tickets).where(eq(tickets.id, id));
    const ticket = ticketResult[0];
    
    if (ticket && ticket.available >= quantity) {
      const result = await db.update(tickets)
        .set({available: ticket.available - quantity})
        .where(eq(tickets.id, id))
        .returning();
      
      return result[0];
    }
    
    return undefined;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getOrdersByBuyerId(buyerId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.buyerId, buyerId));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    // Atualizar disponibilidade de ingressos
    await this.updateTicketAvailability(order.ticketId, order.quantity);
    
    // Criar ordem
    const status = "completed";
    const result = await db.insert(orders).values({...order, status}).returning();
    
    return result[0];
  }
}

// Usar o DatabaseStorage ao invés do MemStorage
export const storage = new DatabaseStorage();
