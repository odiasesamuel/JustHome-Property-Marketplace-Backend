import { Router } from "express";
import { signup } from "../controllers/authController";

const router = Router();

router.post("/signup/landlord", signup);

export default router;
