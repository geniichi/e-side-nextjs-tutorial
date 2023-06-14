// Description: This code snippet configures and exports the Prisma client for database operations.

import { PrismaClient } from '@prisma/client'

// Declare a global variable to hold the Prisma client instance
declare global {
  var prisma: PrismaClient | undefined
}

// Create a Prisma client instance if it doesn't already exist
const client = globalThis.prisma || new PrismaClient()

// Set the global prisma variable only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client
}

// Export the Prisma client instance
export default client
