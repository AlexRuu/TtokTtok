import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import prismadb from "./prismadb";
import * as argon2 from "argon2";
import { NextResponse } from "next/server";

// Auth Helpers
async function fetchVerifiedEmail(
  provider: string,
  accessToken: string,
  profile?: any
): Promise<string | null> {
  try {
    if (provider === "github") {
      const res = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (!res.ok) throw new Error("GitHub email fetch failed");

      const emails: { email: string; verified: boolean; primary: boolean }[] =
        await res.json();
      return emails.find((e) => e.primary && e.verified)?.email || null;
    }

    if (provider === "google" && profile?.email_verified) {
      return profile.email;
    }

    if (provider === "discord" && profile?.verified) {
      return profile.email;
    }

    return null;
  } catch (error) {
    console.error(`${provider} email fetch error:`, error);
    throw new NextResponse("Error fetching verified email", { status: 500 });
  }
}

async function getOrCreateUserFromOAuth({
  profile,
  provider,
  providerAccountId,
  accessToken,
}: {
  profile: any;
  provider: string;
  providerAccountId: string;
  accessToken: string;
}) {
  let email = await fetchVerifiedEmail(provider, accessToken, profile);

  if (!email) {
    console.warn(`No verified email for ${provider} profile:`, profile);
    throw new Error("No verified email found");
  }

  email = email.toLowerCase().trim();

  if (!email) {
    console.warn(`No verified email found for provider: ${provider}`);
    throw new Error("No verified email found");
  }

  let user = await prismadb.user.findUnique({ where: { email } });

  if (!user) {
    const [firstName, ...lastNameArr] = profile.name?.split(" ") || [];
    const lastName = lastNameArr.join(" ");

    user = await prismadb.user.create({
      data: {
        email,
        firstName,
        lastName,
        image: profile.avatar_url || profile.picture || null,
      },
    });
  }

  await linkOAuthAccountIfNeeded(
    user.id,
    provider,
    providerAccountId,
    accessToken
  );

  await updateUserProfileIfChanged(user, profile);

  return {
    id: user.id,
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    email: user.email,
    image: user.image ?? null,
  };
}

async function linkOAuthAccountIfNeeded(
  userId: string,
  provider: string,
  providerAccountId: string,
  accessToken: string
) {
  try {
    console.log(`Linking account for userId: ${userId}, provider: ${provider}`);

    await prismadb.account.upsert({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      update: {
        access_token: accessToken,
      },
      create: {
        userId,
        provider,
        providerAccountId,
        access_token: accessToken,
        type: "oauth",
      },
    });

    console.log(`Successfully linked ${provider} account to user ${userId}`);
  } catch (error) {
    console.error("Error linking OAuth account:", error);
    throw new NextResponse("Error creating/updating account", { status: 500 });
  }
}

async function updateUserProfileIfChanged(user: any, profile: any) {
  const [firstName, ...lastNameArr] = profile.name?.split(" ") || [];
  const lastName = lastNameArr.join(" ");
  const image = profile.avatar_url || profile.picture || null;

  if (
    user.firstName !== firstName ||
    user.lastName !== lastName ||
    user.image !== image
  ) {
    await prismadb.user.update({
      where: { id: user.id },
      data: { firstName, lastName, image },
    });
  }
}

// Auth Config
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismadb),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile: async (profile, tokens) => {
        return await getOrCreateUserFromOAuth({
          profile,
          provider: "github",
          providerAccountId: profile.id,
          accessToken: tokens.access_token!,
        });
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile: async (profile, tokens) => {
        return await getOrCreateUserFromOAuth({
          profile,
          provider: "google",
          providerAccountId: profile.id,
          accessToken: tokens.access_token!,
        });
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      profile: async (profile, tokens) => {
        return await getOrCreateUserFromOAuth({
          profile,
          provider: "discord",
          providerAccountId: profile.id,
          accessToken: tokens.access_token!,
        });
      },
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }
        const normalizedEmail = credentials.email.toLowerCase().trim();

        const user = await prismadb.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user || !user.password) {
          throw new Error("User not found or password not set");
        }

        const isValid = await argon2.verify(
          user.password,
          credentials.password
        );

        return isValid ? { id: user.id, email: user.email } : null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};
