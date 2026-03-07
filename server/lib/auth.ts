import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import prismadb from "./prismadb";
import * as argon2 from "argon2";
import { getClientIp } from "./getIP";
import { rateLimit } from "./redis";

interface GitHubProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  email_verified?: never;
  verified?: never;
  picture?: never;
  username?: never;
}

interface GoogleProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
  email_verified: boolean;
  verified?: never;
  avatar_url?: never;
  username?: never;
}

interface DiscordProfile {
  id: string;
  username: string;
  name?: never;
  email: string;
  avatar: string;
  verified: boolean;
  avatar_url?: never;
  picture?: never;
  email_verified?: never;
}

type OAuthProfile = GitHubProfile | GoogleProfile | DiscordProfile;

// Auth Helpers
async function fetchVerifiedEmail(
  provider: string,
  accessToken: string,
  profile?: OAuthProfile,
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

    if (
      provider === "google" &&
      profile &&
      "email_verified" in profile &&
      profile.email_verified
    ) {
      return profile.email;
    }

    if (
      provider === "discord" &&
      profile &&
      "verified" in profile &&
      profile.verified
    ) {
      return profile.email;
    }

    return null;
  } catch (error) {
    console.error(`${provider} email fetch error:`, error);
    throw new Error("Error fetching verified email");
  }
}

async function getOrCreateUserFromOAuth({
  profile,
  provider,
  providerAccountId,
  accessToken,
}: {
  profile: OAuthProfile;
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

  let user = await prismadb.user.findUnique({ where: { email } });

  if (!user) {
    const displayName = "username" in profile ? profile.username : profile.name;
    const [firstName, ...lastNameArr] = displayName?.split(" ") || [];
    const lastName = lastNameArr.join(" ");
    const image =
      "avatar_url" in profile
        ? profile.avatar_url
        : "picture" in profile
          ? profile.picture
          : null;

    user = await prismadb.user.create({
      data: { email, firstName, lastName, image },
    });
  }

  await linkOAuthAccountIfNeeded(
    user.id,
    provider,
    providerAccountId,
    accessToken,
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
  accessToken: string,
) {
  try {
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
  } catch (error) {
    console.error("Error linking OAuth account:", error);
    throw new Error("Error creating/updating account");
  }
}

async function updateUserProfileIfChanged(
  user: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  },
  profile: OAuthProfile,
) {
  const displayName = "username" in profile ? profile.username : profile.name;
  const [firstName, ...lastNameArr] = displayName?.split(" ") || [];
  const lastName = lastNameArr.join(" ");
  const image =
    "avatar_url" in profile
      ? profile.avatar_url
      : "picture" in profile
        ? profile.picture
        : null;

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
      async authorize(credentials, req) {
        const ip = getClientIp(req);
        const email = credentials?.email?.toLowerCase().trim();

        if (!ip || !email) {
          return null;
        }

        const allowedByIp = await rateLimit(`ip:${ip}`, 10, 900);
        const allowedByEmail = await rateLimit(`signin_email:${email}`, 5, 900);

        if (!allowedByIp || !allowedByEmail) {
          throw new Error("Too many login attempts. Please try again later.");
        }

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
          credentials.password,
        );

        return isValid
          ? {
              id: user.id,
              email: user.email,
              name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
              role: user.role,
            }
          : null;
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
        token.name = user.name;
        token.role = user.role;
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
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
  },
};
