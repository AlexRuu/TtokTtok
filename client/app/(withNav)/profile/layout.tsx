import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SideBar from "./components/sidebar";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <main className="flex flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <SideBar />
        {children}
      </main>
    </div>
  );
}
