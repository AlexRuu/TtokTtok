"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { CircleAlert, KeyRound } from "lucide-react";
import Loader from "@/components/ui/loader";
import useLoading from "@/hooks/use-loading";
import { useState } from "react";
import EmailSent from "./email-sent";
import { cn } from "@/lib/utils";
import postForgotPassword from "@/actions/post-forgot-password";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid Email Address" }),
});

type SignInFormValues = z.infer<typeof formSchema>;

const ForgotPasswordForm = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [sent, setSent] = useState(false);

  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    startLoading();

    try {
      await postForgotPassword(data.email);
      stopLoading();
      setSent(true);
    } catch {
      stopLoading();
      setSent(true);
    }
    return;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf6] p-6 px-4">
      {isLoading && <Loader />}
      {sent ? (
        <EmailSent />
      ) : (
        <Form {...form}>
          <form
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              const valid = await form.trigger("email");
              if (!valid) return;
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-8 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto p-8 border border-pink-100 bg-white shadow-sm rounded-2xl"
          >
            <KeyRound size={50} className="mx-auto" color="#7c86ff" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
              Forgot Password
            </h1>
            <p className="text-base text-center">
              Enter the email you used to create your account. We&apos;ll send
              you a link so you can set a new password.
            </p>
            <div className="relative">
              <FormField
                control={form.control}
                name="email"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        aria-invalid={!!form.formState.errors.email}
                        aria-describedby="email-error"
                        type="email"
                        id="email"
                        {...field}
                        placeholder=" "
                        className="shadow-sm peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400"
                      />
                    </FormControl>
                    {form.formState.errors.email && (
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
                        "absolute text-sm left-3 top-3 transition-all duration-200 ease-in-out bg-transparent px-1",
                        "peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text",
                        "peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white",
                        form.formState.errors.email &&
                          form.formState.isSubmitted
                          ? "text-red-400"
                          : "text-gray-500"
                      )}
                    >
                      Email
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
              focus-visible="outline"
              aria-label="Reset Password"
              aria-busy={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
              aria-live="assertive"
            >
              Reset Password
            </Button>
            <Button
              type="button"
              onClick={() => {
                router.push("/signin");
              }}
              className="w-full font-semibold bg-pink-200 hover:bg-pink-300 text-pink-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-pink-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-400"
              focus-visible="outline"
              aria-label="Cancel"
              aria-busy={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
              aria-live="assertive"
            >
              Cancel
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
