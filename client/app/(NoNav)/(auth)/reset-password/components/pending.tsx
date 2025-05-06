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
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import Loader from "@/components/ui/loader";
import useLoading from "@/hooks/use-loading";
import PasswordTracker from "../../signup/components/password-checker";
import { useState } from "react";
import postResetToken from "@/actions/post-reset-token";

interface PendingPasswordResetPageProps {
  setStatus: (value: "success" | "failed" | "pending") => void;
  token: string;
}

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
      "Password needs to have at least one special character (!@#$%^&*)).",
  });

const formSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(8, "Password must have at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type PasswordResetFormValues = z.infer<typeof formSchema>;

const PendingPasswordResetPage: React.FC<PendingPasswordResetPageProps> = ({
  setStatus,
  token,
}) => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<PasswordResetFormValues> = async (data) => {
    try {
      startLoading();
      const res = await postResetToken(data, token);
      if (res) {
        if (!res.ok) {
          const resError = await res.text();
          toast.error(resError || "There was an error updating your password", {
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
        setStatus("success");
        stopLoading();
      }
    } catch {
      toast.error("There was an error updating your password", {
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
      setStatus("failed");
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
          <h1 className="text-center text-2xl">Reset Password</h1>
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
                      aria-invalid={!!form.formState.errors.confirmPassword}
                      onInvalid={(e) => e.preventDefault()}
                      id="confirmPassword"
                      aria-describedby="confirmPassword-error"
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
                  {form.formState.errors.confirmPassword && (
                    <p
                      className="text-sm text-red-400 -mt-1 flex items-center"
                      aria-live="polite"
                      id="confirmPassword-error"
                    >
                      <CircleAlert size={15} className="mr-1" />
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                  <FormLabel
                    htmlFor="confirmPassword"
                    className="absolute left-3 top-3 text-sm text-gray-500 transition-all duration-200 bg-transparent px-1 
                    peer-placeholder-shown:top-2 peer-placeholder-shown:text-base cursor-text ease-in-out
                    peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-[#A1C6EA] peer-not-placeholder-shown:bg-white peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#A1C6EA] peer-focus:px-1 peer-focus:bg-white peer-invalid:text-red-400"
                  >
                    Confirm Password
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
            {form.formState.isSubmitting
              ? "Resetting Password..."
              : "Reset Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PendingPasswordResetPage;
