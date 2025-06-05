import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Vocabulary } from "@/lib/generated/prisma";

interface VocabularyProps {
  vocabulary: Vocabulary[];
}

const VocabularyContent: React.FC<VocabularyProps> = ({ vocabulary }) => {
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
              <TableHead className="font-semibold w-[25%] truncate">
                English
              </TableHead>
              <TableHead className="font-semibold w-[25%] truncate">
                Korean
              </TableHead>
              <TableHead className="font-semibold w-[25%] truncate">
                Definition
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vocabulary.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.english}</TableCell>
                <TableCell>{item.korean}</TableCell>
                <TableCell>{item.definition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VocabularyContent;
