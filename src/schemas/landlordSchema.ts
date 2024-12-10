import { z } from "zod";

export const createLandlordSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, " Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const addPropertySchema = z.object({
  name: z.string().min(1, "Name of property is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number is too short").max(15, "Phone number is too long"),
  description: z.string().min(10, "Description of the property is too short"),
  propertyDetails: z.object({
    city: z.string().min(1, "City where the property is located required"),
    area: z.string().min(1, "Area where the property is located required"),
    numberOfRooms: z.number().int().min(1, { message: "The property must have at least 1 room." }),
  }),
});
