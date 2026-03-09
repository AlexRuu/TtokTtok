import { cn } from "@/lib/utils";

type ScrollableResultsProps = {
  children: React.ReactNode;
  className?: string;
};

const ScrollableResults = ({ children, className }: ScrollableResultsProps) => {
  return (
    <div
      className={cn("relative max-h-80 overflow-y-auto px-1 py-2", className)}
    >
      <div className="space-y-1">{children}</div>
    </div>
  );
};

export default ScrollableResults;
