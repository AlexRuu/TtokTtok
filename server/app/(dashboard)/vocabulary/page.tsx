import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findLessons } from "@/prisma/prismaFetches";
import Link from "next/link";
import { notFound } from "next/navigation";

const VocabularyPage = async () => {
  const lessons = await findLessons();

  if (!lessons) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vocabulary</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Browse vocabulary created per lesson
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium px-5 py-3 text-base rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300"
        >
          <Link href="/vocabulary/create">+ Create Vocabulary</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card
            key={lesson.id}
            className="rounded-2xl border border-muted bg-background shadow-sm transition hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold leading-tight text-foreground flex justify-between items-center">
                Lesson {lesson.lessonNumber}: {lesson.title}
                <Button
                  asChild
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium px-5 py-3 text-base rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300 hover:cursor-pointer"
                >
                  <Link href={`/vocabulary/${lesson.vocabularyList!.id}`}>
                    Edit
                  </Link>
                </Button>
              </CardTitle>
              <CardDescription>Unit: {lesson.unit.unitNumber}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {lesson.vocabularyList ? (
                <Table className="text-sm">
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead className="text-muted-foreground">
                        English
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Korean
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Definition
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lesson.vocabularyList.vocabulary.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.english}</TableCell>
                        <TableCell>{item.korean}</TableCell>
                        <TableCell>{item.definition}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  No vocabulary yet.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VocabularyPage;
