import { z } from "zod";
import { Role } from "@/lib/generated/prisma";

const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid Email Address" }),
});

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

const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(8, "Password must have at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const signUpFormSchema = z
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

const contactFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid Email Address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  honeypot: z.string().max(0).optional(),
});

const verifySchema = z.object({
  token: z.string().min(1),
});

const editUserSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid Email Address" }),
  role: z.enum([Role.ADMIN, Role.USER]),
});

const unitsSchema = z.object({
  title: z.string().min(1, { message: "Unit title is requird" }),
});

const tagSchema = z.object({
  name: z.string().min(1, { message: "Tag name is required" }),
});

const vocabularySchema = z.object({
  english: z.string().min(1, { message: "English word is required" }),
  korean: z.string().min(1, { message: "Korean word is required" }),
  definition: z.string().min(1, { message: "Definition is required" }),
  lessonId: z.string().min(1, { message: "Lesson Id is required" }),
});

export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordFormSchema>;
export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
export type ContactFormSchema = z.infer<typeof contactFormSchema>;
export type ResetPasswordFormSchema = z.infer<typeof resetPasswordSchema>;
export type verifySchema = z.infer<typeof verifySchema>;
export type EditUserValues = z.infer<typeof editUserSchema>;
export type UnitsSchemaValues = z.infer<typeof unitsSchema>;
export type tagSchemaValues = z.infer<typeof tagSchema>;
export type vocabularySchemaValues = z.infer<typeof vocabularySchema>;

export {
  forgotPasswordFormSchema,
  passwordSchema,
  signUpFormSchema,
  contactFormSchema,
  resetPasswordSchema,
  verifySchema,
  editUserSchema,
  unitsSchema,
  tagSchema,
  vocabularySchema,
};
