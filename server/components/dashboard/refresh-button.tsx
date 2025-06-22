import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

const RefreshButton = ({
  refreshing,
  onClick,
}: {
  refreshing: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      variant={"ghost"}
      onClick={onClick}
      disabled={refreshing}
      aria-label="Refresh To Do List"
      className="p-1 rounded hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshCw
        className={`h-6 w-6 text-indigo-300 transition-transform duration-500 ease-in-out ${
          refreshing ? "animate-spin" : ""
        }`}
      />
    </Button>
  );
};

export default RefreshButton;
