import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel";
import { GlobalErrorHandlerType } from "./errorController";
import { createUserSchema } from "../schemas/userSchema";
import { formatValidationError } from "../utils/formatValidationError";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createUserSchema.safeParse(req.body);

    if (!validatedData.success) {
      const errorMessages = formatValidationError(validatedData.error.issues);
      const error: GlobalErrorHandlerType = new Error(errorMessages);
      error.statusCode = 422;
      error.data = req.body;
      throw error;
    }

    const user = new User(validatedData.data);
    const registeredUser = await user.save();
    const { firstName, lastName, email, accountType } = registeredUser;

    res.status(201).json({ message: "Landlord account has been created", data: { firstName, lastName, email, accountType } });
  } catch (error) {
    next(error);
  }
};
