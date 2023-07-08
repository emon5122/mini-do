import { PrismaClient } from '@prisma/client'
import { envVariables } from './env'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma || new PrismaClient()

if (envVariables.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}