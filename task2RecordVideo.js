"use strict";

const puppeteer = require("puppeteer");

const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

(async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

    const recorder = new PuppeteerScreenRecorder(page);

    await page.goto("https://interactly.video/");

    await recorder.start("video.mp4");
    await animate(page);
    await recorder.stop();
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
})();

const animate = async (page) => {
  for (let i = 0; i < 10; i++) {
    await wait(500);
    await page.evaluate(() => {
      window.scrollBy({ top: 500, left: 0, behavior: "smooth" });
    });
  }


  await wait(1000);
};

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
