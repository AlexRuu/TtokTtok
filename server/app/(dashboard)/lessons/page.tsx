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
import { format } from "date-fns";
import Link from "next/link";

const LessonsPage = async () => {
  const lessons = await prismadb.lesson.findMany({
    include: { unit: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="w-full flex justify-end">
        <Button className="font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 py-4 sm:py-5 text-base rounded-xl transition-all duration-200 shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400">
          <Link href={"/lessons/create"}>Create</Link>
        </Button>
      </div>
      <Table className="min-w-full text-sm text-left">
        <TableHeader className="bg-muted text-muted-foreground">
          <TableRow>
            <TableHead className="px-4 py-2">Unit Number</TableHead>
            <TableHead className="px-4 py-2">Lesson Number</TableHead>
            <TableHead className="px-4 py-2">Lesson Title</TableHead>
            <TableHead className="px-4 py-2">Last Edited</TableHead>
            <TableHead className="px-4 py-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-background divide-y">
          {lessons.map((lesson) => (
            <TableRow key={lesson.id}>
              <TableCell className="px-4 py-2">
                {lesson.unit.unitNumber}. {lesson.unit.title}
              </TableCell>
              <TableCell className="px-4 py-2">{lesson.lessonNumber}</TableCell>
              <TableCell className="px-4 py-2">{lesson.title}</TableCell>
              <TableCell className="px-4 py-2">
                {format(lesson.updatedAt, "PPPP")}
              </TableCell>
              <TableCell className="px-4 py-2">
                <Button size="sm" variant="outline">
                  <Link href={`/lessons/${lesson.id}`}>Edit</Link>
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
  );
};

export default LessonsPage;
