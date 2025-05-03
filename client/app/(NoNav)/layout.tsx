import "../globals.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("AuthLayout applied!"); // Add a log to verify if it's being applied
  return <>{children}</>;
}
