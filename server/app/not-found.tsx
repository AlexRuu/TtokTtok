import Navbar from "@/components/navbar/navbar";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] rounded-xl shadow-md pb-20 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-xs mt-8 sm:max-w-sm md:max-w-2xs mx-auto rounded-2xl overflow-hidden bg-[#FFF9F5] shadow-md">
            <Image
              src="/not-found.png"
              alt="Lost tteok at the bus stop"
              width={500}
              height={375}
              className="w-full h-auto rounded-2xl object-contain"
              priority
            />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-8 text-center">
            Oops, you&apos;ve wandered off the path!
          </h1>
          <p className="text-base sm:text-lg text-center mt-4 max-w-md">
            Let&apos;s take the trip back home together!
          </p>
          <Link
            href="/"
            className="mt-6 inline-block bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-semibold px-6 py-3 rounded-xl shadow transition"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
