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
import { useRouter } from "next/navigation";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import Loader from "@/components/ui/loader";
import useLoading from "@/hooks/use-loading";
import PasswordTracker from "./password-checker";
import { useState } from "react";
import { cn } from "@/lib/utils";
import postSignUp from "@/actions/post-signup";

const passwordSchema = z
  .string()
  .min(8, { message: "Password needs to be at least 8 characters long." })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password needs at least one uppercase letter (A-Z).",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password needs at least one lowercase letter (a-z).",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password needs at least one number (0-9).",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message:
      "Password needs to have at least one special character (!@#$%^&*).",
  });

const formSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Invalid Email Address" }),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(8, "Password must have at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [show, setShow] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    startLoading();
    try {
      const res = await postSignUp(data);
      if (res) {
        if (!res.ok) {
          const resError = await res.text();
          toast.error(resError || "There was an error creating your account", {
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
        localStorage.setItem("pendingEmail", data.email);
        stopLoading();
        router.push("/verify-email");
      }
    } catch {
      toast.error("There was an error creating your account", {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf6] p-6">
      {isLoading && <Loader />}
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white border border-pink-100 shadow-sm rounded-2xl p-8 pt-10 space-y-6"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#A1C6EA] sm:text-3xl tracking-tight">
              Create your <span className="text-[#B75F45]">Ttok</span>
              <span className="text-[#D69E78]">Ttok</span> account
            </h1>
            <p className="mt-2 text-base text-[#8E77A6]">
              Learn smarter, one tteok at a time!
            </p>
          </div>
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
                        "absolute text-sm left-3 top-3 transition-all duration-200 bg-transparent px-1",
                        "peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text ease-in-out",
                        "peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white",
                        "peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white",
                        "before:content-['*'] before:text-grey-500 before:peer-not-placeholder-shown:text-[#A1C6EA]  before:text-xs before:relative before:top-[-0.15rem] before:ml-0.5 before:-mr-1.5",
                        "peer-invalid:before:text-red-500",
                        form.formState.errors.firstName &&
                          form.formState.isSubmitted
                          ? "!text-red-400"
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
                        "absolute text-sm left-3 top-3 transition-all duration-200 bg-transparent px-1",
                        "peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text ease-in-out",
                        "peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white",
                        "peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white",
                        "before:content-['*'] before:text-grey-500 before:peer-not-placeholder-shown:text-[#A1C6EA]  before:text-xs before:relative before:top-[-0.15rem] before:ml-0.5 before:-mr-1.5",
                        "peer-invalid:before:text-red-500",
                        form.formState.errors.lastName &&
                          form.formState.isSubmitted
                          ? "!text-red-400"
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
                        ? "!text-red-400"
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
              name="password"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      onInvalid={(e) => e.preventDefault()}
                      id="password"
                      type={show ? "text" : "password"}
                      placeholder=" "
                      {...field}
                      className="shadow-sm peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400"
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="hover:cursor-pointer absolute right-3 top-5 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => {
                      setShow(!show);
                    }}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {form.formState.errors.password &&
                    form.formState.isSubmitted && (
                      <p
                        className="text-sm text-red-400 -mt-1 flex items-center"
                        aria-live="polite"
                        id="password-error"
                      >
                        <CircleAlert size={15} className="mr-1" />
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  <FormLabel
                    htmlFor="password"
                    className={cn(
                      "absolute text-sm left-3 top-3 transition-all duration-200 bg-transparent px-1",
                      "peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text ease-in-out",
                      "peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white",
                      "peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white",
                      "before:content-['*'] before:text-grey-500 before:peer-not-placeholder-shown:text-[#A1C6EA]  before:text-xs before:relative before:top-[-0.15rem] before:ml-0.5 before:-mr-1.5",
                      "peer-invalid:before:text-red-500",
                      form.formState.errors.password &&
                        form.formState.isSubmitted
                        ? "!text-red-400"
                        : "text-gray-500"
                    )}
                  >
                    Password
                  </FormLabel>
                </FormItem>
              )}
            />
            <PasswordTracker password={form.watch("password")} />
          </div>
          <div className="relative">
            <FormField
              control={form.control}
              name="confirmPassword"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      onInvalid={(e) => e.preventDefault()}
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder=" "
                      {...field}
                      className="shadow-sm peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400"
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="hover:cursor-pointer absolute right-3 top-5 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    onClick={() => {
                      setShowConfirm(!showConfirm);
                    }}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {form.formState.errors.confirmPassword &&
                    form.formState.isSubmitted && (
                      <p
                        className="text-sm text-red-400 -mt-1 flex items-center"
                        aria-live="polite"
                        id="password-error"
                      >
                        <CircleAlert size={15} className="mr-1" />
                        {form.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  <FormLabel
                    htmlFor="confirmPassword"
                    className={cn(
                      "absolute text-sm left-3 top-3 transition-all duration-200 bg-transparent px-1",
                      "peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text ease-in-out",
                      "peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white",
                      "peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white",
                      "before:content-['*'] before:text-grey-500 before:peer-not-placeholder-shown:text-[#A1C6EA]  before:text-xs before:relative before:top-[-0.15rem] before:ml-0.5 before:-mr-1.5",
                      "peer-invalid:before:text-red-500",
                      form.formState.errors.confirmPassword &&
                        form.formState.isSubmitted
                        ? "!text-red-400"
                        : "text-gray-500"
                    )}
                  >
                    Confirm Password
                  </FormLabel>
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
            aria-label="Sign Up"
            aria-busy={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
            aria-live="assertive"
          >
            {form.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
