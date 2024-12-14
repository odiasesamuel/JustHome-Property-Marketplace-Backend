import { Router } from "express";
import { getProperties, getProperty, deleteProperty, editProperty, addProperty } from "../controllers/propertyController";
import { uploadFilesToSupabase } from "../middlewares/uploadToSupabase";

const router = Router();

router.get("/", getProperties);

router.get("/:propertyId", getProperty);

router.post("/", uploadFilesToSupabase, addProperty);

router.patch("/:propertyId", editProperty);

router.delete("/:propertyId", deleteProperty);

export default router;
