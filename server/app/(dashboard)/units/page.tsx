import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/ui/delete-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { findAscUnits } from "@/prisma/prismaFetches";
import { Edit } from "lucide-react";
import Link from "next/link";
import React from "react";

const UnitsPage = async () => {
  const units = await findAscUnits();

  if (!units) {
    return <div>No Units Found</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="w-full flex justify-end">
        <Button className="font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 py-4 sm:py-5 text-base rounded-xl transition-all duration-200 shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400">
          <Link href={"/units/create"}>+ Create</Link>
        </Button>
      </div>
      <div className="hidden md:block overflow-auto border rounded-lg">
        <Table className="min-w-full text-sm text-left">
          <TableHeader className="bg-muted text-muted-foreground">
            <TableRow>
              <TableHead className="px-4 py-2 text-center">Number</TableHead>
              <TableHead className="px-4 py-2 text-center">Name</TableHead>
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
                <TableCell className="px-4 py-2 space-x-2">
                  <div className="w-1/4 gap-5 flex mx-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium flex items-center justify-center gap-2 py-4 text-base sm:text-md rounded-xl shadow-sm transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300 hover:cursor-pointer sm:py-5 sm:text-md hover:shadow-md duration-200 ease-in-out"
                      asChild
                    >
                      <Link
                        href={`/units/${unit.id}`}
                        className="flex items-center"
                      >
                        <Edit />
                        Edit
                      </Link>
                    </Button>
                    <DeleteButton path="units" id={unit.id} />
                  </div>
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
