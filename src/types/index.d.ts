import "express";
import { Request } from "express";

// Augment the Express module
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
