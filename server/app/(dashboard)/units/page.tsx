import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prismadb from "@/lib/prismadb";
import Link from "next/link";
import React from "react";

const UnitsPage = async () => {
  const units = await prismadb.unit.findMany({
    orderBy: { unitNumber: "desc" },
  });

  if (!units) {
    return <div>No Units Found</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="w-full flex justify-end">
        <Button className="font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 py-4 sm:py-5 text-base rounded-xl transition-all duration-200 shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400">
          <Link href={"/units/create"}>Create</Link>
        </Button>
      </div>
      <div className="hidden md:block overflow-auto border rounded-lg">
        <Table className="min-w-full text-sm text-left">
          <TableHeader className="bg-muted text-muted-foreground">
            <TableRow>
              <TableHead className="px-4 py-2">Number</TableHead>
              <TableHead className="px-4 py-2">Name</TableHead>
              <TableHead className="px-4 py-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-background divide-y">
            {units.map((unit) => (
              <TableRow key={unit.unitNumber}>
                <TableCell className="px-4 py-2">{unit.unitNumber}</TableCell>
                <TableCell className="px-4 py-2">{unit.title}</TableCell>
                <TableCell className="px-4 py-2 space-x-2">
                  <Button size="sm" variant="outline">
                    <Link href={`/units/${unit.id}`}>Edit</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="hover:cursor-pointer"
                  >
                    Delete
                  </Button>
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
                <Link href={`/units/`}>Edit</Link>
              </Button>
              <Button size="sm" variant="destructive" className="w-full">
                Delete
              </Button>
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
