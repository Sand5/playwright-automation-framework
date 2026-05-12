import { config as loadEnv } from 'dotenv';

// Determine environment
const ENV = process.env.TEST_ENV || 'qa';

// Load env file ONCE (side effect only)
loadEnv({ path: `./env/.env.${ENV}` });

// Single source of truth: process.env
export const config = {
  env: ENV,

  browser: process.env.UI_AUTOMATION_BROWSER || 'chromium',

  headless: process.env.HEADLESS === 'true',

  baseUrl: process.env.BASE_URL || 'http://www.webdriveruniversity.com',
  
  browserWidth: parseInt(process.env.BROWSER_WIDTH || '1920'),

  browserHeight: parseInt(process.env.BROWSER_HEIGHT || '1080'),
};