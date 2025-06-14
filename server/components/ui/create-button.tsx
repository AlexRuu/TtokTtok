import Link from "next/link";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CreateButtonProps {
  className?: string;
  path: string;
  title: string;
  icon: React.ReactNode;
}

const CreateButton: React.FC<CreateButtonProps> = ({
  path,
  title,
  icon,
  className,
}) => {
  return (
    <Button
      className={cn(
        "w-full font-semibold flex items-center justify-start gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400",
        className
      )}
    >
      <Link href={`/${path}/create`} className="flex items-center gap-2">
        {icon} {title}
      </Link>
    </Button>
  );
};

export default CreateButton;
