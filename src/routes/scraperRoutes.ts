import { Router } from "express";
import { scrapePropertiesForSale } from "../controllers/scraperController";

const router = Router();

router.get("/properties-for-sale", scrapePropertiesForSale);

export default router;
