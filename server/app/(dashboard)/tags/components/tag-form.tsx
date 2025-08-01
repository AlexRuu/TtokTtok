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
import { tagActions } from "@/actions/form-actions";
import useLoading from "@/hooks/use-loading";
import { Tag } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { tagSchema, tagSchemaValues } from "@/schemas/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { startTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const formSchema = tagSchema;

interface TagFormProps {
  initialData: Tag | null;
}

const TagForm: React.FC<TagFormProps> = ({ initialData }) => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const form = useForm<tagSchemaValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          name: "",
          backgroundColour: "",
          textColour: "",
          borderColour: "",
        },
  });

  const onSubmit: SubmitHandler<tagSchemaValues> = async (data) => {
    startLoading();
    try {
      const action = initialData ? "PATCH" : "POST";
      tagActions(data, action, stopLoading, initialData?.id);
      startTransition(() => {
        router.refresh();
        stopLoading();
        router.push("/tags");
      });
    } catch (error) {
      console.log(error);
      toast.error("There was an error updating unit.", {
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fdfaf6] -mt-10 overflow-auto flex-col">
      {isLoading && <Loader />}
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white border border-pink-100 shadow-xs rounded-2xl p-8 pt-10 space-y-6"
        >
          <h1 className="text-center text-xl md:text-2xl font-semibold py-2 sm:py-3 md:py-4">
            {initialData ? "Edit Tag" : "Create Tag"}
          </h1>
          <div className="flex sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
            <div className="relative w-full">
              <FormField
                control={form.control}
                name="name"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="name"
                      className={cn(
                        form.formState.errors.name && form.formState.isSubmitted
                          ? "text-red-400! before:text-red-400"
                          : ""
                      )}
                    >
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="name"
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
          </div>
          <div>
            <FormField
              control={form.control}
              name="backgroundColour"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="backgroundColour"
                    className={cn(
                      form.formState.errors.name && form.formState.isSubmitted
                        ? "text-red-400! before:text-red-400"
                        : ""
                    )}
                  >
                    Background Colour
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="backgroundColour"
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
          <div>
            <FormField
              control={form.control}
              name="textColour"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="textColour"
                    className={cn(
                      form.formState.errors.name && form.formState.isSubmitted
                        ? "text-red-400! before:text-red-400"
                        : ""
                    )}
                  >
                    Text Colour
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="textColour"
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
          <div>
            <FormField
              control={form.control}
              name="borderColour"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="borderColour"
                    className={cn(
                      form.formState.errors.name && form.formState.isSubmitted
                        ? "text-red-400! before:text-red-400"
                        : ""
                    )}
                  >
                    Border Colour
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="borderColour"
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
          <div className="flex space-x-1">
            <Button
              className="w-full font-semibold bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
              aria-label="Cancel"
              onClick={() => router.push("/tags")}
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

export default TagForm;
