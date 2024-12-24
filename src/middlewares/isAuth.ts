import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/errorUtils";
import dotenv from "dotenv";

dotenv.config();

type JwtPayloadWithUserId = jwt.JwtPayload & {
  userId: string;
};

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) throw errorHandler("Not authenticated", 401);

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadWithUserId;
    if (!decodedToken) throw errorHandler("Not Authenticated", 401);

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    next(error);
  }
};
