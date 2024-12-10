import { Request, Response, NextFunction } from "express";
import Landlord from "../models/landlordModel";
import { GlobalErrorHandlerType } from "./errorController";
import { createLandlordSchema } from "../schemas/landlordSchema";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createLandlordSchema.safeParse(req.body);

    if (!validatedData.success) {
      const errorMessages = validatedData.error.issues.map((err) => err.message).join(", ");
      const error: GlobalErrorHandlerType = new Error(errorMessages);
      error.statusCode = 422;
      error.data = req.body;
      throw error;
    }

    const landlord = new Landlord(validatedData.data);
    await landlord.save();

    res.status(201).json({ message: "Landlord account has been created", data: validatedData.data });
  } catch (error) {
    next(error);
  }
};
