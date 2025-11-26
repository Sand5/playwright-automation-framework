import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CucumberWorld } from "./world/cucumber.world";

When(
  "I type a username {word}",
  async function (this: CucumberWorld, username: string) {
    await this.loginPage.enterUsername(username);
  }
);

When(
  "I type a password {word}",
  async function (this: CucumberWorld, password: string) {
    await this.loginPage.enterPassword(password);
  }
);

When("I click on the login button", async function (this: CucumberWorld) {
  await this.loginPage.clickLoginButtonAcceptDialogMessage();
});

Then(
  "I should be presented with an alert box which contains text {string}",
  async function (this: CucumberWorld, expectedAlertText: string) {
    expect(await this.loginPage.getAlertMessage()).toBe(expectedAlertText);
  }
);
