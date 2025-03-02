import { Request, Response, NextFunction } from "express";
import { scrapeProperties } from "../services/webScraper/scrapy";

export const scrapePropertiesForSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const urls = ["https://nigeriapropertycentre.com/for-sale/houses/lagos/victoria-island?selectedLoc=1&q=for-sale+houses+lagos+victoria-island", "https://nigeriapropertycentre.com/for-sale/houses/lagos/lekki?selectedLoc=1&q=for-sale+houses+lagos+lekki"];

    const properties = await scrapeProperties(urls);

    res.status(200).json({ message: "Successfully scraped properties for sale and saved to database", data: properties });
  } catch (error) {
    next(error);
  }
};

export const scrapePropertiesForRent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const urls = ["https://nigeriapropertycentre.com/for-rent/flats-apartments/lagos/victoria-island?q=for-rent+flats-apartments+lagos+victoria-island", "https://nigeriapropertycentre.com/for-rent/flats-apartments/lagos/lekki?selectedLoc=1&q=for-rent+flats-apartments+lagos+lekki"];

    const properties = await scrapeProperties(urls);

    res.status(200).json({ message: "Successfully scraped properties for sale and saved to database", data: properties });
  } catch (error) {
    next(error);
  }
};
