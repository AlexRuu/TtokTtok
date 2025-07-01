import { Button } from "@/components/ui/button";
import { findAscUnits } from "@/prisma/prismaFetches";
import Link from "next/link";
import React from "react";
import { UnitTable } from "./components/unit-table";
import { columns } from "./components/columns";

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

      <UnitTable data={units} columns={columns} />
    </div>
  );
};

export default UnitsPage;
