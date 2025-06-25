"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProviders, signIn, ClientSafeProvider } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import Loader from "@/components/ui/loader";
import useLoading from "@/hooks/use-loading";
import { cn } from "@/lib/utils";
import LogoTitle from "../../components/logo";

type ProviderId = "github" | "google" | "discord";

const providerIcons: Record<ProviderId, string> = {
  github: "/github.svg",
  google: "/google.svg",
  discord: "/discord.svg",
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid Email Address" }),
  password: z.string().min(1, "Password required."),
});

type SignInFormValues = z.infer<typeof formSchema>;

const SignInForm = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);

  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const debounceFetch = setTimeout(async () => {
      startLoading();
      try {
        const res = await getProviders();
        setProviders(res);
      } catch (err) {
        console.error("Failed to fetch providers:", err);
      } finally {
        stopLoading();
      }
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [startLoading, stopLoading]);

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    startLoading();
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.error) {
      stopLoading();
      form.setError("email", {
        type: "manual",
        message: "",
      });
      form.setError("password", {
        type: "manual",
        message: "",
      });
      toast.error("Invalid email or password.", {
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
    } else {
      stopLoading();
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf6] p-6 px-4">
      {isLoading && <Loader />}
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto p-8 border border-pink-100 bg-white shadow-sm rounded-2xl pt-10"
        >
          <LogoTitle />
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
                      id="email"
                      {...field}
                      placeholder=" "
                      onInvalid={(e) => e.preventDefault()}
                      className={cn(
                        "peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400",
                        form.formState.errors.email &&
                          form.formState.isSubmitted
                          ? "border-red-400 focus:ring-red-400"
                          : ""
                      )}
                    />
                  </FormControl>
                  {form.formState.errors.email?.message &&
                    form.formState.errors.email.message !== "" &&
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
              name="password"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      onInvalid={(e) => e.preventDefault()}
                      id="password"
                      type="password"
                      placeholder=" "
                      {...field}
                      className={cn(
                        "peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400",
                        form.formState.errors.password &&
                          form.formState.isSubmitted
                          ? "border-red-400 focus:ring-red-400"
                          : ""
                      )}
                    />
                  </FormControl>
                  {form.formState.errors.password?.message &&
                    form.formState.errors.password.message !== "" &&
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
                      form.formState.errors.password &&
                        form.formState.isSubmitted
                        ? "text-red-400!"
                        : "text-gray-500"
                    )}
                  >
                    Password
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end -mt-6 mb-2">
            <Link
              href="/forgot-password"
              aria-label="Forgot your password?"
              aria-live="assertive"
              className="text-sm text-[#8AA4C1] hover:text-[#8E77A6] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md rounded-xl transition-colors shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
            focus-visible="outline"
            aria-label="Sign in to your account"
            disabled={isLoading || form.formState.isSubmitting}
            aria-busy={isLoading || form.formState.isSubmitting}
            aria-live="assertive"
          >
            {form.formState.isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">
            By logging in, you agree to our{" "}
            <Link
              href="/tos"
              className="text-blue-600 underline hover:text-blue-500"
            >
              Terms of Service
            </Link>
            .
          </p>
          <p className="text-center">
            Don&apos;t have an account?
            <Link
              href="/signup"
              className="text-[#8AA4C1] hover:text-[#8E77A6] transition-colors pl-2"
            >
              Sign Up
            </Link>
          </p>
          <div className="flex justify-center items-center">
            <hr className=" w-1/2 mr-2 border-none h-[0.5px] bg-gray-300 text-gray-300" />
            <h3 className="text-center">OR</h3>
            <hr className="w-1/2 ml-2 border-none h-[0.5px] bg-gray-300 text-gray-300" />
          </div>
          <div className="p-6 -mt-12">
            {providers &&
              Object.values(providers)
                .filter((provider) => provider.id !== "credentials")
                .map((provider) => (
                  <div key={provider.name} className="text-center my-4">
                    <Button
                      type="button"
                      disabled={isLoading}
                      focus-visible="outline"
                      aria-live="assertive"
                      onClick={() => signIn(provider.id)}
                      aria-label={`Sign in with ${provider.name}`}
                      className="flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md bg-pink-200 hover:bg-pink-300 text-black w-full font-semibold rounded-xl transition-colors shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
                    >
                      <Image
                        src={providerIcons[provider.id as ProviderId]}
                        alt={`${provider.name} logo`}
                        width={20}
                        height={20}
                      />
                      Continue with {provider.name}
                    </Button>
                  </div>
                ))}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
