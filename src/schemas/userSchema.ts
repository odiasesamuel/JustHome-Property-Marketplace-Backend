import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  accountType: z.enum(["Individual", "Property owner", "Property agent"], { message: "Invalid account type" }),
  password: z.string().trim().min(6, { message: "Password must be at least 6 characters" }),
});

export const loginSchema = z.object({
  email: z.string().toLowerCase().trim().email({ message: "Invalid email address" }),
  password: z.string().trim().min(6, { message: "Password must be at least 6 characters" }),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});
