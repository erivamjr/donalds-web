import { PrismaClient } from "@prisma/client";

declare global {
  // Isso garante que o TypeScript reconheça a variável global
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

// Evita criar múltiplas instâncias do Prisma no ambiente de desenvolvimento
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globalThis.cachedPrisma) {
    globalThis.cachedPrisma = new PrismaClient();
  }
  prisma = globalThis.cachedPrisma;
}

export const db = prisma;
