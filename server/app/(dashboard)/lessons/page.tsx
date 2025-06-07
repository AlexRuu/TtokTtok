import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { format } from "date-fns";
import { Edit, SquarePen, Trash } from "lucide-react";
import Link from "next/link";

const LessonsPage = async () => {
  const units = await findAscUnits();

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Overview of all your created lessons by unit
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium px-5 py-3 text-base rounded-xl shadow-sm transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300"
        >
          <Link href="/lessons/create">+ Create Lesson</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {units.map((unit) => (
          <Card
            key={unit.id}
            className="border border-muted bg-background shadow-sm rounded-2xl"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Unit {unit.unitNumber}: {unit.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson</TableHead>
                    <TableHead>Last Edited</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unit.lesson.map((lesson) => (
                    <TableRow key={lesson.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Link
                          href={`/lessons/${lesson.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {lesson.lessonNumber}. {lesson.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {format(new Date(lesson.updatedAt), "PPp")}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-muted"
                            >
                              <SquarePen className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-32 p-1.5 space-y-1 bg-popover border rounded-md shadow-md"
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-full justify-start gap-2"
                              asChild
                            >
                              <Link href={`/lessons/${lesson.id}/edit`}>
                                <Edit className="w-4 h-4" /> Edit
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="w-full justify-start gap-2"
                            >
                              <Trash className="w-4 h-4" /> Delete
                            </Button>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;
