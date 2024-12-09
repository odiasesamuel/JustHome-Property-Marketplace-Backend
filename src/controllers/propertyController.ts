import { Request, Response, NextFunction } from "express";
import Property from "../models/propertyModel";

export const addProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const description = req.body.description;
    const { city, area, numberOfRooms } = req.body.propertyDetails;

    const property = new Property({ name, email, phoneNumber, description, propertyDetails: { city, area, numberOfRooms } });
    property.save();

    res.status(201).json({ message: "The Property has been uploaded" });
  } catch (error) {
    next(error);
  }
};
