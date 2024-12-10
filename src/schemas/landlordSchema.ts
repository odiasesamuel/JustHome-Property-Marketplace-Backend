import { z } from "zod";

export const createLandlordSchema = z.object({
  firstName: z.string().min(6, "First name is required"),
  lastName: z.string().min(6, " Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
