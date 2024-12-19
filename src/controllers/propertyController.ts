import { Request, Response, NextFunction } from "express";
import Property from "../models/propertyModel";
import { GlobalErrorHandlerType } from "./errorController";
import { addPropertySchema, propertyIdSchema, editPropertySchema } from "../schemas/propertySchema";
import { formatValidationError } from "../utils/formatValidationError";

export const getPropertiesWithSearchTerm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentPage = Math.max(1, +(req.query.page as string) || 1);
    let perPage = +(req.query.perPage as string) || 10;

    const filter: any = {};

    // Search across multiple fields using the `search` keyword
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: "i" };
      filter.$or = [{ state: searchRegex }, { LGA: searchRegex }, { city: searchRegex }, { area: searchRegex }, { description: searchRegex }];
    }

    const totalProperties = await Property.find().countDocuments();

    if (!req.query.page && !req.query.perPage) perPage = totalProperties;

    const properties = await Property.find(filter)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .lean();

    res.status(200).json({ message: "Fetched properties successfully", properties, totalProperties });
  } catch (error) {
    next(error);
  }
};

export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentPage = Math.max(1, +(req.query.page as string) || 1);
    let perPage = +(req.query.perPage as string) || 10;

    const filter: any = {};

    if (req.query.state) filter.state = req.query.state;
    if (req.query.LGA) filter.LGA = req.query.LGA;
    if (req.query.city) filter.city = req.query.city;
    if (req.query.propertyType) filter.propertyType = req.query.propertyType;
    if (req.query.forSaleOrRent) filter.forSaleOrRent = req.query.forSaleOrRent;

    if (req.query.numberOfRooms) filter.numberOfRooms = +req.query.numberOfRooms;

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = +req.query.minPrice;
      if (req.query.maxPrice) filter.price.$lte = +req.query.maxPrice;
    }

    const totalProperties = await Property.find().countDocuments();

    if (!req.query.page && !req.query.perPage) perPage = totalProperties;

    const properties = await Property.find(filter)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .lean();

    res.status(200).json({ message: "Fetched properties successfully", properties, totalProperties });
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

    const property = await Property.findById(validatedPropertyId.data).populate("propertyOwnerId").lean();

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
      error.data = req.body;
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
