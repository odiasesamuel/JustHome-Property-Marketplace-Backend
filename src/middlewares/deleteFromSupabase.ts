import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabaseClient.config";
import Property from "../models/propertyModel";
import { propertyIdSchema } from "../schemas/propertySchema";
import { formatValidationError } from "../utils/formatValidationError";
import { GlobalErrorHandlerType } from "../middlewares/errorHandler";

export const deleteFilesFromSupabase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const propertyId = req.params.propertyId;
    const validatedPropertyId = propertyIdSchema.safeParse(propertyId);
    if (!validatedPropertyId.success) {
      const errorMessages = formatValidationError(validatedPropertyId.error.issues);
      const error: GlobalErrorHandlerType = new Error(errorMessages);
      error.statusCode = 422;
      throw error;
    }

    const property = await Property.findById(validatedPropertyId.data);

    if (!property) {
      const error: GlobalErrorHandlerType = new Error("Could not find property");
      error.statusCode = 404;
      throw error;
    }

    const filenames = property.imageUrls
      .map((url) => {
        const decodedUrl = decodeURIComponent(url);
        return decodedUrl.split("/").pop();
      })
      .filter((filename): filename is string => !!filename);

    const { data, error } = await supabase.storage.from("rental-marketplace-images").remove(filenames);

    if (error) {
      const error: GlobalErrorHandlerType = new Error("Failed to delete file from Supabase");
      error.statusCode = 500;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};
