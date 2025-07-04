import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteButton from "@/components/ui/delete-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Edit, Ellipsis } from "lucide-react";
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
                            <button
                              aria-label="Open actions menu"
                              className="w-full p-0 rounded-md flex text-center items-center justify-center text-pink-600 hover:bg-pink-50 transition-colors duration-200 hover:cursor-pointer"
                            >
                              <Ellipsis className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="center"
                            sideOffset={4}
                            className="w-40 bg-white border border-pink-200 rounded-lg shadow-md p-2"
                          >
                            {/* EDIT */}
                            <DropdownMenuItem
                              asChild
                              className="flex items-center gap-2 px-4 py-2 text-indigo-700 text-sm rounded-md cursor-pointer hover:bg-indigo-100 focus:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                            >
                              <Link
                                href={`/lessons/${lesson.id}`}
                                tabIndex={-1}
                                className="flex items-center gap-2 w-full"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>

                            {/* DELETE */}
                            <DropdownMenuItem
                              asChild
                              className="flex items-center gap-2 px-4 py-2 text-red-400 text-sm rounded-md cursor-pointer hover:bg-red-100 focus:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                            >
                              <DeleteButton
                                title="Delete Lesson?"
                                path="lessons"
                                id={lesson.id}
                                minimal
                              />
                            </DropdownMenuItem>
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
