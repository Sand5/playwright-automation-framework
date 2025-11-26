import { setDefaultTimeout } from "@cucumber/cucumber";
// Set a higher default timeout for Cucumber steps to accommodate longer operations
// For example, if a step involves loading a webpage or waiting for an element to appear, it might take longer than the default timeout of playwright

// Load environment variables from the .env file
import { config as loadEnv } from "dotenv";
const env = loadEnv({ path: "./env/.env" });

const commandTimeout = parseInt(env.parsed?.CUCUMBER_CUSTOM_TIMEOUT || "60000");

// Set default timeout to 60 seconds
setDefaultTimeout(commandTimeout); 