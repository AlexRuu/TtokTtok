import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import prismadb from "./prismadb";
import * as argon2 from "argon2";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prismadb),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Look for user in database
        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        const password = credentials?.password;

        // Check for user and password
        if (!user || !user.password) return null;
        if (!password || typeof password !== "string") return null;

        const isValid = await argon2.verify(
          user.password,
          credentials!.password as string
        );

        // If user is not valid, return null
        if (!isValid) return null;

        // Return user if user is verified
        return { id: user.id, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // Check for session
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
