import { Given, When } from '@cucumber/cucumber';
import type { CucumberWorld } from './world/cucumber.world';

// Load environment variables from the .env file
import { config as loadEnv } from 'dotenv';

// Determine environment from an env variable or default to 'qa'
const ENV = process.env.TEST_ENV || 'qa';

// Load the corresponding .env file
const envConfig = loadEnv({ path: `./env/.env.${ENV}` });

export const config = {
  base_url: process.env.BASE_URL || envConfig.parsed?.BASE_URL || '',
};
const url = config.base_url;

Given('I navigate to webdriveruniversity homepage', async function (this: CucumberWorld) {
  await this.homePage.navigate(url);
  this.url = url;
});

When('I click on the contact us button', async function (this: CucumberWorld) {
  await this.homePage.clickOnContactUsButton();
});

When('I click on the login portal button', async function (this: CucumberWorld) {
  await this.homePage.clickOnLoginPortalButton();
});
