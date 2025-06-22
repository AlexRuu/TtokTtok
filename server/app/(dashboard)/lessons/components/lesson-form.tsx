"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useLoading from "@/hooks/use-loading";
import { cn } from "@/lib/utils";
import { LessonFormSchema, LessonFormType } from "@/schemas/units-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { startTransition, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, SubmitHandler } from "react-hook-form";
import { TableBlockEditor } from "./table-block";
import toast from "react-hot-toast";
import { Lesson, Tag, Tagging, Unit } from "@/lib/generated/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { lessonAction } from "@/actions/form-actions";
import Loader from "@/components/loader";

const formSchema = LessonFormSchema;

interface UnitFormProps {
  initialData: (Lesson & { tagging: Tagging[] }) | null;
  units: Unit[];
  tags: Tag[];
}

const LessonForm: React.FC<UnitFormProps> = ({ initialData, units, tags }) => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number | undefined>();

  useEffect(() => {
    if (!triggerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, []);

  const [selectedBlockType, setSelectedBlockType] = useState<
    "text" | "image" | "note" | "table" | ""
  >("text");

  const router = useRouter();

  const handleAddBlock = () => {
    switch (selectedBlockType) {
      case "text":
        blocksArray.append({ type: "text", content: "" });
        break;
      case "image":
        blocksArray.append({ type: "image", url: "", alt: "" });
        break;
      case "note":
        blocksArray.append({ type: "note", content: "", style: "default" });
        break;
      case "table":
        blocksArray.append({
          type: "table",
          headers: [],
          rows: [],
          note: false,
        });
        break;
    }
  };

  const form = useForm<LessonFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          tags: initialData.tagging.map((a) => a.tagId),
          blocks: JSON.parse(JSON.stringify(initialData.content)),
        }
      : { lessonNumber: 1, title: "", unitId: "", tags: [], blocks: [] },
  });

  const blocksArray = useFieldArray({
    name: "blocks",
    control: form.control,
  });

  const onSubmit: SubmitHandler<LessonFormType> = async (data) => {
    startLoading();
    try {
      const action = initialData ? "PATCH" : "POST";
      await lessonAction(data, action, stopLoading, initialData?.id);
      startTransition(() => {
        router.refresh();
        stopLoading();
        router.push("/lessons");
      });
    } catch (error) {
      console.log(error);
      toast.error("There was an error creating lesson.", {
        style: {
          background: "#ffeef0",
          color: "#943c5e",
          borderRadius: "10px",
          padding: "12px 18px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
          fontSize: "16px",
        },
        className:
          "transition-all transform duration-300 ease-in-out font-medium",
      });
      stopLoading();
    }
  };

  return (
    <div className="min-h-screen w-full max-w-screen bg-[#fdfaf6] overflow-x-hidden flex items-center justify-center flex-col py-10 px-4">
      {isLoading && <Loader />}
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-lg bg-white border border-pink-100 shadow-xs rounded-2xl p-8 pt-10 space-y-6"
        >
          <h1 className="text-xl text-center md:text-2xl font-semibold py-2 sm:py-3 md:py-4">
            {initialData ? "Edit Lessons" : "Create Lesson"}
          </h1>
          <div className="relative flex space-x-3">
            <FormField
              control={form.control}
              name="lessonNumber"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel
                    htmlFor="lessonNumber"
                    className={cn(
                      form.formState.errors.title && form.formState.isSubmitted
                        ? "text-red-400! before:text-red-400"
                        : ""
                    )}
                  >
                    Lesson Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="lessonNumber"
                      {...field}
                      type="number"
                      onInvalid={(e) => e.preventDefault()}
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base shadow-xs placeholder-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="w-2/3">
                  <FormLabel
                    htmlFor="title"
                    className={cn(
                      form.formState.errors.title && form.formState.isSubmitted
                        ? "text-red-400! before:text-red-400"
                        : ""
                    )}
                  >
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      {...field}
                      type="text"
                      onInvalid={(e) => e.preventDefault()}
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base shadow-xs placeholder-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="relative w-full">
            <FormField
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base shadow-xs placeholder-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300">
                        <SelectValue placeholder="Select a Unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.unitNumber} value={unit.id}>
                          {unit.unitNumber}. {unit.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="relative">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tags</FormLabel>
                  <Popover>
                    <PopoverTrigger
                      asChild
                      ref={triggerRef}
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base shadow-xs placeholder-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300"
                    >
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between px-4 py-5 text-left font-normal",
                          !field.value?.length && "text-muted-foreground"
                        )}
                      >
                        {field.value?.length
                          ? tags
                              .filter((tag) => field.value.includes(tag.id))
                              .map((tag) => tag.name)
                              .join(", ")
                          : "Select tags"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="min-w-full p-2"
                      style={{
                        width: width ? `${width + 32}px` : "auto",
                      }}
                      align="start"
                    >
                      <Command className="w-full box-border">
                        <CommandList>
                          {tags.map((tag) => (
                            <CommandItem
                              key={tag.id}
                              onSelect={() => {
                                const selected = field.value || [];
                                if (selected.includes(tag.id)) {
                                  field.onChange(
                                    selected.filter((id) => id !== tag.id)
                                  );
                                } else {
                                  field.onChange([...selected, tag.id]);
                                }
                              }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{tag.name}</span>
                                {field.value?.includes(tag.id) && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Optional: show badges of selected tags below */}
                  {field.value?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags
                        .filter((tag) => field.value.includes(tag.id))
                        .map((tag) => (
                          <Badge key={tag.id} variant="secondary">
                            {tag.name}
                          </Badge>
                        ))}
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>
          <div className="relative flex-col flex">
            <Label className="py-2">Lesson Content Blocks</Label>
            <div className="flex items-center space-x-4">
              <Select
                value={selectedBlockType ?? ""}
                onValueChange={(value) =>
                  setSelectedBlockType(
                    value as "text" | "image" | "note" | "table"
                  )
                }
              >
                <SelectTrigger className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base shadow-xs placeholder-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300">
                  <SelectValue placeholder="Select block type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleAddBlock}
                disabled={!selectedBlockType}
                className="w-1/4 font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 py-4 sm:py-5 text-base rounded-xl transition-all duration-200 shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
              >
                Add Block
              </Button>
            </div>
            {blocksArray.fields.map((field, index) => {
              const blockType = form.watch("blocks")[index]?.type;
              const isFirst = index === 0;
              const isLast = index === blocksArray.fields.length - 1;
              return (
                <div
                  key={field.id}
                  className="border p-4 rounded mb-4 bg-gray-50 my-5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel>
                      Block #{index + 1} ({blockType})
                    </FormLabel>
                    <Button
                      type="button"
                      disabled={isFirst}
                      onClick={() => blocksArray.move(index, index - 1)}
                      className={`w-10 font-semibold bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-xl transition-colors ${
                        isFirst ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title="Move Up"
                    >
                      ↑
                    </Button>

                    {/* Move Down */}
                    <Button
                      type="button"
                      disabled={isLast}
                      onClick={() => blocksArray.move(index, index + 1)}
                      className={`w-10 font-semibold bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-xl transition-colors ${
                        isLast ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title="Move Down"
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      className="w-1/5 font-semibold bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
                      onClick={() => blocksArray.remove(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  {blockType === "image" && (
                    <>
                      <FormField
                        control={form.control}
                        name={`blocks.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter image URL" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`blocks.${index}.alt`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alt Text</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter alt text" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  {blockType === "text" && (
                    <FormField
                      control={form.control}
                      name={`blocks.${index}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Text</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Enter text..." />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                  {blockType === "note" && (
                    <>
                      <FormField
                        control={form.control}
                        name={`blocks.${index}.content`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Note Content</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter note..."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`blocks.${index}.style`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Note Style</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select note style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="default">Default</SelectItem>
                                <SelectItem value="tip">Tip</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="highlight">
                                  Highlight
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  {blockType === "table" && (
                    <TableBlockEditor name={`blocks.${index}`} index={index} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="relative flex w-full space-x-4">
            <Button
              className="w-full font-semibold bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
              aria-label="Cancel"
              type="button"
              onClick={() => router.push("/lessons")}
              disabled={form.formState.isSubmitting}
              aria-live="assertive"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 py-4 sm:py-5 text-base rounded-xl transition-all duration-200 shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
              aria-label="Submit"
              aria-busy={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
              aria-live="assertive"
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LessonForm;
