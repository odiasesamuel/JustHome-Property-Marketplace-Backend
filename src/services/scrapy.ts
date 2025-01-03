import puppeteer from "puppeteer";

const sleep = (waitTimeInMs: number) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

const scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto("https://nigeriapropertycentre.com", { timeout: 240000 });
  await page.setViewport({ width: 1080, height: 1024 });

  // Fill search form
  await page.type("#propertyLocation", "Ikoyi");
  await sleep(2000);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.select("#tid", "2");
  await page.click(`button[type="submit"]`);

  // Wait for the search results to load
  await page.waitForSelector(".property-list");
  await sleep(20000);

  // Extract property links
  let properties = [];
  const propertyLinks = await page.$$eval(`a[itemprop="url"]`, (links) => links.map((link) => link.href));
  console.log(propertyLinks);
  console.log(propertyLinks.length);

  for (const link of propertyLinks) {
    try {
      await page.goto(link, { waitUntil: "domcontentloaded" });
      console.log("Navigated to property details page");

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

      properties.push({ name, email: "xxxx@gmail.com", phoneNumber, state: "Lagos", description, numberOfRooms, price, imageUrls });
    } catch (error) {
      console.log("Error processing property:", error);
    }
  }

  // await browser.close();

  console.log(properties);
  console.log(properties.length);
};

scrape();
