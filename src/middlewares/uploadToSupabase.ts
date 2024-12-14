import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import { supabase } from "../config/supabaseClient.config";

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array("propertyImage", 7);

export const uploadFilesToSupabase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  upload(req, res, async (err: any) => {
    if (err) {
      console.error("Multer Error:", err.message);
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploadedFiles: string[] = [];
      for (const file of req.files) {
        const { buffer, originalname, mimetype } = file as Express.Multer.File;

        const timestamp = new Date().toISOString().replace(/:/g, "-");
        const fileName = `${timestamp}-${originalname}`;

        // Upload the file to Supabase Storage
        const { error: uploadError } = await supabase.storage.from("rental-marketplace-images").upload(fileName, buffer, {
          contentType: mimetype,
        });

        if (uploadError) {
          console.error("Supabase Upload Error:", uploadError.message);
          return res.status(500).json({ message: "Failed to upload file to Supabase" });
        }

        // Generate a public URL
        const { data } = supabase.storage.from("rental-marketplace-images").getPublicUrl(fileName);

        uploadedFiles.push(data.publicUrl);
      }

      req.body.imageUrls = uploadedFiles;
      next();
    } catch (error) {
      console.error("File Upload Error:", error);
      res.status(500).json({ error: "An error occurred during file upload" });
    }
  });
};
