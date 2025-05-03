import type { Metadata } from "next";
import ToastProvider from "@/providers/toast-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ttok Ttok",
  description: "Bite Sized Korean Learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
