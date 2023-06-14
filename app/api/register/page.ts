// Description: This code snippet defines a POST request handler for creating a new user.

// Import the NextResponse object from the next/server package for creating server responses
import { NextResponse } from "next/server";

// Import the bcrypt library for hashing passwords
import bcrypt from "bcrypt";

// Import the Prisma client instance
import prisma from '../../lib/prismadb';

// Define the POST request handler function
export async function POST(
  request: Request,
) {
  // Extract the request body
  const body = await request.json();
  const {
    email,
    name,
    password,
  } = body;

  // Hash the provided password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create a new user in the database using Prisma
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });

  // Return the newly created user as a JSON response using NextResponse
  return NextResponse.json(user);
}
