import type { Locator } from '@playwright/test';
import type { PageManager } from './page-manager';
import { Page } from '@playwright/test';
import logger from '../../logger/logger';

// Load environment variables from the .env file
import { config as loadEnv } from 'dotenv';
const env = loadEnv({ path: './env/.env' });

//Create a config object to hold env variables
export const config = {
  browserWidth: parseInt(process.env.BROWSER_WIDTH || env.parsed?.BROWSER_WIDTH || '1920'),
  browserHeight: parseInt(process.env.BROWSER_HEIGHT || env.parsed?.BROWSER_HEIGHT || '1080'),
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
    await element.waitFor({ state: 'visible' });
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

  public async typeTextByPlaceholder(fieldldPlaceholder: string, username: string): Promise<void> {
    await this.page.getByPlaceholder(fieldldPlaceholder).fill(username);
  }

  public async switchToNewTab(): Promise<void> {
    const context = this.pageManager.page.context(); // Get the current browser context
    const pages = context.pages(); // All pages/tabs in the context

    let newPage: Page;

    if (pages.length > 1) {
      // A new tab already exists
      newPage = pages[pages.length - 1]; // Last page is usually the new tab
      await newPage.bringToFront();
      await newPage.waitForLoadState();
      logger.info('Switched to already-opened new tab');
    } else {
      // Wait briefly for a new tab to open (if it’s slow)
      try {
        newPage = await context.waitForEvent('page', { timeout: 5000 });
        await newPage.waitForLoadState();
        logger.info('Switched to newly opened tab after wait');
      } catch (err) {
        // Fallback: stay on current page (modal / same tab)
        newPage = this.pageManager.page;
        logger.warn('No new tab detected, continuing on current page');
      }
    }

    // Update the page reference in your PageManager
    this.pageManager.page = newPage;
  }
}
