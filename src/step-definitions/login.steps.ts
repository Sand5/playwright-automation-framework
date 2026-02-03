import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CucumberWorld } from './world/cucumber.world';
import { USERNAME, PASSWORD } from '../utils/testdata-config';

When(
  /^I type a username\s*(.*)$/, // optional word
  async function (this: CucumberWorld, username?: string) {
    // Use username from scenario if provided, else fallback to environment variable
    const usernameToUse = username?.trim() || USERNAME;
    await this.loginPage.enterUsername(usernameToUse);
  },
);

When(
  /^I type a password\s*(.*)$/, // optional word
  async function (this: CucumberWorld, password?: string) {
    // Use password from scenario if provided, else fallback to environment variable
    const passwordToUse = password?.trim() || PASSWORD;
    await this.loginPage.enterPassword(passwordToUse);
  },
);

When('I click on the login button', async function (this: CucumberWorld) {
  await this.loginPage.clickLoginButtonAcceptDialogMessage();
});

Then(
  'I should be presented with an alert box which contains text {string}',
  async function (this: CucumberWorld, expectedAlertText: string) {
    expect(await this.loginPage.getAlertMessage()).toBe(expectedAlertText);
  },
);
