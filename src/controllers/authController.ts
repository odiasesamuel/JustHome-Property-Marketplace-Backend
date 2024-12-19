import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel";
import { GlobalErrorHandlerType } from "./errorController";
import { createUserSchema } from "../schemas/userSchema";
import { formatValidationError } from "../utils/formatValidationError";
import bcrypt from "bcryptjs";

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

    const password = validatedData.data.password;
    const hashedPassword = await bcrypt.hash(password, 12);
    const userData = { ...validatedData.data, password: hashedPassword };
    const user = new User(userData);
    const registeredUser = await user.save();
    const { firstName, lastName, email, accountType, id } = registeredUser;

    res.status(201).json({ message: `${accountType} account has been created`, data: { userId: id, firstName, lastName, email, accountType } });
  } catch (error) {
    next(error);
  }
};
