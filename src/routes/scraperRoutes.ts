import { Router } from "express";
import { scrapePropertiesForSale, scrapePropertiesForRent } from "../controllers/scraperController";

const router = Router();

router.get("/properties-for-sale", scrapePropertiesForSale);

router.get("/properties-for-rent", scrapePropertiesForRent);

export default router;
