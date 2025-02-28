import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel";
import { createUserSchema, loginSchema } from "../schemas/userSchema";
import { formatValidationError } from "../utils/formatValidationError";
import { errorHandler } from "../utils/errorUtils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createUserSchema.safeParse(req.body);

    if (!validatedData.success) {
      const errorMessage = formatValidationError(validatedData.error.issues);
      throw errorHandler(errorMessage, 422, req.body);
    }

    const existingUser = await User.findOne({ email: validatedData.data.email.toLowerCase() });
    if (existingUser) throw errorHandler("A user with this email already exist", 409);

    const password = validatedData.data.password;
    const hashedPassword = await bcrypt.hash(password, 12);
    const userData = { ...validatedData.data, email: validatedData.data.email.toLowerCase(), password: hashedPassword };

    const user = new User(userData);
    const registeredUser = await user.save();
    const { firstName, lastName, email, accountType, id } = registeredUser;

    res.status(201).json({ message: `${accountType} account has been created`, data: { userId: id, firstName, lastName, email, accountType } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.safeParse(req.body);
    if (!validatedData.success) {
      const errorMessage = formatValidationError(validatedData.error.issues);
      throw errorHandler(errorMessage, 422, req.body);
    }

    const user = await User.findOne({ email: validatedData.data.email });
    if (!user) {
      const errorMessage = "A user with this email could not be found";
      throw errorHandler(errorMessage, 401, validatedData.data);
    }

    const isEqual = await bcrypt.compare(validatedData.data.password, user.password);
    if (!isEqual) {
      const errorMessage = "Password is incorrect";
      throw errorHandler(errorMessage, 401, validatedData.data);
    }

    const tokenValue = jwt.sign({ email: user.email, userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000);
    const token = {
      value: tokenValue,
      expiresAt: expirationTime.toISOString(),
    };

    const loggedInUser = { firstName: user.firstName, lastName: user.lastName, email: user.email, accountType: user.accountType };

    res.status(200).json({ message: "Login successful", loggedInUser, token });
  } catch (error) {
    next(error);
  }
};
