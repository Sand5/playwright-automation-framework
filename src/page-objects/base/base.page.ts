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
    // Get the browser context from the current page
    const context = this.page.context();

    // Track existing pages and wait for a new one
    const existingPages = new Set(context.pages());
    const newPage = await context.waitForEvent("page", {
      timeout: 10000,
      predicate: (p) => !existingPages.has(p),
    });

    // Wait for it to load and set viewport
    await newPage.waitForLoadState("domcontentloaded");
    await newPage.setViewportSize({
      width: config.browserWidth,
      height: config.browserHeight,
    });

    // Update page manager to point to this new tab
    this.pageManager.page = newPage;
  }
}
