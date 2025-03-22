import { Router } from "express";
import { getProperties, getUserListedProperties, getProperty, deleteProperty, editProperty, addProperty, editPropertyImageUrl } from "../controllers/propertyController";
import { uploadFilesToSupabase } from "../middlewares/uploadToSupabase";
import { deleteFilesFromSupabase } from "../middlewares/deleteFromSupabase";
import { isAuth } from "../middlewares/isAuth";

const router = Router();

router.get("/", getProperties);

router.get("/my-listing", isAuth, getUserListedProperties);

router.get("/:propertyId", getProperty);

router.post("/", isAuth, uploadFilesToSupabase, addProperty);

router.patch("/:propertyId", isAuth, editProperty);

router.delete("/:propertyId", isAuth, deleteFilesFromSupabase, deleteProperty);

router.patch("/image/:propertyId", isAuth, deleteFilesFromSupabase, uploadFilesToSupabase, editPropertyImageUrl);

export default router;
