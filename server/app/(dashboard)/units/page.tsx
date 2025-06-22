import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/ui/delete-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { findAscUnits } from "@/prisma/prismaFetches";
import { Edit, Ellipsis } from "lucide-react";
import Link from "next/link";
import React from "react";

const UnitsPage = async () => {
  const units = await findAscUnits();

  if (!units) {
    return <div>No Units Found</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Units</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Overview of all units
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium px-5 py-3 text-base rounded-xl shadow-sm transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300"
        >
          <Link href="/units/create">+ Create Unit</Link>
        </Button>
      </div>

      <div className="hidden md:block overflow-auto border rounded-lg">
        <Table className="min-w-full text-sm text-left">
          <TableHeader className="bg-muted text-muted-foreground">
            <TableRow>
              <TableHead className="px-4 py-2 text-center">Number</TableHead>
              <TableHead className="px-4 py-2 text-center">Name</TableHead>
              <TableHead className="px-4 py-2 text-center">
                Number of Lessons
              </TableHead>
              <TableHead className="px-4 py-2 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-background divide-y">
            {units.map((unit) => (
              <TableRow key={unit.unitNumber}>
                <TableCell className="px-4 py-2 text-center">
                  {unit.unitNumber}
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                  {unit.title}
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                  {unit.lesson.length}
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="hover:cursor-pointer">
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-full py-3 px-4 flex-col flex gap-2"
                      align="end"
                    >
                      <Button
                        asChild
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium px-5 py-3 text-base rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300 hover:cursor-pointer"
                      >
                        <Link href={`/units/${unit.id}`}>
                          <Edit /> Edit
                        </Link>
                      </Button>
                      <DeleteButton path="units" id={unit.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {units.map((unit) => (
          <div
            key={unit.unitNumber}
            className="border rounded-lg p-4 shadow-xs bg-white dark:bg-background"
          >
            <div className="text-lg font-medium mb-1">
              {unit.unitNumber}. {unit.title}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="w-full">
                <Link href={`/units/`}>
                  <Edit />
                  Edit
                </Link>
              </Button>
              <DeleteButton path="units" id={unit.id} />
            </div>
          </div>
        ))}
        {units.length === 0 && (
          <div className="text-center text-muted-foreground text-sm">
            No units found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitsPage;
