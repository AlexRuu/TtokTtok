import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-md bg-[#FFF9F5]">
        <Image
          src="/not-found.png"
          alt="Lost tteok at the bus stop"
          width={500}
          height={375}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      <h1 className="mt-8 text-xl sm:text-2xl md:text-3xl font-bold text-center text-[#6B4C3B]">
        Oops, you&apos;ve wandered off the path!
      </h1>

      <p className="mt-4 max-w-md text-center text-[#6B4C3B]/80">
        Let&apos;s take the trip back home together!
      </p>

      <Link
        href="/"
        className="mt-6 inline-block bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-semibold px-6 py-3 rounded-xl shadow transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
