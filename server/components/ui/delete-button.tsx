"use client";

import React, { forwardRef, useState } from "react";
import { deleteItem } from "@/actions/delete-actions";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import useLoading from "@/hooks/use-loading";
import { cn } from "@/lib/utils";
import { AlertModal } from "./alert-modal";

interface DeleteButtonProps {
  path: string;
  id: string;
  minimal?: boolean;
  title: string;
  className?: string;
  children?: React.ReactNode;
}

const DeleteButton = forwardRef<HTMLButtonElement, DeleteButtonProps>(
  ({ path, id, minimal = false, className = "", children, title }, ref) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
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
        <>
          <AlertModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={title}
            description="This action is permanent. Are you sure you want to continue?"
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(path, id)}
            variant="destructive"
          />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            ref={ref}
            className={cn(
              "w-full flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold",
              "text-pink-700 bg-transparent",
              "hover:bg-pink-100 focus:bg-pink-100",
              "focus:outline-none focus:ring-2 focus:ring-pink-300",
              "transition-colors duration-150 ease-in-out",
              "cursor-pointer",
              className
            )}
          >
            {children ?? <Trash className="w-4 h-4" />}
            Delete
          </button>
        </>
      );
    }

    // Default full button style
    return (
      <>
        <AlertModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={title}
          description="This action is permanent. Are you sure you want to continue?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => handleDelete(path, id)}
          variant="destructive"
        />
        <Button
          size="sm"
          type="button"
          className={cn(
            "w-full font-medium bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400",
            className
          )}
          variant="destructive"
          onClick={() => setIsOpen(true)}
          ref={ref}
        >
          <Trash />
          Delete
        </Button>
      </>
    );
  }
);

DeleteButton.displayName = "DeleteButton";

export default DeleteButton;
