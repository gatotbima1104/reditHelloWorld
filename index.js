import puppeteer from "puppeteer-extra";
import PluginStealth from "puppeteer-extra-plugin-stealth";
import { setTimeout } from "node:timers/promises";
import UserAgent from "user-agents";
import * as dotenv from "dotenv";

// Pulling username and password from .env
dotenv.config();
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

puppeteer.use(PluginStealth());

(async () => {
  try {
    // Setting up proxy
    // const proxyList = ['', '', '']
    // const randomProxy = proxyList[Math.floor(Math.random() * proxyList.length)]
    const browser = await puppeteer.launch({
      headless: 'new',
      // args: [`--proxy-server=${randomProxy}`],
    });

    const page = await browser.newPage();

    // Set Useragent
    await page.setUserAgent(UserAgent.random().toString());

    // Go to url
    const url = "https://www.reddit.com/login/";
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    // set for timeout and navigating
    await setTimeout(5000);

    // Defining username form
    const usernameForm = await page.$eval("input#login-username");
    await usernameForm.type(username, {
      delay: 1000,
    });

    // Defining password form
    const passwordForm = await page.$eval("input#login-password");
    await passwordForm.type(password, {
      delay: 1000,
    });

    // Assigning button login xPath
    const loginBtn = await page.$x("//button[contains(., 'Log In')]");

    // Click button login
    await page.click(loginBtn);

    // Navigating after login
    await page.waitForNavigation();

    // Wait for timeout
    await setTimeout(5000);

    // Comment to a post on redit
    await page.waitForSelector("article.w-full m-0");
    const commentBtn = await page.$(
      'a[data-post-click-location="comments-button"]'
    );
    await page.click(commentBtn);
    await page.waitForNavigation();

    // Commenting Hello World
    const commentForm = await page.$eval(
      "//button[contains(., 'Add a Comment')]"
    );
    await commentForm.type("Hello World", {
      delay: 500,
    });

    await page.click('button[type="submit"]');

    await setTimeout(5000);
    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
