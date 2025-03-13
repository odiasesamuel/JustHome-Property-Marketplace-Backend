import { Router } from "express";
import { signup, login, verifyEmail, requestResetPassword, verifyRequestResetPassword, resetPassword } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);

router.get("/verify", verifyEmail);

router.post("/login", login);

router.post("/request-reset-password", requestResetPassword);

router.get("/verify-reset-password", verifyRequestResetPassword);

router.post("/reset-password", resetPassword);

export default router;
