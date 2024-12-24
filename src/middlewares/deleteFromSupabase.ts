import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabaseClient.config";
import Property from "../models/propertyModel";
import { propertyIdSchema } from "../schemas/propertySchema";
import { formatValidationError } from "../utils/formatValidationError";
import { errorHandler } from "../utils/errorUtils";

export const deleteFilesFromSupabase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const propertyId = req.params.propertyId;
    const validatedPropertyId = propertyIdSchema.safeParse(propertyId);
    if (!validatedPropertyId.success) {
      const errorMessage = formatValidationError(validatedPropertyId.error.issues);
      throw errorHandler(errorMessage, 422);
    }

    const property = await Property.findById(validatedPropertyId.data);

    if (!property) {
      const errorMessage = "Could not find property";
      throw errorHandler(errorMessage, 404);
    }

    if (property?.propertyOwnerId.toString() !== req.userId) {
      const errorMessage = "Not authorized to edit this property";
      throw errorHandler(errorMessage, 401);
    }

    const filenames = property.imageUrls
      .map((url) => {
        const decodedUrl = decodeURIComponent(url);
        return decodedUrl.split("/").pop();
      })
      .filter((filename): filename is string => !!filename);

    const { data, error } = await supabase.storage.from("rental-marketplace-images").remove(filenames);

    if (error) {
      const errorMessage = "Failed to delete file from Supabase";
      throw errorHandler(errorMessage, 500);
    }

    next();
  } catch (error) {
    next(error);
  }
};
