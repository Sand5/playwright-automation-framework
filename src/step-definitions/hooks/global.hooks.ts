import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber';
import type { Browser, BrowserType } from '@playwright/test';
import { chromium, firefox, webkit } from '@playwright/test';
import { pageFixture } from './browser-context.fixture';
import { setGlobalSettings } from '../../utils/playwright-timeouts';
import { takeScreenshot } from '../../utils/take-screenshot';
import type { CucumberWorld } from '../world/cucumber.world';

// Load environment variables from the .env file
import { config as loadEnv } from 'dotenv';

// Determine environment from an env variable or default to 'dev'
const ENV = process.env.TEST_ENV || 'qa';

// Load the corresponding .env file
const envConfig = loadEnv({ path: `./env/.env.${ENV}` });

// Configuration
export const config = {
  browser:
    process.env.UI_AUTOMATION_BROWSER || envConfig.parsed?.UI_AUTOMATION_BROWSER || 'chromium',
  headless: process.env.HEADLESS === 'true' || envConfig.parsed?.HEADLESS === 'true',
  browserWidth: parseInt(process.env.BROWSER_WIDTH || envConfig.parsed?.BROWSER_WIDTH || '1920'),
  browserHeight: parseInt(process.env.BROWSER_HEIGHT || envConfig.parsed?.BROWSER_HEIGHT || '1080'),
};

// Browser mapping
const browsers: { [key: string]: BrowserType } = {
  chromium,
  firefox,
  webkit,
};

let browserInstance: Browser | null = null;

// Launch the browser once per test suite
async function launchBrowser(selectedBrowser: string): Promise<Browser> {
  const browserType = browsers[selectedBrowser];
  if (!browserType) {
    throw new Error(
      `Unsupported browser: ${selectedBrowser}\nAvailable: ${Object.keys(browsers).join(', ')}`,
    );
  }
  return await browserType.launch({ headless: config.headless });
}

// Initialize a new context + page per scenario
async function initializeScenario(): Promise<void> {
  if (!browserInstance) {
    throw new Error('Browser instance is not initialized.');
  }

  // Create a fresh context for this scenario
  pageFixture.context = await browserInstance.newContext({});

  // Create a new page (tab)
  pageFixture.page = await pageFixture.context.newPage();

  // Apply global settings
  setGlobalSettings(pageFixture.page);

  // Set viewport size
  await pageFixture.page.setViewportSize({
    width: config.browserWidth,
    height: config.browserHeight,
  });
}

// Runs once before all scenarios
BeforeAll(async function () {
  console.log('\nExecuting test suite....');
  browserInstance = await launchBrowser(config.browser);
});

// Runs once after all scenarios
AfterAll(async function () {
  console.log('\nFinished executing test suite!');
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
});

// Runs before each scenario
Before(async function ({ pickle }) {
  try {
    await initializeScenario();
    console.log(`\n[Before Hook] Scenario: "${pickle.name}"`);
  } catch (error) {
    console.error(`❌ Error setting up scenario: ${error}`);
    throw error;
  }
});

// Runs after each scenario
After(async function ({ pickle, result }) {
  console.log(`\n[After Hook] Scenario: "${pickle.name}" finished with status: ${result?.status}`);

  // Screenshot on failure
  if (result?.status === Status.FAILED && pageFixture.page) {
    try {
      const { image, path } = await takeScreenshot(pageFixture.page, pickle.name);
      this.attach(image, 'image/png');
      console.log(`✅ Screenshot saved to: ${path}`);
    } catch (err) {
      console.error(`❌ Error taking screenshot: ${err}`);
    }
  }

  // Clean up page/context safely
  try {
    if (pageFixture.page && !pageFixture.page.isClosed()) {
      await pageFixture.page.close();
    }
    if (pageFixture.context) {
      await pageFixture.context.close();
    }
  } catch (cleanupErr) {
    console.warn(`⚠️ Error during page/context cleanup: ${cleanupErr}`);
  } finally {
    // 3️⃣ Reset fixtures
    (pageFixture as any).page = null;
    (pageFixture as any).context = null;
    (this as CucumberWorld).resetPages();
  }

  console.log(`[After Hook] Scenario cleanup done for: "${pickle.name}"`);
});
