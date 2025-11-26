import { Locator } from "@playwright/test";
import { PageManager } from "./page-manager";
import logger from "../../logger/logger";

// Load environment variables from the .env file
import { config as loadEnv } from "dotenv";
const env = loadEnv({ path: "./env/.env" });

//Create a config object to hold env variables
export const config = {
  browserWidth: parseInt(
    process.env.BROWSER_WIDTH || env.parsed?.BROWSER_WIDTH || "1920"
  ),
  browserHeight: parseInt(
    process.env.BROWSER_HEIGHT || env.parsed?.BROWSER_HEIGHT || "1080"
  ),
};

export class BasePage {
  constructor(protected pageManager: PageManager) {}

  get page() {
    return this.pageManager.page;
  }
  public async navigate(url: string): Promise<void> {
    await this.page.goto(url);
    logger.info(`Accessing URL: ${url}`);
  }

  public async waitAndClickByRole(role: string, name: string): Promise<void> {
    const element = this.page.getByRole(role as any, { name: name });
    await element.waitFor({ state: "visible" });
    await element.click();
  }

  public async waitAndClick(locator: Locator): Promise<void> {
    await locator.isVisible();
    await locator.click();
  }

  public async waitAndClickSelector(selector: string): Promise<void> {
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
  }

  public async typeTextByPlaceholder(
    fieldldPlaceholder: string,
    username: string
  ): Promise<void> {
    await this.page.getByPlaceholder(fieldldPlaceholder).fill(username);
  }

  public async switchToNewTab(): Promise<void> {
    const newPagePromise = this.page.context().waitForEvent("page");

    // The click that opens the new tab should happen outside
    const newPage = await newPagePromise;

    await newPage.bringToFront();
    await newPage.setViewportSize({
      width: config.browserWidth,
      height: config.browserHeight,
    });

    this.pageManager.page = newPage; // update the central page
  }
}
