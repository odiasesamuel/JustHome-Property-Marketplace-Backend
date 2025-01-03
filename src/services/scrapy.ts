import puppeteer from "puppeteer";
import { Cluster } from "puppeteer-cluster";

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
        const price = await page.$eval(`span[itemprop="price"]`, (el) => el.textContent?.trim());
        const imageUrls = await page.$$eval(`img[itemprop="image"]`, (imgs) => imgs.map((img) => img.src));

        properties.push({ name, phoneNumber, description, numberOfRooms, price, imageUrls });
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
