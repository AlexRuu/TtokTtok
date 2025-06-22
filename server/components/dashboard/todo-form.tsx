"use client";

import useLoading from "@/hooks/use-loading";
import { todoSchema, todoSchemaValues } from "@/schemas/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import Loader from "../loader";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const TodoForm = ({ onAdd }: { onAdd: () => void }) => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const formSchema = todoSchema;
  const router = useRouter();

  const form = useForm<todoSchemaValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const onSubmit: SubmitHandler<todoSchemaValues> = async (data) => {
    startLoading();
    try {
      const res = await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        toast.error("There was an error creating the todo item.", {
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
        return;
      }
      form.reset();
      onAdd();
      stopLoading();
    } catch (error) {
      console.log(error);
      toast.error("There was an error creating the todo item.", {
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
    <div>
      {isLoading && <Loader />}
      <Form {...form}>
        <form
          className="flex items-center"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem className="w-3/4 mr-2">
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
          <Button
            type="submit"
            className="w-1/4 font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 py-4 sm:py-5 text-base rounded-xl transition-all duration-200 shadow-xs hover:scale-[1.01] hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
            aria-busy={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
            aria-live="assertive"
          >
            {form.formState.isSubmitting ? "Adding..." : "Add"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TodoForm;
