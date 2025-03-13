import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel";
import { createUserSchema, loginSchema, requestResetPasswordSchema, resetPasswordSchema } from "../schemas/userSchema";
import { formatValidationError } from "../utils/formatValidationError";
import { errorHandler } from "../utils/errorUtils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/emails/email";
import { signUpEmailTemplate, resetPasswordEmailTemplate } from "../services/emails/templates";
import dotenv from "dotenv";

dotenv.config();

type JwtPayloadWithEmail = jwt.JwtPayload & {
  email: string;
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createUserSchema.safeParse(req.body);

    if (!validatedData.success) {
      const errorMessage = formatValidationError(validatedData.error.issues);
      throw errorHandler(errorMessage, 422, req.body);
    }

    const existingUser = await User.findOne({ email: validatedData.data.email.toLowerCase() });
    if (existingUser) throw errorHandler("A user with this email already exist", 409);

    const password = validatedData.data.password;
    const hashedPassword = await bcrypt.hash(password, 12);
    const userData = { ...validatedData.data, email: validatedData.data.email.toLowerCase(), password: hashedPassword };

    const user = new User(userData);
    const registeredUser = await user.save();
    const { firstName, lastName, email, accountType, id } = registeredUser;

    const tokenValue = jwt.sign({ email: registeredUser.email, userId: registeredUser.id }, process.env.JWT_SECRET!, { expiresIn: "24h" });

    registeredUser.verificationToken = tokenValue;
    await registeredUser.save();

    const verificationLink = `${process.env.BACKEND_URL}/auth/verify?token=${encodeURIComponent(tokenValue)}`;

    const signUpEmailOptions = {
      to: email,
      subject: "Welcome to JustHome",
      html: signUpEmailTemplate(firstName, verificationLink),
    };

    await sendEmail(signUpEmailOptions);

    res.status(201).json({ message: `${accountType} account has been created`, data: { firstName, lastName, email, accountType } });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.query.token as string;
    if (!token) return res.redirect(`${process.env.FRONTEND_URL}/auth/verify?status=error&message=Missing verification token`);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadWithEmail;
    const email = decodedToken.email;

    const user = await User.findOne({ email, verificationToken: token });
    if (!user) return res.redirect(`${process.env.FRONTEND_URL}/auth/verify?status=error&message=Invalid or expired verification link`);

    user.isEmailVerified = true;

    user.verificationToken = undefined;
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/auth/verify?status=success&message=Your email has been successfully verified. You can now log in to your account.`);
  } catch (error) {
    next(error);
  }
};

export const requestResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = requestResetPasswordSchema.safeParse(req.body);

    if (!validatedData.success) {
      const errorMessage = formatValidationError(validatedData.error.issues);
      throw errorHandler(errorMessage, 422, req.body);
    }

    const existingUser = await User.findOne({ email: validatedData.data.email.toLowerCase() });
    if (!existingUser) throw errorHandler("A user with this email does not exist", 404);

    const { firstName, email, id } = existingUser;
    const tokenValue = jwt.sign({ email, userId: id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    existingUser.verificationToken = tokenValue;
    await existingUser.save();

    const verificationLink = `${process.env.BACKEND_URL}/auth/verify-reset-password?token=${encodeURIComponent(tokenValue)}`;

    const signUpEmailOptions = {
      to: email,
      subject: "Reset Your Password - JustHome",
      html: resetPasswordEmailTemplate(firstName, verificationLink),
    };

    await sendEmail(signUpEmailOptions);

    res.status(200).json({ message: `An email has been sent to ${email}. Please check your inbox and click the link to reset your password.` });
  } catch (error) {
    next(error);
  }
};

export const verifyRequestResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.query.token as string;
    if (!token) return res.redirect(`${process.env.FRONTEND_URL}/auth/verify?status=error&message=Missing verification token`);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadWithEmail;
    const email = decodedToken.email;

    const user = await User.findOne({ email, verificationToken: token });
    if (!user) return res.redirect(`${process.env.FRONTEND_URL}/auth/verify?status=error&message=Invalid or expired verification link`);

    user.isResetPasswordRequestVerified = true;

    user.verificationToken = undefined;
    await user.save();

    // Redirect to password reset page.
    res.redirect(`${process.env.FRONTEND_URL}/auth/reset-password?token=${encodeURIComponent(token)}`);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = resetPasswordSchema.safeParse(req.body);

    if (!validatedData.success) {
      const errorMessage = formatValidationError(validatedData.error.issues);
      throw errorHandler(errorMessage, 422, req.body);
    }

    const token = validatedData.data.token as string;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadWithEmail;
    const email = decodedToken.email;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const errorMessage = "A user with this email could not be found";
      throw errorHandler(errorMessage, 401, validatedData.data);
    }

    const password = validatedData.data.password;
    const hashedPassword = await bcrypt.hash(password, 12);

    existingUser.password = hashedPassword;
    existingUser.isResetPasswordRequestVerified = false;
    await existingUser.save();

    res.status(200).json({ message: "Your password has been successfully reset. You can now log in with your new password." });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.safeParse(req.body);
    if (!validatedData.success) {
      const errorMessage = formatValidationError(validatedData.error.issues);
      throw errorHandler(errorMessage, 422, req.body);
    }

    const user = await User.findOne({ email: validatedData.data.email });
    if (!user) {
      const errorMessage = "A user with this email could not be found";
      throw errorHandler(errorMessage, 401, validatedData.data);
    }

    const isEqual = await bcrypt.compare(validatedData.data.password, user.password);
    if (!isEqual) {
      const errorMessage = "Password is incorrect";
      throw errorHandler(errorMessage, 401, validatedData.data);
    }

    if (!user.isEmailVerified) {
      const errorMessage = "Your account isn't verified, check your mail to verify your account";
      throw errorHandler(errorMessage, 403, validatedData.data);
    }

    const tokenValue = jwt.sign({ email: user.email, userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "24h" });
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000 * 24);
    const token = {
      value: tokenValue,
      expiresAt: expirationTime.toISOString(),
    };

    const loggedInUser = { firstName: user.firstName, lastName: user.lastName, email: user.email, accountType: user.accountType };

    res.status(200).json({ message: "Login successful", loggedInUser, token });
  } catch (error) {
    next(error);
  }
};
