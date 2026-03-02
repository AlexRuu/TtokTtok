import prismadb from "@/lib/prismadb";
import type { Prisma } from "@prisma/client";

interface Session {
  user?: {
    id?: string;
    role?: string | null;
    email?: string;
  };
}

const setRlsSessionVars = async (
  tx: Prisma.TransactionClient,
  session: Session | null,
): Promise<void> => {
  const userId = session?.user?.id ?? "";
  const userRole = session?.user?.role ?? "USER";
  const userEmail = session?.user?.email ?? "";

  await Promise.all([
    tx.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, true)`,
    tx.$executeRaw`SELECT set_config('app.current_user_role', ${userRole}, true)`,
    tx.$executeRaw`SELECT set_config('app.current_user_email', ${userEmail}, true)`,
  ]);
};

export const withRls = async <T>(
  session: Session | null,
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> => {
  return prismadb.$transaction(async (tx) => {
    await setRlsSessionVars(tx, session);
    return callback(tx);
  });
};
