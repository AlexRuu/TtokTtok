"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Unit } from "./columns";

import { Edit, Ellipsis, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteItem } from "@/actions/delete-actions";
import useLoading from "@/hooks/use-loading";
import { useState } from "react";
import { AlertModal } from "@/components/ui/alert-modal";

interface CellActionProps {
  data: Unit;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handleDelete = async (path: string, id: string) => {
    startLoading();
    await deleteItem(path, id);
    stopLoading();
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Unit?"
        description="This action is permanent. Are you sure you want to continue?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => handleDelete("units", data.id)}
        variant="destructive"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Open actions menu"
            className="h-8 w-8 p-0 rounded-md flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-colors duration-200 hover:cursor-pointer"
          >
            <Ellipsis className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="center"
          sideOffset={4}
          className="w-40 bg-white border border-pink-200 rounded-lg shadow-md p-2"
        >
          {/* EDIT */}
          <DropdownMenuItem
            asChild
            className="flex items-center gap-2 px-4 py-2 text-indigo-700 text-sm rounded-md cursor-pointer hover:bg-indigo-100 focus:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          >
            <Link
              href={`/units/${data.id}`}
              tabIndex={-1}
              className="flex items-center gap-2 w-full"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
          </DropdownMenuItem>

          {/* DELETE */}
          <DropdownMenuItem
            asChild
            className="flex items-center gap-2 px-4 py-2 text-red-400 text-sm rounded-md cursor-pointer hover:bg-red-100 focus:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-400 text-sm rounded-md cursor-pointer hover:bg-red-100 focus:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
            >
              <Trash className="w-4 h-4" />
              Delete
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
