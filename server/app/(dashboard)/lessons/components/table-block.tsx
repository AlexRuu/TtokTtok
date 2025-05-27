"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext, useFieldArray } from "react-hook-form";

interface TableBlockEditorProps {
  name: `blocks.${number}`;
  index: number;
}

export const TableBlockEditor = ({ name, index }: TableBlockEditorProps) => {
  const form = useFormContext();

  const headersPath = `${name}.headers` as const;
  const rowsPath = `${name}.rows` as const;

  const headers = form.watch(headersPath) || [];
  const rows = form.watch(rowsPath) || [];

  return (
    <div className="space-y-6 border rounded-xl p-4 bg-muted/50">
      {/* Column Headers */}
      <FormItem>
        <FormLabel>Column Headers</FormLabel>
        <FormControl>
          <div className="flex flex-col space-y-2">
            {headers.map((header: string, headerIndex: number) => (
              <div key={headerIndex} className="flex gap-2">
                <Input
                  value={header}
                  onChange={(e) => {
                    const updated = [...headers];
                    updated[headerIndex] = e.target.value;
                    form.setValue(headersPath, updated);
                  }}
                  placeholder={`Header ${headerIndex + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => {
                    const updatedHeaders = headers.filter(
                      (_: string, i: number) => i !== headerIndex
                    );

                    const updatedRows = rows.map((row: string[]) =>
                      row.filter((_, i) => i !== headerIndex)
                    );
                    form.setValue(headersPath, updatedHeaders);
                    form.setValue(rowsPath, updatedRows);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.setValue(headersPath, [...headers, ""]);
                const updatedRows = rows.map((row: string[]) => [...row, ""]);
                form.setValue(rowsPath, updatedRows);
              }}
            >
              + Add Header
            </Button>
          </div>
        </FormControl>
      </FormItem>

      {/* Table Rows */}
      <FormItem>
        <FormLabel>Table Rows</FormLabel>
        <FormControl>
          <div className="flex flex-col gap-4">
            {rows.map((row: string[], rowIndex: number) => (
              <div key={rowIndex} className="flex gap-2 items-center">
                {row.map((cell: string, cellIndex: number) => (
                  <Input
                    key={cellIndex}
                    value={cell}
                    onChange={(e) => {
                      const updated = [...rows];
                      updated[rowIndex][cellIndex] = e.target.value;
                      form.setValue(rowsPath, updated);
                    }}
                    placeholder={`Row ${rowIndex + 1}, Col ${cellIndex + 1}`}
                    className="w-full"
                  />
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => {
                    const updated = rows.filter(
                      (_: string[], i: number) => i !== rowIndex
                    );
                    form.setValue(rowsPath, updated);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const newRow = new Array(headers.length).fill("");
                form.setValue(rowsPath, [...rows, newRow]);
              }}
            >
              + Add Row
            </Button>
          </div>
        </FormControl>
      </FormItem>
    </div>
  );
};
