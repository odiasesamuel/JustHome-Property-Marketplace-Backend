import { Router } from "express";
import { signup, login, verifyEmail } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/verify", verifyEmail);

export default router;
