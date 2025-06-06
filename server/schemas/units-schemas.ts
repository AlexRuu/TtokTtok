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
  style: z.enum(["default", "highlight", "warning", "tip"]).optional(),
});

const TableBlock = z.object({
  type: z.literal("table"),
  headers: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())),
  note: z.boolean(),
});

const BlockSchema = z.discriminatedUnion("type", [
  TextBlock,
  ImageBlock,
  NoteBlock,
  TableBlock,
]);

export const LessonFormSchema = z.object({
  lessonNumber: z.coerce.number().min(1, "Lesson number is required"),
  title: z.string().min(1, "Title is required"),
  unitId: z.string().min(1, "Select a unit"),
  tags: z.array(z.string().min(1, "Need at least one tag")),
  blocks: z.array(BlockSchema).min(1, "Add at least one content block"),
});

export type LessonFormType = z.infer<typeof LessonFormSchema>;
