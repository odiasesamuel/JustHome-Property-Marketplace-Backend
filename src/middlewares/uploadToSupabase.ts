import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import { supabase } from "../config/supabaseClient.config";
import { errorHandler } from "../utils/errorUtils";

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
  
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array("propertyImage", 10);

export const uploadFilesToSupabase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      const errorMessage = "No files uploaded";
      throw errorHandler(errorMessage, 400);
    }

    const uploadedFiles: string[] = [];

    for (const file of req.files) {
      const { buffer, originalname, mimetype } = file as Express.Multer.File;

      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const fileName = `${timestamp}-${originalname}`;

      const { error: uploadError } = await supabase.storage.from("rental-marketplace-images").upload(fileName, buffer, {
        contentType: mimetype,
      });

      if (uploadError) {
        throw errorHandler("Failed to upload file to Supabase", 500);
      }

      const { data } = supabase.storage.from("rental-marketplace-images").getPublicUrl(fileName);
      uploadedFiles.push(data.publicUrl);
    }

    req.body.imageUrls = uploadedFiles;
    next();
  } catch (error) {
    next(error);
  }
};
