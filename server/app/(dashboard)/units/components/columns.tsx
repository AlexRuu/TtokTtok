"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Lesson } from "@/lib/generated/prisma";

export type Unit = {
  id: string;
  unitNumber: number;
  title: string;
  lesson: Lesson[];
  createdAt: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<Unit>[] = [
  {
    accessorKey: "unitNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting()}
        >
          Unit Number
          {column.getIsSorted() === "asc" && <ArrowUp />}
          {column.getIsSorted() === "desc" && <ArrowDown />}
        </Button>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting()}
        >
          Title
          {column.getIsSorted() === "asc" && <ArrowUp />}
          {column.getIsSorted() === "desc" && <ArrowDown />}
        </Button>
      );
    },
  },
  {
    accessorKey: "lesson",
    header: ({ column }) => (
      <div className="w-full text-center">
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting()}
        >
          Number of Lessons
          {column.getIsSorted() === "asc" && <ArrowUp />}
          {column.getIsSorted() === "desc" && <ArrowDown />}
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-full text-center">{row.original.lesson.length}</div>
    ),
    enableSorting: true,
    sortingFn: (rowA, rowB) =>
      rowA.original.lesson.length - rowB.original.lesson.length,
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
