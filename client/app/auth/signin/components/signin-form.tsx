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

const providerIcons: Record<string, React.JSX.Element> = {
  github: (
    <Image
      role="img"
      aria-label="Github Logo"
      src="/github.svg"
      alt="GitHub Logo"
      width={10}
      height={10}
      className="bg-transparent w-5 h-5"
    />
  ),
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid Email Address" }),
  password: z.string().min(6, "Invalid Password"),
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
  });

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    startLoading();
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.error) {
      stopLoading();
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
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto p-8 border border-pink-100 bg-white shadow-sm rounded-2xl"
        >
          <h1 className="text-center text-2xl">Login</h1>
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
                      onInvalid={(e) => e.preventDefault()}
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
                    className="absolute text-sm left-3 top-3 text-gray-500 transition-all duration-200 ease-in-out bg-transparent px-1 
                    peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text
                    peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white peer-invalid:text-red-400"
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
                      aria-invalid={!!form.formState.errors.password}
                      onInvalid={(e) => e.preventDefault()}
                      id="password"
                      aria-describedby="password-error"
                      type="password"
                      placeholder=" "
                      {...field}
                      className="shadow-sm peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:ring-2 focus:ring-indigo-400"
                    />
                  </FormControl>
                  {form.formState.errors.password && (
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
                    className="absolute left-3 top-3 text-sm text-gray-500 transition-all duration-200 bg-transparent px-1 
                    peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text ease-in-out
                    peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white peer-invalid:text-red-400"
                  >
                    Password
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end -mt-6 mb-2">
            <Link
              href="/auth/forgot-password"
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
            aria-busy={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
            aria-live="assertive"
          >
            {form.formState.isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[#8AA4C1] hover:text-[#8E77A6] transition-colors"
            >
              Sign Up
            </Link>
          </p>
          <div className="flex justify-center items-center">
            <hr className=" w-1/2 mr-2 border-none h-[0.5px] bg-gray-300 text-gray-300" />
            <h3 className="text-center">OR</h3>
            <hr className="w-1/2 ml-2 border-none h-[0.5px] bg-gray-300 text-gray-300" />
          </div>
          <div className="p-6 -mt-3">
            {providers &&
              Object.values(providers)
                .filter((provider) => provider.id !== "credentials")
                .map((provider) => (
                  <div key={provider.name} className="text-center">
                    <Button
                      disabled={isLoading}
                      focus-visible="outline"
                      aria-live="assertive"
                      onClick={() => signIn(provider.id)}
                      aria-label={`Sign in with ${provider.name}`}
                      className="flex items-center justify-center gap-2 hover:cursor-pointer py-4 sm:py-5 text-base sm:text-md bg-pink-200 hover:bg-pink-300 text-black w-full font-semibold rounded-xl transition-colors shadow-sm hover:scale-[1.01] hover:shadow-md duration-200 ease-in-out focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
                    >
                      {providerIcons[provider.id]}
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
