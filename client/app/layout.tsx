import type { Metadata } from "next";
import ToastProvider from "@/providers/toast-provider";
import "./globals.css";
import AuthSessionProvider from "@/providers/session-provider";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "TtokTtok",
  description: "Bite Sized Korean Learning",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider session={session}>
          <ToastProvider />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
