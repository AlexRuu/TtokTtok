import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const PageContainer = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageContainer;
