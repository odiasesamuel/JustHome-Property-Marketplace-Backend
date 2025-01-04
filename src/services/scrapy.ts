import puppeteer from "puppeteer";
import { Cluster } from "puppeteer-cluster";
import Property from "../models/propertyModel";
import express from "express";
import { connectToDatabase } from "../config/db.config";

const app = express();

const PORT = 3001;

connectToDatabase(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

const sleep = (waitTimeInMs: number) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

const urls = ["https://nigeriapropertycentre.com/for-sale/houses/lagos/victoria-island?selectedLoc=1&q=for-sale+houses+lagos+victoria-island", "https://nigeriapropertycentre.com/for-sale/houses/lagos/lekki?selectedLoc=1&q=for-sale+houses+lagos+lekki"];

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 30,
    monitor: true,
    timeout: 600000,
    puppeteerOptions: {
      headless: false,
    },
  });

  cluster.on("taskerror", (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
  });

  // Define the cluster task
  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url, { timeout: 240000 });
    await page.setViewport({ width: 1080, height: 1024 });

    // Wait for the search results to load
    await page.waitForSelector(".property-list");
    await sleep(5000);

    // Extract property links
    const propertyLinks = await page.$$eval(`a[itemprop="url"]`, (links) => links.map((link) => link.href));
    console.log(propertyLinks);
    console.log(propertyLinks.length);

    const properties = [];

    // Process each property link
    for (const link of propertyLinks) {
      try {
        // Use the same `page` object to navigate to property detail pages
        await page.goto(link, { waitUntil: "domcontentloaded" });
        console.log("Navigated to property details page");

        await page.waitForSelector("h1.page-title");

        const name = await page.$eval("h1.page-title", (el) => el.textContent?.trim());

        const showNumber = await page.$(`[data-type="showPhoneNumber"]`);
        if (showNumber) {
          await showNumber.click();
          await sleep(2000);
        }

        const phoneNumber = await page.$eval(`[data-type="phoneNumber"] a`, (el) => el.textContent?.trim());
        const description = await page.$eval(`p[itemprop="description"]`, (el) => el.textContent?.trim());
        const numberOfRooms = await page.$eval(".fal.fa-bed + span", (el) => el.textContent?.trim());
        const priceRaw = await page.$eval(`span[itemprop="price"]`, (el) => el.textContent?.trim());
        const imageUrls = await page.$$eval(`img[itemprop="image"]`, (imgs) => imgs.map((img) => img.src));

        const parts: string[] = url.split("/houses/")[1].split("/");
        const state: string = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const area: string = parts[1]
          .split("?")[0]
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        const forSaleOrRent = url.includes("for-sale") ? "Sale" : url.includes("for-rent") ? "Rent" : "Rent";
        const isDuplex = /duplex/i.test(url);
        const isFlat = /flat|apartment/i.test(url);

        const propertyType = isDuplex ? "Duplex" : isFlat ? "Flat" : "Flat";
        const price = priceRaw ? parseInt(priceRaw.replace(/,/g, ""), 10) : 0;

        const propertyData = { name, email: "xxxxxx@gmail.com", phoneNumber, state, LGA: area, city: area, area, description, numberOfRooms: numberOfRooms ? +numberOfRooms : 0, propertyType, forSaleOrRent, price, propertyOwnerId: "676aff2b2f08e4ed24164195", imageUrls };

        properties.push(propertyData);

        const property = new Property(propertyData);
        const savedProperty = await property.save();
      } catch (error) {
        console.log("Error processing property:", error);
      }
    }

    console.log(properties);
    console.log(`Total properties extracted: ${properties.length}`);
  });

  // Queue URLs for scraping
  for (const url of urls) {
    await cluster.queue(url);
  }

  // await cluster.idle();
  // await cluster.close();
})();
