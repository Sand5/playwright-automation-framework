import fs from 'fs';
import { config as loadEnv } from 'dotenv';

// Trim and normalize TEST_CRED
const testCredRaw = process.env.TEST_CRED?.trim();

// Load local secrets if TEST_CRED is missing
const ENV_FILE = !testCredRaw || testCredRaw === '' ? './env/localsecrets.env' : undefined;
const envConfig =
  ENV_FILE && fs.existsSync(ENV_FILE) ? loadEnv({ path: ENV_FILE }) : { parsed: {} };

// Parse TEST_CRED if provided
const testCred = testCredRaw ? JSON.parse(testCredRaw) : {};

// Fallback helper
export const USERNAME =
  testCred.username || process.env.CI_TEST_USERNAME || process.env.TEST_USERNAME || envConfig.parsed?.LOCAL_TEST_USERNAME;

export const PASSWORD =
  testCred.password || process.env.CI_TEST_PASSWORD || process.env.TEST_PASSWORD ||envConfig.parsed?.LOCAL_TEST_PASSWORD;
