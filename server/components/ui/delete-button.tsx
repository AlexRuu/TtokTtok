"use client";

import { deleteItem } from "@/formActions/delete-actions";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import useLoading from "@/hooks/use-loading";
import Loader from "../loader";

interface DeleteButtonProps {
  path: string;
  id: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ path, id }) => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handleDelete = async (path: string, id: string) => {
    startLoading();
    await deleteItem(path, id);
    stopLoading();
    router.refresh();
  };

  return (
    <Button
      size="sm"
      type="button"
      className="w-full font-medium bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
      variant="destructive"
      onClick={() => handleDelete(path, id)}
    >
      <Trash />
      Delete
    </Button>
  );
};

export default DeleteButton;
