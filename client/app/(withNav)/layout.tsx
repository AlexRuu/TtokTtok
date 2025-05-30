import PageContainer from "@/components/ui/page-container";
import "../globals.css";
import Navbar from "@/components/ui/navbar/navbar";
import Footer from "@/components/ui/footer";

export default function WithNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <PageContainer>{children}</PageContainer>
      </main>
      <Footer />
    </div>
  );
}
