import { Router } from "express";
import { addProperty, getProperties, getProperty } from "../controllers/propertyController";

const router = Router();

router.get("/", getProperties);

router.get("/:propertyId", getProperty);

router.post("/add", addProperty);

export default router;
