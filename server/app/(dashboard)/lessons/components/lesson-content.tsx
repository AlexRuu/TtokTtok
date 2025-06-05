import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LessonContentProps {
  content: any;
}

const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
  type NoteStyleKey = "default" | "highlight" | "warning" | "tip";

  const noteStyleMap: Record<
    NoteStyleKey,
    {
      backgroundColour: string;
      textColour: string;
      borderColour: string;
    }
  > = {
    default: {
      backgroundColour: "#e5e7eb",
      textColour: "#1f2937",
      borderColour: "#d1d5db",
    },
    highlight: {
      backgroundColour: "#fef08a",
      textColour: "#92400e",
      borderColour: "#fde68a",
    },
    warning: {
      backgroundColour: "#fecaca",
      textColour: "#991b1b",
      borderColour: "#fca5a5",
    },
    tip: {
      backgroundColour: "#99f6e4",
      textColour: "#134e4a",
      borderColour: "#5eead4",
    },
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Lesson Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {content.map((item: any, index: number) => {
          const styleKey = item.style as NoteStyleKey;
          return (
            <div
              key={index}
              className="rounded-xl border border-muted p-4 bg-muted/50 space-y-3"
            >
              <h6 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {item.type} Content
              </h6>
              {item.type == "text" && (
                <p className="text-sm text-foreground whitespace-pre-line">
                  {item.content}
                </p>
              )}
              {item.type == "note" && (
                <div>
                  <Badge
                    className="mb-4"
                    style={{
                      backgroundColor: noteStyleMap[styleKey].backgroundColour,
                      color: noteStyleMap[styleKey].textColour,
                      borderColor: noteStyleMap[styleKey].borderColour,
                    }}
                  >
                    {item.style}
                  </Badge>
                  <p>{item.content}</p>
                </div>
              )}
              {item.type === "image" && (
                <div className="flex flex-col gap-2">
                  <Image
                    src={item.url}
                    alt={item.alt}
                    className="rounded-md max-w-sm border"
                  />
                  <Link
                    href={item.url}
                    className="text-xs text-blue-600 hover:underline"
                    target="_blank"
                  >
                    View full image
                  </Link>
                </div>
              )}
              {item.type === "table" && (
                <div className="overflow-x-auto">
                  <Table className="table-fixed text-sm border rounded-sm">
                    <TableHeader className="bg-muted">
                      <TableRow>
                        {item.headers.map((header: string, idx: number) => (
                          <TableHead
                            key={idx}
                            className="font-semibold w-[25%] truncate"
                          >
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {item.rows.map((row: string[], rowIdx: number) => (
                        <TableRow key={rowIdx}>
                          {row.map((cell: string, cellIdx: number) => (
                            <TableCell key={cellIdx}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {item.note && (
                    <p className="text-sm text-muted-foreground">
                      <span className="superscript">*</span> Ireggular form
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LessonContent;
