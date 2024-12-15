import { Router } from "express";
import { getProperties, getProperty, deleteProperty, editProperty, addProperty, removeImageUrl } from "../controllers/propertyController";
import { uploadFilesToSupabase } from "../middlewares/uploadToSupabase";
import { deleteFilesFromSupabase } from "../middlewares/deleteFromSupabase";

const router = Router();

router.get("/", getProperties);

router.get("/:propertyId", getProperty);

router.post("/", uploadFilesToSupabase, addProperty);

router.patch("/:propertyId", editProperty);

router.delete("/:propertyId", deleteFilesFromSupabase, deleteProperty);

router.delete("/image/:propertyId", deleteFilesFromSupabase, removeImageUrl);

export default router;
