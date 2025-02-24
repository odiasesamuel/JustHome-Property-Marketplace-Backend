import { Router } from "express";
import { addContactMessage, subscribeToNewsletter } from "../controllers/contactMessageController";

const router = Router();

router.post("/", addContactMessage);

router.post("/subscribe", subscribeToNewsletter);

export default router;
