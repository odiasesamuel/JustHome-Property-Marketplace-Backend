import { GlobalErrorHandlerType } from "../middlewares/errorHandler";

export const errorHandler = (errorMessage: string, statusCode: number, data?: any) => {
  const error: GlobalErrorHandlerType = new Error(errorMessage);
  error.statusCode = statusCode;
  error.data = data;
  return error;
};
