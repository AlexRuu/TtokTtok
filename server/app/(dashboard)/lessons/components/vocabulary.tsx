import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Vocabulary, VocabularyList } from "@/lib/generated/prisma/client";

interface VocabularyProps {
  vocabularyList: VocabularyList & { vocabulary: Vocabulary[] };
}

const VocabularyContent: React.FC<VocabularyProps> = ({ vocabularyList }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Vocabulary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed text-sm border rounded-sm">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="font-semibold w-[25%] truncate text-center">
                English
              </TableHead>
              <TableHead className="font-semibold w-[25%] truncate text-center">
                Korean
              </TableHead>
              <TableHead className="font-semibold w-[25%] truncate text-center">
                Definition
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vocabularyList.vocabulary.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">{item.english}</TableCell>
                <TableCell className="text-center">{item.korean}</TableCell>
                <TableCell className="text-center">{item.definition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VocabularyContent;
