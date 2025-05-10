import type { Metadata } from "next";
import ToastProvider from "@/providers/toast-provider";
import "./globals.css";
import AuthSessionProvider from "@/providers/session-provider";
import { getServerSession } from "next-auth";
import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "./fonts/PretendardVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Ttok Ttok",
  description: "Bite Sized Korean Learning",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en" className={pretendard.variable}>
      <body>
        <AuthSessionProvider session={session}>
          <ToastProvider />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
