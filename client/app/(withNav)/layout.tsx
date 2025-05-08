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
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col pb-16 md:pb-0">
        <div className="flex-1">
          <PageContainer>{children}</PageContainer>
        </div>
        <Footer />
      </main>
    </>
  );
}
