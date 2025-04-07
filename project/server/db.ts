import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Criar a conexão com o banco de dados
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });