import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteButton from "@/components/ui/delete-button";
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
import { Edit, Ellipsis } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const VocabularyPage = async () => {
  const units = await findAscUnits();

  if (!units) {
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

      <Accordion type="multiple">
        {units.map((unit) => (
          <AccordionItem value={unit.id} key={unit.id}>
            <AccordionTrigger>
              Unit {unit.unitNumber} - {unit.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {unit.lesson.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="rounded-2xl border border-muted bg-background shadow-sm transition hover:shadow-md"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold leading-tight text-foreground flex justify-between items-center">
                        Lesson {lesson.lessonNumber}: {lesson.title}
                        <DropdownMenu>
                          <DropdownMenuTrigger className="hover:cursor-pointer">
                            <Ellipsis />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-full py-3 px-4 flex-col flex gap-2"
                            align="end"
                          >
                            <Button
                              asChild
                              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-medium px-5 py-3 text-base rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] focus:ring-2 focus:ring-indigo-300 hover:cursor-pointer"
                            >
                              <Link
                                href={`/vocabulary/${lesson.vocabularyList?.id}`}
                              >
                                <Edit /> Edit
                              </Link>
                            </Button>
                            <DeleteButton
                              path="vocabulary"
                              id={
                                lesson.vocabularyList
                                  ? lesson.vocabularyList.id
                                  : ""
                              }
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardTitle>
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default VocabularyPage;
