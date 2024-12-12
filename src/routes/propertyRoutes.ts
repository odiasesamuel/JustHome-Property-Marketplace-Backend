import { Router } from "express";
import { addProperty, getProperties, getProperty, deleteProperty } from "../controllers/propertyController";

const router = Router();

router.get("/", getProperties);

router.get("/:propertyId", getProperty);

router.post("/", addProperty);

router.delete("/:propertyId", deleteProperty);

export default router;
