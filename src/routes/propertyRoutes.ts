import { Router } from "express";
import { getProperties, getUserListedProperties, getProperty, deleteProperty, editProperty, addProperty, editPropertyImageUrl } from "../controllers/propertyController";
import { uploadFilesToSupabase, upload } from "../middlewares/uploadToSupabase";
import { deleteFilesFromSupabase } from "../middlewares/deleteFromSupabase";
import { isAuth } from "../middlewares/isAuth";
import { ifFileUploaded } from "../middlewares/ifFileUploaded";

const router = Router();

router.get("/", getProperties);

router.get("/my-listing", isAuth, getUserListedProperties);

router.get("/:propertyId", getProperty);

router.post("/", isAuth, uploadFilesToSupabase, addProperty);

router.patch("/:propertyId", isAuth, upload, ifFileUploaded(deleteFilesFromSupabase, uploadFilesToSupabase, editPropertyImageUrl), editProperty);

router.delete("/:propertyId", isAuth, deleteFilesFromSupabase, deleteProperty);

export default router;
