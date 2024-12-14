import { z } from "zod";

export const propertyIdSchema = z.string().refine((value) => /^[a-fA-F0-9]{24}$/.test(value), {
  message: "Invalid property owner ID",
});


export const addPropertySchema = z.object({
  name: z.string().trim().min(1, { message: "Name of property is required" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  phoneNumber: z.string().trim().min(10, { message: "Phone number is too short" }).max(15, { message: "Phone number is too long" }),
  state: z.string().trim().min(1, { message: "State where the property is located is required" }),
  LGA: z.string().trim().min(1, { message: "LGA where the property is located is required" }),
  city: z.string().trim().min(1, { message: "City where the property is located is required" }),
  area: z.string().trim().min(1, { message: "Area where the property is located is required" }),
  description: z.string().trim().min(10, { message: "Description of the property is too short" }),
  numberOfRooms: z.number().int().min(1, { message: "The property must have at least 1 room" }),
  propertyType: z.enum(["Duplex", "Flat"], { message: "Property type must be either 'Duplex' or 'Flat'" }),
  forSaleOrRent: z.enum(["Rent", "Sale"], { message: "Property must be either for sale or rent" }),
  price: z.number().int().min(0, { message: "Price must be a positive number" }),
  propertyOwnerId: z.string().refine((value) => /^[a-fA-F0-9]{24}$/.test(value), {
    message: "Invalid property owner ID",
  }),
  imageUrls: z.array(z.string().trim().min(1, { message: "The image wasn't properly uploaded" })),
});

export const editPropertySchema = z.object({
  name: z.string().trim().min(1, { message: "Name of property is required" }).optional(),
  email: z.string().trim().email({ message: "Invalid email address" }).optional(),
  phoneNumber: z.string().trim().min(10, { message: "Phone number is too short" }).max(15, { message: "Phone number is too long" }).optional(),
  description: z.string().trim().min(10, { message: "Description of the property is too short" }).optional(),
  propertyDetails: z
    .object({
      propertyOwnerId: z.string().refine((value) => /^[a-fA-F0-9]{24}$/.test(value), {
        message: "Invalid property owner ID",
      }),
      state: z.string().trim().min(1, { message: "State where the property is located required" }).optional(),
      LGA: z.string().trim().min(1, { message: "LGA where the property is located required" }).optional(),
      city: z.string().trim().min(1, { message: "City where the property is located required" }).optional(),
      area: z.string().trim().min(1, { message: "Area where the property is located required" }).optional(),
      numberOfRooms: z.number().int().min(1, { message: "The property must have at least 1 room." }).optional(),
    })
    .optional(),
});
