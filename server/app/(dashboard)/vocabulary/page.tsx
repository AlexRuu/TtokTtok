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
import { Edit, Ellipsis } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const VocabularyPage = async () => {
  const units = await findAscUnits();
  if (!units) notFound();

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vocabulary</h1>
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

      {/* Accordion of Units */}
      <Accordion type="multiple" className="space-y-6">
        {units.map((unit) => (
          <AccordionItem
            value={unit.id}
            key={unit.id}
            className="rounded-xl border border-pink-200 bg-white shadow-sm overflow-hidden"
          >
            <AccordionTrigger className="text-left px-5 py-4 text-lg font-semibold text-pink-800 bg-pink-50 hover:bg-pink-100 transition-colors rounded-t-xl">
              Unit {unit.unitNumber} - {unit.title}
            </AccordionTrigger>
            <AccordionContent className="bg-white px-5 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {unit.lesson.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="rounded-2xl border border-muted bg-background shadow-sm hover:shadow-md transition"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold flex justify-between items-center text-foreground">
                        Lesson {lesson.lessonNumber}: {lesson.title}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              aria-label="Open actions menu"
                              className="h-8 w-8 p-0 rounded-md flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors duration-200"
                            >
                              <Ellipsis className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="center"
                            sideOffset={4}
                            className="w-40 bg-white border border-pink-200 rounded-lg shadow-md p-2"
                          >
                            <DropdownMenuItem
                              asChild
                              className="flex items-center gap-2 px-4 py-2 text-indigo-700 text-sm rounded-md hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-300"
                            >
                              <Link
                                href={`/vocabulary/${lesson.vocabularyList?.id}`}
                                tabIndex={-1}
                                className="flex items-center gap-2 w-full"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              asChild
                              className="flex items-center gap-2 px-4 py-2 text-red-400 text-sm rounded-md hover:bg-red-100 focus:ring-2 focus:ring-red-300"
                            >
                              <DeleteButton
                                title="Delete Vocabulary?"
                                path="vocabulary"
                                id={lesson.vocabularyList?.id || ""}
                                minimal
                              />
                            </DropdownMenuItem>
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
