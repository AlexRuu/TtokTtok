"use client";

import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import Loader from "@/components/loader";
import useLoading from "@/hooks/use-loading";
import { cn } from "@/lib/utils";
import { editUserSchema } from "@/schemas/form-schemas";
import { EditUserValues } from "@/schemas/form-schemas";
import { Role, User } from "@/lib/generated/prisma";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

const formSchema = editUserSchema;

interface EditUserFormProps {
  initialData: User | null;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ initialData }) => {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const router = useRouter();

  const renderError = (error?: FieldError) =>
    error ? (
      <p
        className="text-sm text-red-400 -mt-1 flex items-center"
        aria-live="polite"
      >
        <CircleAlert size={15} className="mr-1" />
        {error.message}
      </p>
    ) : null;

  const form = useForm<EditUserValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          firstName: "",
          lastName: "",
          email: "",
          role: "USER",
        },
  });

  const onSubmit: SubmitHandler<EditUserValues> = async (data) => {
    startLoading();
    try {
      const res = await fetch(`/api/user/${initialData?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        toast.error("There was an error editing user.", {
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
      stopLoading();
      router.push("/users");
    } catch (error) {
      console.log(error);
      toast.error("There was an error editing user.", {
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fdfaf6] -mt-5 overflow-auto flex-col">
      {isLoading && <Loader />}
      <h1 className="text-xl md:text-2xl font-semibold py-2 sm:py-3 md:py-4">
        Edit User
      </h1>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white border border-pink-100 shadow-xs rounded-2xl p-8 pt-10 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
            {["firstName", "lastName"].map((fieldName) => (
              <div key={fieldName} className="relative w-full">
                <FormField
                  control={form.control}
                  name={fieldName as keyof EditUserValues}
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormLabel
                        htmlFor={fieldName}
                        className={cn(
                          form.formState.errors[
                            fieldName as keyof EditUserValues
                          ] && form.formState.isSubmitted
                            ? "text-red-400! before:text-red-400"
                            : ""
                        )}
                      >
                        {fieldName === "firstName"
                          ? "* First Name"
                          : "* Last Name"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id={fieldName}
                          placeholder=" "
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base shadow-xs placeholder-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300"
                        />
                      </FormControl>
                      {form.formState.isSubmitted &&
                        renderError(
                          form.formState.errors[
                            fieldName as keyof EditUserValues
                          ]
                        )}
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <div className="relative">
            <FormField
              control={form.control}
              name="email"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="email"
                    className={cn(
                      form.formState.errors.email && form.formState.isSubmitted
                        ? "text-red-400! before:text-red-400"
                        : ""
                    )}
                  >
                    * Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      {...field}
                      placeholder=" "
                      type="email"
                      onInvalid={(e) => e.preventDefault()}
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base shadow-xs placeholder-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300"
                    />
                  </FormControl>
                  {form.formState.isSubmitted &&
                    renderError(form.formState.errors.email)}
                </FormItem>
              )}
            />
          </div>

          <div className="relative">
            <FormField
              control={form.control}
              name="role"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="role"
                    className={cn(
                      form.formState.errors.role && form.formState.isSubmitted
                        ? "text-red-400! before:text-red-400"
                        : ""
                    )}
                  >
                    * Role
                  </FormLabel>
                  {form.formState.isSubmitted &&
                    renderError(form.formState.errors.role)}
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full border border-gray-300 rounded-md py-3 px-3 text-base shadow-xs focus:ring-2 focus:ring-indigo-300">
                      {field.value}
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Role).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <p className="text-sm text-gray-500 -mt-2 mb-3">
            * Indicates a required field
          </p>
          <div className="flex space-x-1">
            <Button
              className="w-full font-semibold bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-xs hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
              aria-label="Cancel"
              onClick={() => router.push("/users")}
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

export default EditUserForm;
