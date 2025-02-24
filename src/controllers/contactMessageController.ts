import { Request, Response, NextFunction } from "express";
import ContactMessage from "../models/contactMessageModel";
import NewsletterSubscription from "../models/newsletterModel";
import { addContactMessageSchema, subscribeToNewsletterSchema } from "../schemas/contactMessageSchema";
import { formatValidationError } from "../utils/formatValidationError";
import { errorHandler } from "../utils/errorUtils";

export const addContactMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = addContactMessageSchema.safeParse(req.body);

    if (!validatedData.success) {
      const errorMessage = formatValidationError(validatedData.error.issues);
      throw errorHandler(errorMessage, 422, req.body);
    }

    const contactMessage = new ContactMessage(validatedData.data);
    const savedContactMessage = await contactMessage.save();

    res.status(200).json({ message: "Message has been sent", contactMessage: savedContactMessage });
  } catch (error) {
    next(error);
  }
};

export const subscribeToNewsletter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = subscribeToNewsletterSchema.safeParse(req.body);

    if (!validatedData.success) {
      const errorMessage = formatValidationError(validatedData.error.issues);
      throw errorHandler(errorMessage, 422, req.body);
    }

    const newsletterSubscription = new NewsletterSubscription(validatedData.data);
    const savedSubscribedEmail = await newsletterSubscription.save();

    res.status(200).json({ message: "Subscribed successfully", subscribedEmail: savedSubscribedEmail });
  } catch (error) {
    next(error);
  }
};
