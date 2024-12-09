import { Request, Response, NextFunction } from "express";
import Landlord from "../models/landlordModel";
import { GlobalErrorHandlerType } from "./errorController";

export const signup = (req: Request, res: Response, next: NextFunction) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    // const error: GlobalErrorHandlerType = new Error("Signup failed");
    // error.statusCode = 422;
    // error.data = "User ABC already available";
    // throw error;

    const landlord = new Landlord({ firstName, lastName, email, password });
    landlord.save();

    res.status(201).json({ message: "Landlord account has been created" });
  } catch (error) {
    next(error);
  }
};
