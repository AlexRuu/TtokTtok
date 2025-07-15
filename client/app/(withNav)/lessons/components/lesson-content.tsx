import { LessonBlock } from "@/types";
import TextBlock from "./text-block";
import ImageBlock from "./image-block";
import NoteBlock from "./note-block";
import TableBlock from "./table-block";

const LessonContent = ({ content }: { content: LessonBlock[] }) => {
  return (
    <div className="space-y-6">
      {content.map((block, idx) => {
        switch (block.type) {
          case "text":
            return <TextBlock key={idx} content={block.content} />;
          case "image":
            return <ImageBlock key={idx} url={block.url} alt={block.alt} />;
          case "note":
            return (
              <NoteBlock
                key={idx}
                content={block.content}
                style={block.style}
              />
            );
          case "table":
            return (
              <TableBlock
                key={idx}
                headers={block.headers}
                rows={block.rows}
                note={block.note}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default LessonContent;
