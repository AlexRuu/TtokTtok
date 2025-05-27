import { z } from "zod";

const TextBlock = z.object({
  type: z.literal("text"),
  content: z.string().min(1, "Text content is required"),
});

const ImageBlock = z.object({
  type: z.literal("image"),
  url: z.string().url("Must be a valid URL"),
  alt: z.string().optional(),
});

const NoteBlock = z.object({
  type: z.literal("note"),
  content: z.string().min(1, "Note content is required"),
  style: z.enum(["default", "highlight", "warning"]).optional(),
});

const TableBlock = z.object({
  type: z.literal("table"),
  headers: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())),
});

const BlockSchema = z.discriminatedUnion("type", [
  TextBlock,
  ImageBlock,
  NoteBlock,
  TableBlock,
]);

export const LessonFormSchema = z.object({
  lessonNumber: z.number().min(1, "Lesson number is required"),
  title: z.string().min(1, "Title is required"),
  unitTitle: z.string().min(1, "Select a unit"),
  blocks: z.array(BlockSchema).min(1, "Add at least one content block"),
});

export type LessonFormType = z.infer<typeof LessonFormSchema>;
