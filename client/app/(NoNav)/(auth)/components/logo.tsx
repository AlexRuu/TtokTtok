import Image from "next/image";

const LogoTitle = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative w-20 h-20">
        <Image
          src="/tteok.png"
          alt="Ttok Logo"
          fill
          sizes="96px"
          className="object-contain"
        />
      </div>
      <div className="flex text-[2.5rem] sm:text-[2.75rem] font-semibold tracking-tight leading-none -mt-1">
        <span className="text-[#B75F45]">Ttok</span>
        <span className="text-[#D69E78]">Ttok</span>
      </div>
    </div>
  );
};

export default LogoTitle;
