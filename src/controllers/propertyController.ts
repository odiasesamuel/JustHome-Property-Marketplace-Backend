import { Request, Response, NextFunction } from "express";
import Property from "../models/propertyModel";
import { GlobalErrorHandlerType } from "./errorController";
import { addPropertySchema } from "../schemas/userSchema";
import { formatValidationError } from "../utils/formatValidationError";

export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const properties = await Property.find();

    res.status(200).json({ message: "Fetched properties successfully", properties });
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params.propertyId;
    const property = await Property.findById(params);

    if (!property) {
      const error: GlobalErrorHandlerType = new Error("Could not find property");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Fetched property successfully", property });
  } catch (error) {
    next(error);
  }
};

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
