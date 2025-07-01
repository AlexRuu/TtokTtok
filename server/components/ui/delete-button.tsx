"use client";

import React, { forwardRef } from "react";
import { deleteItem } from "@/actions/delete-actions";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import useLoading from "@/hooks/use-loading";
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
  path: string;
  id: string;
  minimal?: boolean; // new prop
  className?: string;
  children?: React.ReactNode;
}

const DeleteButton = forwardRef<HTMLButtonElement, DeleteButtonProps>(
  ({ path, id, minimal = false, className = "", children }, ref) => {
    const router = useRouter();
    const { startLoading, stopLoading } = useLoading();

    const handleDelete = async (path: string, id: string) => {
      startLoading();
      await deleteItem(path, id);
      stopLoading();
      router.refresh();
    };

    if (minimal) {
      // Minimal style for dropdown usage
      return (
        <button
          type="button"
          onClick={() => handleDelete(path, id)}
          ref={ref}
          className={cn(
            "w-full flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold",
            "text-red-400 bg-transparent",
            "hover:bg-red-100 focus:bg-red-100",
            "focus:outline-none focus:ring-2 focus:ring-red-300",
            "transition-colors duration-150 ease-in-out",
            "cursor-pointer",
            className
          )}
        >
          {children ?? <Trash className="w-4 h-4" />}
          Delete
        </button>
      );
    }

    // Default full button style
    return (
      <Button
        size="sm"
        type="button"
        className={cn(
          "w-full font-medium bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400",
          className
        )}
        variant="destructive"
        onClick={() => handleDelete(path, id)}
        ref={ref}
      >
        <Trash />
        Delete
      </Button>
    );
  }
);

DeleteButton.displayName = "DeleteButton";

export default DeleteButton;
