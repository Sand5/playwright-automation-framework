import { chromium, firefox, webkit, Browser, BrowserType } from '@playwright/test';

const browsers: Record<string, BrowserType> = {
  chromium,
  firefox,
  webkit,
};

export async function launchA11yBrowser(
  browserName: string = 'chromium',
  headless: boolean = true
): Promise<Browser> {
  const browserType = browsers[browserName];

  if (!browserType) {
    throw new Error(`Unsupported browser: ${browserName}`);
  }

  return await browserType.launch({
    headless,
  });
}