// custom.d.ts or express.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      callNext?: boolean; // You can set the type to `boolean` or the appropriate type as needed
    }
  }
}
