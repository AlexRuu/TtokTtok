"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Unit } from "./columns";

import { Edit, Ellipsis } from "lucide-react";

import DeleteButton from "@/components/ui/delete-button";
import Link from "next/link";

interface CellActionProps {
  data: Unit;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Open actions menu"
          className="h-8 w-8 p-0 rounded-md flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-colors duration-200"
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
          <DeleteButton path="units" id={data.id} minimal />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
