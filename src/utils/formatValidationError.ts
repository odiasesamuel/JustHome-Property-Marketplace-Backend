import { ZodIssue } from "zod";

export const formatValidationError = (errors: ZodIssue[]) => {
  return errors.map((err) => err.message).join(", ");
};
