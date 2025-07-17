"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface TableBlockProps {
  headers: string[];
  rows: string[][];
  note?: boolean;
}

const TableBlock = ({ headers, rows, note }: TableBlockProps) => {
  const columnCount = headers.length;

  return (
    <div className="my-6 overflow-x-auto">
      <Table
        className="border border-[#EAD2B7] rounded-xl overflow-hidden table-fixed w-full"
        style={{
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          {Array.from({ length: columnCount }).map((_, idx) => (
            <col key={idx} style={{ width: `${100 / columnCount}%` }} />
          ))}
        </colgroup>

        <TableHeader className="bg-[#FFF3E8]">
          <TableRow>
            {headers.map((header, idx) => (
              <TableHead
                key={idx}
                className="text-[#6B4C3B] px-4 py-2 border border-[#EAD2B7] text-center"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} className="bg-white">
              {row.map((cell, j) => (
                <TableCell
                  key={j}
                  className="px-4 py-2 border border-[#EAD2B7] text-[#6B4C3B] text-center"
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {note && (
        <p className="text-xs mt-2 text-[#A67C66] italic text-center">
          * Ireggular form
        </p>
      )}
    </div>
  );
};

export default TableBlock;
