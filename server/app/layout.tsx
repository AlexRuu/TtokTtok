import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import ToastProvider from "@/providers/toast-provider";

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
  title: "Ttok Ttok Admin",
  description: "Ttok Ttok App Admin",
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
  return (
    <html lang="en" className={pretendard.variable}>
      <body>
        <ToastProvider />
        <div className="flex flex-col min-h-screen">{children}</div>
      </body>
    </html>
  );
}
