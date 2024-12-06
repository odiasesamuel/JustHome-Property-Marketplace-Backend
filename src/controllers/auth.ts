import { Request, Response } from "express";
import Landlord from "../models/landlordDetails";

export const signup = (req: Request, res: Response) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    const landlord = new Landlord({ firstName, lastName, email, password });
    landlord.save();

    res.status(201).json({ message: "Landlord account has been created" });
  } catch (error) {
    console.log(error);
  }
};
