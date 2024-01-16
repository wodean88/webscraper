const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.get('/scrape/:url', async (req, res) => {
  const url = req.params.url;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Adjust this wait time if needed

    const content = await page.content();
    const match = content.match(/<span class="your-class-name">(.*?)<\/span>/);

    if (match && match[1]) {
      res.json({ success: true, data: match[1] });
    } else {
      res.json({ success: false, error: "Price not found in the HTML content" });
    }
  } catch (error) {
    console.error("Error: " + error);
    res.json({ success: false, error: "An error occurred while scraping the content" });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
