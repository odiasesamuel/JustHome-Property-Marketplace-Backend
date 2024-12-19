import { Request, Response, NextFunction } from "express";

export type GlobalErrorHandlerType = Error & {
  statusCode?: number;
  data?: any;
};

export const globalErrorHandler = (error: GlobalErrorHandlerType, req: Request, res: Response, next: NextFunction) => {
  const status = error.statusCode || 500;
  const message = error.message || "An unexpected error occurred";
  const data = error.data;

  res.status(status).json({ message, data });
};

export const Error404Handler = (req: Request, res: Response) => {
  res.status(404).json({ message: "The resource was not found" });
};
