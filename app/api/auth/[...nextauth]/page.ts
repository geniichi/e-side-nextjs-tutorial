// Description: Configuration for implementing authentication in a Next.js application using NextAuth.

import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GithubProvider from "next-auth/providers/github"
import prisma from '../../../lib/prismadb'

// Authentication options
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),  // Adapter for connecting NextAuth to Prisma
  providers: [
    // GitHub provider configuration
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,  // GitHub client ID
      clientSecret: process.env.GITHUB_SECRET as string  // GitHub client secret
    }),
    // Credentials provider configuration
    CredentialsProvider({
      name: 'credentials',  // Provider name
      credentials: {
        email: { label: 'email', type: 'text' },  // Configuration for email input
        password: { label: 'password', type: 'password'}  // Configuration for password input
      },
      async authorize(credentials) {
        // Authorization function for validating credentials
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');  // Throw an error if email or password is missing
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');  // Throw an error if user or hashed password is not found
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');  // Throw an error if the provided password is incorrect
        }

        return user;  // Return the user object if credentials are valid
      }
    })
  ],
  pages: {
    signIn: '/',  // Set the sign-in page to '/'
  },
  callbacks: {
    // Session callback
    session: ({ session, token }) => {
      console.log('Session Callback', { session, token })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey
        }
      }
    },
    // JWT callback
    jwt: ({ token, user }) => {
      console.log('JWT Callback', { token, user })
      if (user) {
        const u = user as unknown as any
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey
        }
      }
      return token
    }
  },
  debug: process.env.NODE_ENV === 'development',  // Enable debugging in development mode
  session: {
    strategy: "jwt",  // Set the session strategy to "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,  // Secret used for token encryption and signing
}

// NextAuth handler
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
