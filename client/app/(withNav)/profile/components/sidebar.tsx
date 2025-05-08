"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CircleUserRound,
  BookOpen,
  Settings,
  LogOut,
  Bookmark,
  BookCheck,
  Milestone,
} from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { name: "Overview", href: "/profile", icon: CircleUserRound },
  { name: "Progress", href: "/profile/progress", icon: Milestone },
  { name: "My Vocabulary", href: "/profile/vocabulary", icon: BookOpen },
  { name: "Needs Review", href: "/profile/needs-review", icon: Bookmark },
  { name: "Quiz Results", href: "/profile/quiz-results", icon: BookCheck },
  { name: "Settings", href: "/profile/settings", icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  return (
    <div className="relative">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between h-[90vh] border-[#E8DCD5] shadow-sm w-64 rounded-md bg-[#FAF3F0] border-r p-4 mt-4">
        <div className="text-2xl font-semibold mb-8">
          <span className="text-gray-700">Profile</span>
        </div>
        <nav className="space-y-2 text-sm">
          {sidebarLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg transition hover:bg-[#f2dfd7]",
                pathname === href &&
                  "bg-[#F2DFD7] text-[#A65A3A] font-medium border-l-4 border-[#A65A3A] pl-3"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto text-base font-semibold text-left text-red-600 hover:bg-[#f2dfd7] px-4 py-2 rounded-lg transition hover:cursor-pointer"
        >
          <LogOut className="inline w-4 h-4 mr-2" />
          Logout
        </button>
      </aside>
      {/* Mobile sidebar at the bottom */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#faf3f0ef] border-t-2 border-[#E8DCD5] z-50">
        <div className="overflow-x-auto">
          <aside className="flex justify-center">
            <div className="flex min-w-max space-x-2 py-3 px-2 snap-x snap-mandatory">
              {sidebarLinks.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    "flex flex-col items-center text-xs px-3 py-2 snap-start rounded-md hover:bg-[#A65A3A]/10 transition",
                    pathname === href && "text-[#A65A3A] font-semibold"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:block">{name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex flex-col items-center text-xs text-red-600 font-semibold py-2 px-3 snap-start hover:bg-[#f2dfd7] rounded-md transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
