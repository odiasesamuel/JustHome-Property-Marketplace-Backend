import { Router } from "express";
import { signup, login, verifyEmail, requestResetPassword, resetPassword } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/verify", verifyEmail);

router.post("/request-reset-password", requestResetPassword);

router.post("/reset-password", resetPassword);

export default router;
