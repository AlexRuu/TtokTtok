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
    <div className="p-4 sm:p-6 space-y-6">
      <div className="w-full flex justify-end">
        <Button className="font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 py-4 sm:py-5 text-base rounded-xl transition-all duration-200 shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400">
          <Link href={"/lessons/create"}>Create</Link>
        </Button>
      </div>
      <div className="flex space-x-4">
        {units.map((unit) => (
          <Card key={unit.id} className="w-1/2 shadow-md">
            <CardHeader>
              <CardTitle>
                {unit.unitNumber}. {unit.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="min-w-full text-sm text-left">
                <TableHeader className="bg-muted text-muted-foreground">
                  <TableRow>
                    <TableHead className="px-4 py-2">Lesson </TableHead>
                    <TableHead className="px-4 py-2">Last Edited</TableHead>
                    <TableHead className="px-4 py-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-background divide-y">
                  {unit.lesson.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="px-4 py-2">
                        <Link
                          href={`/lessons/${lesson.id}`}
                          className="text-blue-500"
                        >
                          {lesson.lessonNumber}. {lesson.title}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {format(lesson.updatedAt, "PPp")}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="hover:cursor-pointer w-full flex justify-center ">
                            <SquarePen />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="flex flex-col p-3 space-y-2 w-10">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/lessons/${lesson.id}/edit`}>
                                <Edit /> Edit
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="hover:cursor-pointer"
                            >
                              <Trash />
                              Delete
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
