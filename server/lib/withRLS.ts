import prismadb from "@/lib/prismadb";
import type { PrismaClient, Prisma } from "@prisma/client";

interface Session {
  user?: {
    id?: string;
    role?: string | null;
    email?: string;
  };
}

const setRlsSessionVars = async (
  tx: PrismaClient,
  session: Session | null
): Promise<void> => {
  const userId = session?.user?.id ?? "";
  const userRole = session?.user?.role ?? "USER";
  const userEmail = session?.user?.email ?? "";

  await Promise.all([
    tx.$executeRawUnsafe(`SET LOCAL app.current_user_id = '${userId}'`),
    tx.$executeRawUnsafe(`SET LOCAL app.current_user_role = '${userRole}'`),
    tx.$executeRawUnsafe(`SET LOCAL app.current_user_email = '${userEmail}'`),
  ]);
};

export const withRls = async <T>(
  session: Session | null,
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> => {
  return prismadb.$transaction(async (tx) => {
    await setRlsSessionVars(tx, session);
    return await callback(tx);
  });
};
