"use client";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { vocabularyAction } from "@/actions/form-actions";
import useLoading from "@/hooks/use-loading";
import {
  Lesson,
  Unit,
  Vocabulary,
  VocabularyList,
} from "@/lib/generated/prisma";
import {
  vocabularySchema,
  vocabularySchemaValues,
} from "@/schemas/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface VocabularyFormProps {
  initialData: (VocabularyList & { vocabulary: Vocabulary[] }) | null;
  lessons: ({ unit: Unit } & Lesson)[];
}

const VocabularyForm: React.FC<VocabularyFormProps> = ({
  initialData,
  lessons,
}) => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const form = useForm<vocabularySchemaValues>({
    resolver: zodResolver(vocabularySchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          title: "",
          vocabulary: [{ english: "", korean: "", definition: "" }],
          lessonId: "",
        },
  });

  const vocabArray = useFieldArray({
    name: "vocabulary",
    control: form.control,
  });

  const onSubmit: SubmitHandler<vocabularySchemaValues> = async (data) => {
    startLoading();
    try {
      const action = initialData ? "PATCH" : "POST";
      await vocabularyAction(data, action, stopLoading, initialData?.id);
      startTransition(() => {
        router.refresh();
        stopLoading();
        router.push("/vocabulary");
      });
    } catch (error) {
      console.log(error);
      toast.error("There was an error creating vocabulary.", {
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
          className="w-full max-w-md bg-white border border-pink-100 shadow-xs rounded-2xl p-8 pt-10 space-y-6"
        >
          <h1 className="text-center text-xl md:text-2xl font-semibold">
            {initialData ? "Edit Vocabulary" : "Create Vocabulary"}
          </h1>
          <FormField
            control={form.control}
            name="title"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={form.control}
            name="lessonId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full px-3 py-5 text-base border rounded-md border-gray-300 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-300">
                      <SelectValue placeholder="Select a Lesson" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        Unit. {lesson.unit.unitNumber} - {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="space-y-6">
            {vocabArray.fields.map((field, index) => (
              <div key={field.id} className="border-t pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Vocabulary {index + 1}</FormLabel>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="w-1/8 font-semibold bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
                    onClick={() => vocabArray.remove(index)}
                  >
                    <Trash />
                  </Button>
                </div>

                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name={`vocabulary.${index}.english`}
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>English Word</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            className="w-full px-3 py-5 text-base border rounded-md border-gray-300 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-300"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`vocabulary.${index}.korean`}
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Korean Word</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            className="w-full px-3 py-5 text-base border rounded-md border-gray-300 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-300"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`vocabulary.${index}.definition`}
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Definition</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Definition of the word..."
                          className="w-full px-3 py-4 text-base border rounded-md border-gray-300 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-300"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                vocabArray.append({ english: "", korean: "", definition: "" })
              }
              className="w-full font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 py-4 rounded-xl shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99]"
            >
              Add Block
            </Button>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              onClick={() => router.push("/vocabulary")}
              disabled={form.formState.isSubmitting}
              className="w-full font-semibold bg-pink-200 hover:bg-pink-300 text-pink-900 py-4 rounded-xl shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 py-4 rounded-xl shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] hover:cursor-pointer"
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VocabularyForm;
