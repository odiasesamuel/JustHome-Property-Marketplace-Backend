import { Router } from "express";
import { addProperty } from "../controllers/propertyController";

const router = Router();

router.post("/add", addProperty);

export default router;
