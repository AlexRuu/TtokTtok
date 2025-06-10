"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { quizActions } from "@/formActions/form-actions";
import useLoading from "@/hooks/use-loading";
import { Lesson, Quiz, QuizQuestion, Unit } from "@/lib/generated/prisma";
import { quizSchema, quizSchemaValues } from "@/schemas/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface QuizFormProps {
  initialData: (Quiz & { quizQuestion: QuizQuestion[] }) | null;
  lessons: ({ unit: Unit } & Lesson)[];
}

const QuizForm: React.FC<QuizFormProps> = ({ initialData, lessons }) => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const [selectedQuizType, setSelectedQuizType] = useState<
    "MULTIPLE_CHOICE" | "FILL_IN_THE_BLANK" | "TRUE_FALSE" | "MATCHING" | ""
  >("");

  const form = useForm<quizSchemaValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          quizQuestion: [],
          lessonId: "",
        },
  });

  const questionArray = useFieldArray({
    name: "quizQuestion",
    control: form.control,
  });

  const handleAddBlock = () => {
    switch (selectedQuizType) {
      case "MULTIPLE_CHOICE":
        questionArray.append({
          type: "MULTIPLE_CHOICE",
          question: "",
          answer: "",
          options: [],
        });
        break;
      case "FILL_IN_THE_BLANK":
        questionArray.append({
          type: "FILL_IN_THE_BLANK",
          question: "",
          answer: "",
        });
        break;
      case "TRUE_FALSE":
        questionArray.append({
          type: "TRUE_FALSE",
          question: "",
          answer: false,
        });
        break;
      case "MATCHING":
        questionArray.append({
          type: "MATCHING",
          question:
            "Match each item on the left with its corresponding item on the right.",
          pairs: [],
          answer: [],
        });
        break;
    }
  };

  const onSubmit: SubmitHandler<quizSchemaValues> = async (data) => {
    startLoading();
    try {
      const action = initialData ? "PATCH" : "POST";
      quizActions(data, action, stopLoading, initialData?.id);
      stopLoading();
      router.push("/quizzes");
    } catch (error) {
      console.log(error);
      toast.error("There was an error creating quiz.", {
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
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Validation Errors:", errors);
          })}
          className="w-full max-w-2xl bg-white border border-pink-200 rounded-3xl p-10 space-y-8 shadow-md shadow-pink-100"
        >
          <h1 className="text-center text-xl md:text-2xl font-semibold">
            {initialData ? "Edit Quiz" : "Create Quiz"}
          </h1>

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

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Select
              value={selectedQuizType ?? ""}
              onValueChange={(value) =>
                setSelectedQuizType(
                  value as
                    | "MULTIPLE_CHOICE"
                    | "FILL_IN_THE_BLANK"
                    | "TRUE_FALSE"
                    | "MATCHING"
                    | ""
                )
              }
            >
              <SelectTrigger className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base shadow-xs placeholder-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                <SelectItem value="FILL_IN_THE_BLANK">
                  Fill In The Blank
                </SelectItem>
                <SelectItem value="TRUE_FALSE">True Or False</SelectItem>
                <SelectItem value="MATCHING">Matching</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={handleAddBlock}
              disabled={!selectedQuizType}
              className="w-1/4 font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 py-4 sm:py-5 text-base rounded-xl transition-all duration-200 shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
            >
              Add Block
            </Button>
          </div>
          <div className="space-y-6">
            {questionArray.fields.map((field, index) => {
              const questionType = form.watch("quizQuestion")[index]?.type;
              const isFirst = index === 0;
              const isLast = index === questionArray.fields.length - 1;
              return (
                <div
                  key={field.id}
                  className="border p-4 rounded mb-4 bg-gray-50 my-5"
                >
                  <div className="flex justify-between items-center mb-2 space-x-2">
                    <FormLabel>
                      Question #{index + 1} ({questionType})
                    </FormLabel>

                    <Button
                      type="button"
                      disabled={isFirst}
                      onClick={() => questionArray.move(index, index - 1)}
                      className={`w-10 font-semibold bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-xl transition-colors ${
                        isFirst ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title="Move Up"
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      disabled={isLast}
                      onClick={() => questionArray.move(index, index + 1)}
                      className={`w-10 font-semibold bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-xl transition-colors ${
                        isLast ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title="Move Down"
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      onClick={() => questionArray.remove(index)}
                      className="w-1/5 font-semibold bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
                    >
                      Remove
                    </Button>
                  </div>

                  {questionType == "FILL_IN_THE_BLANK" && (
                    <>
                      <FormField
                        control={form.control}
                        name={`quizQuestion.${index}.question`}
                        render={({ field }) => (
                          <FormItem className="mb-5">
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                              <Input {...field} type="text" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`quizQuestion.${index}.answer`}
                        render={({ field }) => {
                          const normalizedValue =
                            typeof field.value === "string" ? field.value : "";

                          return (
                            <FormItem>
                              <FormLabel>Answer</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={normalizedValue}
                                  type="text"
                                />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    </>
                  )}
                  {questionType === "MATCHING" && (
                    <>
                      <FormField
                        control={form.control}
                        name={`quizQuestion.${index}.question`}
                        render={({ field }) => (
                          <FormItem className="mb-5">
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                              <Input {...field} type="text" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`quizQuestion.${index}.pairs`}
                        render={({ field }) => {
                          const pairs = field.value || [];

                          const updatePair = (
                            i: number,
                            key: "left" | "right",
                            val: string
                          ) => {
                            const newPairs = [...pairs];
                            newPairs[i] = { ...newPairs[i], [key]: val };
                            field.onChange(newPairs);
                          };

                          const addPair = () => {
                            field.onChange([...pairs, { left: "", right: "" }]);
                          };

                          const removePair = (i: number) => {
                            const newPairs = pairs.filter(
                              (_, idx) => idx !== i
                            );
                            field.onChange(newPairs);
                          };

                          return (
                            <FormItem className="mb-5">
                              <FormLabel>Pairs</FormLabel>
                              <FormControl>
                                <div className="space-y-3">
                                  {pairs.map((pair, i) => (
                                    <div
                                      key={i}
                                      className="flex space-x-2 items-center"
                                    >
                                      <Input
                                        placeholder="Left"
                                        value={pair.left}
                                        onChange={(e) =>
                                          updatePair(i, "left", e.target.value)
                                        }
                                        className="w-1/2"
                                      />
                                      <Input
                                        placeholder="Right"
                                        value={pair.right}
                                        onChange={(e) =>
                                          updatePair(i, "right", e.target.value)
                                        }
                                        className="w-1/2"
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => removePair(i)}
                                        className="font-semibold bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
                                      >
                                        &times;
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    onClick={addPair}
                                    className="w-full font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 py-4 sm:py-5 text-base rounded-xl transition-all duration-200 shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
                                  >
                                    + Add Pair
                                  </Button>
                                </div>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name={`quizQuestion.${index}.answer`}
                        render={({ field }) => {
                          const answers = Array.isArray(field.value)
                            ? field.value
                            : [];

                          const updateAnswer = (
                            i: number,
                            key: "left" | "match",
                            val: string
                          ) => {
                            const newAnswers = [...answers];
                            newAnswers[i] = { ...newAnswers[i], [key]: val };
                            field.onChange(newAnswers);
                          };

                          const addAnswer = () => {
                            field.onChange([
                              ...answers,
                              { left: "", match: "" },
                            ]);
                          };

                          const removeAnswer = (i: number) => {
                            const newAnswers = answers.filter(
                              (_, idx) => idx !== i
                            );
                            field.onChange(newAnswers);
                          };

                          return (
                            <FormItem>
                              <FormLabel>Answer (Correct Matches)</FormLabel>
                              <FormControl>
                                <div className="space-y-3">
                                  {answers.map((answer, i) => (
                                    <div
                                      key={i}
                                      className="flex space-x-2 items-center"
                                    >
                                      <Input
                                        placeholder="Left"
                                        value={answer.left}
                                        onChange={(e) =>
                                          updateAnswer(
                                            i,
                                            "left",
                                            e.target.value
                                          )
                                        }
                                        className="w-1/2"
                                      />
                                      <Input
                                        placeholder="Match"
                                        value={answer.match}
                                        onChange={(e) =>
                                          updateAnswer(
                                            i,
                                            "match",
                                            e.target.value
                                          )
                                        }
                                        className="w-1/2"
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => removeAnswer(i)}
                                        className="font-semibold bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
                                      >
                                        &times;
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    onClick={addAnswer}
                                    className="w-full font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 py-4 sm:py-5 text-base rounded-xl transition-all duration-200 shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
                                  >
                                    + Add Answer
                                  </Button>
                                </div>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    </>
                  )}
                  {questionType === "MULTIPLE_CHOICE" && (
                    <>
                      <FormField
                        control={form.control}
                        name={`quizQuestion.${index}.question`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
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
                        name={`quizQuestion.${index}.options`}
                        render={({ field }) => {
                          const options = field.value || [];

                          const updateOption = (
                            i: number,
                            key: "option" | "value",
                            val: string
                          ) => {
                            const newOptions = [...options];
                            newOptions[i] = { ...newOptions[i], [key]: val };
                            field.onChange(newOptions);
                          };

                          const addOption = () => {
                            field.onChange([
                              ...options,
                              { option: "", value: "" },
                            ]);
                          };

                          const removeOption = (i: number) => {
                            const newOptions = options.filter(
                              (_, idx) => idx !== i
                            );
                            field.onChange(newOptions);
                          };

                          return (
                            <FormItem className="mt-5">
                              <FormLabel>Options</FormLabel>
                              <FormControl>
                                <div className="space-y-3">
                                  {options.map((opt, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center space-x-2"
                                    >
                                      <Input
                                        placeholder="Option (e.g., A, B)"
                                        value={opt.option}
                                        onChange={(e) =>
                                          updateOption(
                                            i,
                                            "option",
                                            e.target.value
                                          )
                                        }
                                        className="w-1/4"
                                      />
                                      <Input
                                        placeholder="Answer text"
                                        value={opt.value}
                                        onChange={(e) =>
                                          updateOption(
                                            i,
                                            "value",
                                            e.target.value
                                          )
                                        }
                                        className="w-3/4"
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => removeOption(i)}
                                        className="font-semibold bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
                                      >
                                        &times;
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    onClick={addOption}
                                    className="w-full my-4 font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 py-4 sm:py-5 text-base rounded-xl transition-all duration-200 shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
                                  >
                                    + Add Option
                                  </Button>
                                </div>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name={`quizQuestion.${index}.answer`}
                        render={({ field }) => {
                          const value =
                            typeof field.value === "string" ? field.value : "";

                          return (
                            <FormItem className="mt-5">
                              <FormLabel>
                                Correct Answer (Option letter)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={value}
                                  type="text"
                                  placeholder="e.g., A"
                                  className="w-full px-3 py-5 text-base border rounded-md border-gray-300 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-300"
                                />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    </>
                  )}
                  {questionType === "TRUE_FALSE" && (
                    <>
                      <FormField
                        control={form.control}
                        name={`quizQuestion.${index}.question`}
                        render={({ field }) => (
                          <FormItem className="mb-5">
                            <FormLabel>Question</FormLabel>
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
                        name={`quizQuestion.${index}.answer`}
                        render={({ field }) => {
                          const checked =
                            typeof field.value === "boolean"
                              ? field.value
                              : false;

                          return (
                            <FormItem className="flex items-center space-x-3 my-3">
                              <FormLabel>Answer (True / False)</FormLabel>
                              <FormControl>
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    </>
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
              onClick={() => router.push("/quizzes")}
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

export default QuizForm;
