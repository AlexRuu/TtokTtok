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

const providerIcons: Record<string, React.JSX.Element> = {
  github: (
    <Image
      src="/github.svg"
      alt="GitHub Logo"
      width={10}
      height={10}
      className="bg-white w-5 h-5"
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
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.error) {
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
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf6] p-6 px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-sm mx-auto p-6 border border-pink-100 bg-white shadow-sm rounded-2xl"
        >
          <h1 className="text-center text-2xl">Login</h1>
          <div className="relative">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      onInvalid={(e) => e.preventDefault()}
                      autoComplete="off"
                      id="email"
                      {...field}
                      placeholder=" "
                      className="shadow-sm peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:border-blue-400 focus:outline-none"
                    />
                  </FormControl>
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-400 -mt-1 flex items-center">
                      <CircleAlert size={15} className="mr-1" />
                      {form.formState.errors.email.message}
                    </p>
                  )}
                  <FormLabel
                    htmlFor="email"
                    className="absolute left-3 top-3 text-sm text-gray-500 transition-all duration-200 bg-transparent px-1 
                    peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text
                    peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white"
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
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder=" "
                      {...field}
                      className="shadow-sm peer w-full rounded-md border border-gray-300 bg-transparent px-3 py-5 text-base placeholder-transparent focus:border-blue-400 focus:outline-none"
                    />
                  </FormControl>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-400 -mt-1 flex items-center">
                      <CircleAlert size={15} className="mr-1" />
                      {form.formState.errors.password.message}
                    </p>
                  )}
                  <FormLabel
                    htmlFor="password"
                    className="absolute left-3 top-3 text-sm text-gray-500 transition-all duration-200 bg-transparent px-1 
                    peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text
                    peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white"
                  >
                    Password
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full py-5 font-semibold bg-indigo-200 hover:bg-indigo-300 text-indigo-900 rounded-xl transition-colors shadow-sm hover:cursor-pointer"
          >
            Login
          </Button>
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[#A1C6EA] hover:text-[#7A9CC8]"
            >
              Sign Up
            </Link>
          </p>
          <div className="flex justify-center items-center">
            <hr className="w-1/2 mr-2 border-none h-[0.5px] text-black bg-black" />
            <h3 className="text-center">OR</h3>
            <hr className="w-1/2 ml-2 border-none h-[0.5px] text-black bg-black" />
          </div>
          <div className="p-6 -mt-3">
            {providers &&
              Object.values(providers)
                .filter((provider) => provider.id !== "credentials")
                .map((provider) => (
                  <div key={provider.name} className="text-center">
                    <Button
                      onClick={() => signIn(provider.id)}
                      className="space-y-2 hover:cursor-pointer bg-pink-200 hover:bg-pink-300 border border-gray-200 w-full text-black py-5 font-semibold rounded-xl transition-colors shadow-sm"
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
