import { Router } from "express";
import { addContactMessage } from "../controllers/contactMessageController";

const router = Router();

router.post("/", addContactMessage);

export default router;
