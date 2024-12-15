import { Request, Response, NextFunction } from "express";
import Property from "../models/propertyModel";
import { GlobalErrorHandlerType } from "./errorController";
import { addPropertySchema, propertyIdSchema, editPropertySchema } from "../schemas/propertySchema";
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
    const propertyId = req.params.propertyId;
    const validatedPropertyId = propertyIdSchema.safeParse(propertyId);
    if (!validatedPropertyId.success) {
      const errorMessages = formatValidationError(validatedPropertyId.error.issues);
      const error: GlobalErrorHandlerType = new Error(errorMessages);
      error.statusCode = 422;
      throw error;
    }

    const property = await Property.findById(validatedPropertyId.data).populate("propertyOwnerId");

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
    req.body.price = +req.body.price;
    req.body.numberOfRooms = +req.body.numberOfRooms;
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
    console.log(error);
    next(error);
  }
};

export const editProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyId = req.params.propertyId;
    const validatedPropertyId = propertyIdSchema.safeParse(propertyId);
    if (!validatedPropertyId.success) {
      const errorMessages = formatValidationError(validatedPropertyId.error.issues);
      const error: GlobalErrorHandlerType = new Error(errorMessages);
      error.statusCode = 422;
      throw error;
    }

    const validatedUpdatedData = editPropertySchema.safeParse(req.body);
    if (!validatedUpdatedData.success) {
      const errorMessages = formatValidationError(validatedUpdatedData.error.issues);
      const error: GlobalErrorHandlerType = new Error(errorMessages);
      error.statusCode = 422;
      throw error;
    }

    const editedData = await Property.findByIdAndUpdate(validatedPropertyId.data, validatedUpdatedData.data, { new: true });

    res.status(200).json({ message: "The Property data has been successfully updated", propertyData: editedData });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyId = req.params.propertyId;
    const validatedPropertyId = propertyIdSchema.safeParse(propertyId);
    if (!validatedPropertyId.success) {
      const errorMessages = formatValidationError(validatedPropertyId.error.issues);
      const error: GlobalErrorHandlerType = new Error(errorMessages);
      error.statusCode = 422;
      throw error;
    }

    const deletedData = await Property.findByIdAndDelete(validatedPropertyId.data);

    if (!deletedData) {
      const error: GlobalErrorHandlerType = new Error("Could not find property");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Property have been successfully deleted", propertyData: deletedData });
  } catch (error) {
    next(error);
  }
};

export const editPropertyImageUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyId = req.params.propertyId;

    const property = await Property.findById(propertyId);

    if (!property) {
      const error: GlobalErrorHandlerType = new Error("Could not find property");
      error.statusCode = 404;
      throw error;
    }

    const imageUrls = req.body.imageUrls;

    property.imageUrls = imageUrls;
    await property.save();

    res.status(200).json({ message: "Property Image has been successfully updated", updatedProperty: property });
  } catch (error) {
    next(error);
  }
};
