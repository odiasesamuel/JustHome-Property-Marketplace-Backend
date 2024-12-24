import { Router } from "express";
import { getProperties, getProperty, deleteProperty, editProperty, addProperty, editPropertyImageUrl, getPropertiesWithSearchTerm } from "../controllers/propertyController";
import { uploadFilesToSupabase } from "../middlewares/uploadToSupabase";
import { deleteFilesFromSupabase } from "../middlewares/deleteFromSupabase";

const router = Router();

router.get("/", getProperties);

router.get("/search", getPropertiesWithSearchTerm);

router.get("/:propertyId", getProperty);

router.post("/", uploadFilesToSupabase, addProperty);

router.patch("/:propertyId", editProperty);

router.delete("/:propertyId", deleteFilesFromSupabase, deleteProperty);

router.patch("/image/:propertyId", deleteFilesFromSupabase, uploadFilesToSupabase, editPropertyImageUrl);

export default router;