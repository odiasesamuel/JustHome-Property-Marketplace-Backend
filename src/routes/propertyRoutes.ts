import { Router } from "express";
import { getProperties, getProperty, deleteProperty, editProperty, addProperty } from "../controllers/propertyController";
import { uploadFilesToSupabase } from "../middlewares/uploadToSupabase";
import { deleteFilesFromSupabase } from "../middlewares/deleteFromSupabase";

const router = Router();

router.get("/", getProperties);

router.get("/:propertyId", getProperty);

router.post("/", uploadFilesToSupabase, addProperty);

router.patch("/:propertyId", editProperty);

router.delete(
  "/:propertyId",
  (req, res, next) => {
    req.body.callNext = true;
    deleteFilesFromSupabase(req, res, next);
  },
  deleteProperty
);

router.delete("/image/:propertyId", (req, res, next) => {
  req.body.callNext = false;
  deleteFilesFromSupabase(req, res, next);
});

export default router;
