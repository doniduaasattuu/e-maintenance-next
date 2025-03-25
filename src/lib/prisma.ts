import { PrismaClient } from "@prisma/client";

declare global {
  // This will prevent multiple instances in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use a global variable for Prisma in development
const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Enable logging for debugging
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
