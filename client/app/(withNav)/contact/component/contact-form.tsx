"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { CircleAlert } from "lucide-react";
import Loader from "@/components/ui/loader";
import useLoading from "@/hooks/use-loading";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import postContact from "@/actions/post-contact";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid Email Address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  honeypot: z.string().optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  setSubmitted: (value: boolean) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ setSubmitted }) => {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
      honeypot: "",
    },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    startLoading();
    try {
      const res = await postContact(data);
      if (res) {
        if (!res.ok) {
          const resError = await res.text();
          toast.error(resError || "There was an error submitting your form.", {
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
        setSubmitted(true);
      }
    } catch {
      toast.error("There was an error submitting your form.", {
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
    <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center bg-[#fdfaf6]">
      {isLoading && <Loader />}
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-md bg-white border border-pink-100 shadow-sm rounded-2xl p-8 py-10 space-y-8"
        >
          <div className="flex space-x-6">
            <div className="relative">
              <FormField
                control={form.control}
                name="firstName"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        onInvalid={(e) => e.preventDefault()}
                        id="firstName"
                        {...field}
                        placeholder=" "
                        className="shadow-sm peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400"
                      />
                    </FormControl>
                    {form.formState.errors.firstName &&
                      form.formState.isSubmitted && (
                        <p
                          id="firstName-error"
                          className="text-sm text-red-400 -mt-1 flex items-center"
                          aria-live="polite"
                        >
                          <CircleAlert size={15} className="mr-1" />
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    <FormLabel
                      htmlFor="firstName"
                      className={cn(
                        "text-xs absolute md:text-sm left-3 top-3 transition-all duration-200 bg-transparent px-1",
                        "peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm  sm:peer-placeholder-shown:text-base cursor-text ease-in-out",
                        "peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white",
                        "peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white",
                        "before:content-['*'] before:text-grey-500 before:peer-not-placeholder-shown:text-[#A1C6EA]  before:text-xs before:relative before:top-[-0.15rem] before:ml-0.5 before:-mr-1.5",
                        "peer-invalid:before:text-red-500",
                        form.formState.errors.firstName &&
                          form.formState.isSubmitted
                          ? "text-red-400!"
                          : "text-gray-500"
                      )}
                    >
                      First Name
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="relative">
              <FormField
                control={form.control}
                name="lastName"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        onInvalid={(e) => e.preventDefault()}
                        id="lastName"
                        {...field}
                        placeholder=" "
                        className="shadow-sm peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400"
                      />
                    </FormControl>
                    {form.formState.errors.lastName &&
                      form.formState.isSubmitted && (
                        <p
                          id="lastName-error"
                          className="text-sm text-red-400 -mt-1 flex items-center"
                          aria-live="polite"
                        >
                          <CircleAlert size={15} className="mr-1" />
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    <FormLabel
                      htmlFor="lastName"
                      className={cn(
                        "text-xs absolute md:text-sm left-3 top-3 transition-all duration-200 bg-transparent px-1",
                        "peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm  sm:peer-placeholder-shown:text-base cursor-text ease-in-out",
                        "peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white",
                        "peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white",
                        "before:content-['*'] before:text-grey-500 before:peer-not-placeholder-shown:text-[#A1C6EA]  before:text-xs before:relative before:top-[-0.15rem] before:ml-0.5 before:-mr-1.5",
                        "peer-invalid:before:text-red-500",
                        form.formState.errors.lastName &&
                          form.formState.isSubmitted
                          ? "text-red-400!"
                          : "text-gray-500"
                      )}
                    >
                      Last Name
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="relative">
            <FormField
              control={form.control}
              name="email"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      onInvalid={(e) => e.preventDefault()}
                      id="email"
                      {...field}
                      placeholder=" "
                      className="shadow-sm peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400"
                    />
                  </FormControl>
                  {form.formState.errors.email &&
                    form.formState.isSubmitted && (
                      <p
                        id="email-error"
                        className="text-sm text-red-400 -mt-1 flex items-center"
                        aria-live="polite"
                      >
                        <CircleAlert size={15} className="mr-1" />
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  <FormLabel
                    htmlFor="email"
                    className={cn(
                      "absolute text-sm left-3 top-3 transition-all duration-200 bg-transparent px-1",
                      "peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text ease-in-out",
                      "peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white",
                      "peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white",
                      "before:content-['*'] before:text-grey-500 before:peer-not-placeholder-shown:text-[#A1C6EA]  before:text-xs before:relative before:top-[-0.15rem] before:ml-0.5 before:-mr-1.5",
                      "peer-invalid:before:text-red-500",
                      form.formState.errors.email && form.formState.isSubmitted
                        ? "text-red-400!"
                        : "text-gray-500"
                    )}
                  >
                    Email
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className="relative">
            <FormField
              control={form.control}
              name="subject"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      onInvalid={(e) => e.preventDefault()}
                      id="subject"
                      {...field}
                      placeholder=" "
                      className="shadow-sm peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400"
                    />
                  </FormControl>
                  {form.formState.errors.subject &&
                    form.formState.isSubmitted && (
                      <p
                        id="subject-error"
                        className="text-sm text-red-400 -mt-1 flex items-center"
                        aria-live="polite"
                      >
                        <CircleAlert size={15} className="mr-1" />
                        {form.formState.errors.subject.message}
                      </p>
                    )}
                  <FormLabel
                    htmlFor="subject"
                    className={cn(
                      "absolute text-sm left-3 top-3 transition-all duration-200 bg-transparent px-1",
                      "peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text ease-in-out",
                      "peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white",
                      "peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white",
                      "before:content-['*'] before:text-grey-500 before:peer-not-placeholder-shown:text-[#A1C6EA]  before:text-xs before:relative before:top-[-0.15rem] before:ml-0.5 before:-mr-1.5",
                      "peer-invalid:before:text-red-500",
                      form.formState.errors.subject &&
                        form.formState.isSubmitted
                        ? "text-red-400!"
                        : "text-gray-500"
                    )}
                  >
                    Subject
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className="relative">
            <FormField
              control={form.control}
              name="message"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      onInvalid={(e) => e.preventDefault()}
                      id="message"
                      {...field}
                      placeholder=" "
                      className="shadow-sm peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400"
                    />
                  </FormControl>
                  {form.formState.errors.message &&
                    form.formState.isSubmitted && (
                      <p
                        id="message-error"
                        className="text-sm text-red-400 -mt-1 flex items-center"
                        aria-live="polite"
                      >
                        <CircleAlert size={15} className="mr-1" />
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  <FormLabel
                    htmlFor="message"
                    className={cn(
                      "absolute text-sm left-3 top-3 transition-all duration-200 bg-transparent px-1",
                      "peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text ease-in-out",
                      "peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white",
                      "peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white",
                      "before:content-['*'] before:text-grey-500 before:peer-not-placeholder-shown:text-[#A1C6EA]  before:text-xs before:relative before:top-[-0.15rem] before:ml-0.5 before:-mr-1.5",
                      "peer-invalid:before:text-red-500",
                      form.formState.errors.message &&
                        form.formState.isSubmitted
                        ? "text-red-400!"
                        : "text-gray-500"
                    )}
                  >
                    Message
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className="relative sr-only" aria-hidden="true">
            <FormField
              control={form.control}
              name="honeypot"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="honeypot">
                    Leave this field empty
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="honeypot"
                      onInvalid={(e) => e.preventDefault()}
                      type="text"
                      {...field}
                      tabIndex={-1}
                      autoComplete="off"
                      placeholder=" "
                      className="peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <p className="text-sm -mt-3 text-gray-500 mb-3">
            * Indicates a required field
          </p>
          <Button
            type="submit"
            className="w-full font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
            focus-visible="outline"
            aria-label="Submit"
            aria-busy={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
            aria-live="assertive"
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
