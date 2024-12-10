import { Request, Response, NextFunction } from "express";
import Property from "../models/propertyModel";
import { GlobalErrorHandlerType } from "./errorController";
import { addPropertySchema } from "../schemas/landlordSchema";
import { formatValidationError } from "../utils/formatValidationError";

export const addProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = addPropertySchema.safeParse(req.body);

    if (!validatedData.success) {
      const errorMessages = formatValidationError(validatedData.error.issues);
      const error: GlobalErrorHandlerType = new Error(errorMessages);
      error.statusCode = 422;
      error.data = req.body;
      throw error;
    }

    const property = new Property(validatedData.data);
    const savedProperty = await property.save();

    res.status(201).json({ message: "The Property has been uploaded", propertyData: savedProperty });
  } catch (error) {
    next(error);
  }
};
