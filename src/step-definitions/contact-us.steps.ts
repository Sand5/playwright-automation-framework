import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { CucumberWorld } from "./world/cucumber.world";
import logger from "../logger/logger";

When("I type a first name", async function (this: CucumberWorld) {
  logger.info(`Base URL stored in Cucumber World: ${this.url}`);
  await this.contactUsPage.fillFirstName("John");

});

When("I type a last name", async function (this: CucumberWorld) {
  await this.contactUsPage.fillLastName("Smith");
});

When("I enter an email address", async function (this: CucumberWorld) {
  await this.contactUsPage.fillEmailAddress("johnsmith99@gmail.com");
});

When("I type a comment", async function (this: CucumberWorld) {
  await this.contactUsPage.fillComments("This is a test comment");
});

When("I click on the submit button", async function (this: CucumberWorld) {
  await this.contactUsPage.clickOnSubmitButton();

});

Then(
  "I should be presented with a successful contact us submission message",
  async function (this: CucumberWorld) {
    const successMessage = await this.contactUsPage.getSuccessfulMessage();
    expect(successMessage).toContain("Thank You for your Message!");
  }
);

Then(
  "I should be presented with a unsuccessful contact us submission message",
  async function (this: CucumberWorld) {
    const unsuccessfulMessage = await this.contactUsPage.getErrorMessage();
    expect(unsuccessfulMessage).toMatch(
      /Error: (all fields are required|Invalid email address)/
    );
  }
);

//Cucumber step definition with parameters for specific first name and last name

When(
  "I type a specific first name {string}",
  async function (this: CucumberWorld, firstName: string) {
    await this.contactUsPage.fillFirstName(firstName);
  }
);

When(
  "I type a specific last name {string}",
  async function (this: CucumberWorld, lastName: string) {
    await this.contactUsPage.fillLastName(lastName);
  }
);

When(
  "I enter a specific email address {string}",
  async function (this: CucumberWorld, email: string) {
    await this.contactUsPage.fillEmailAddress(email);
  }
);

When(
  "I type specific comment {string} and a number {int} within the comment iput field",
  async function (this: CucumberWorld, comment: string, number: number) {
    await this.contactUsPage.fillComments(comment, number);
  
  }
);

//Random data generation using faker library

When("I type a random first name", async function (this: CucumberWorld) {
  const randomFirstName = faker.person.firstName();
  await this.contactUsPage.fillFirstName(randomFirstName);
});

When("I type a random last name", async function (this: CucumberWorld) {
  const randomLastName = faker.person.lastName();
  await this.contactUsPage.fillLastName(randomLastName);
});

When("I enter a random email address", async function (this: CucumberWorld) {
  const randomEmail = faker.internet.email();
  await this.contactUsPage.fillEmailAddress(randomEmail);
});

//Scenario outline with examples

When(
  "I type a first name {string} and a last name {string}",
  async function (this: CucumberWorld, firstName: string, lastName: string) {
    await this.contactUsPage.fillFirstName(firstName);
    await this.contactUsPage.fillLastName(lastName);
  }
);

When(
  "I tyoe a email address {string} and a comment {string}",
  async function (this: CucumberWorld, emailAddress: string, comment: string) {
    await this.contactUsPage.fillEmailAddress(emailAddress);
    await this.contactUsPage.fillComments(comment);
  
  }
);

Then(
  "I should be presented with header text {string}",
  async function (this: CucumberWorld, expectedErrors) {
    await this.contactUsPage.getHeaderText(expectedErrors);
  }
);
