import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  accountType: z.enum(["Individual", "Property owner", "Property agent"], { message: "Invalid account type" }),
  password: z.string().trim().min(6, { message: "Password must be at least 6 characters" }),
});

export const addPropertySchema = z.object({
  name: z.string().trim().min(1, { message: "Name of property is required" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  phoneNumber: z.string().trim().min(10, { message: "Phone number is too short" }).max(15, { message: "Phone number is too long" }),
  description: z.string().trim().min(10, { message: "Description of the property is too short" }),
  propertyDetails: z.object({
    propertyOwnerId: z.string().refine((value) => /^[a-fA-F0-9]{24}$/.test(value), {
      message: "Invalid property owner ID",
    }),
    state: z.string().trim().min(1, { message: "State where the property is located required" }),
    LGA: z.string().trim().min(1, { message: "LGA where the property is located required" }),
    city: z.string().trim().min(1, { message: "City where the property is located required" }),
    area: z.string().trim().min(1, { message: "Area where the property is located required" }),
    numberOfRooms: z.number().int().min(1, { message: "The property must have at least 1 room." }),
  }),
});
