import { GlobalErrorHandlerType } from "../middlewares/errorHandler";

export const errorHandler = (errorMessage: string, statusCode: number, data?: any) => {
  const error = new Error(errorMessage) as GlobalErrorHandlerType;
  error.statusCode = statusCode;
  error.data = data;
  return error;
};
