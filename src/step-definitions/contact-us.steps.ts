import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CucumberWorld } from './world/cucumber.world';
import { resolveFirstName, resolveLastName, resolveEmail } from '../utils/data.resolver';

When(
  /^I type a (random|specific|default) first name(?: "([^"]*)")?$/,
  async function (this: CucumberWorld, mode: string, value?: string) {
    const firstName = resolveFirstName(mode, value);
    await this.contactUsPage.fillFirstName(firstName);
  },
);

When(
  /^I type a (random|specific|default) last name(?: "([^"]*)")?$/,
  async function (this: CucumberWorld, mode: string, value?: string) {
    const lastName = resolveLastName(mode, value);
    await this.contactUsPage.fillLastName(lastName);
  },
);

When(
  /^I type a (random|specific|default) email address(?: "([^"]*)")?$/,
  async function (this: CucumberWorld, mode: string, value?: string) {
    const email = resolveEmail(mode, value);
    await this.contactUsPage.fillEmailAddress(email);
  },
);

When('I type a comment', async function (this: CucumberWorld) {
  const comment: string = process.env.DEFAULT_COMMENT || 'This is a default comment.';
  await this.contactUsPage.fillComments(comment);
});

When('I click on the submit button', async function (this: CucumberWorld) {
  await this.contactUsPage.clickOnSubmitButton();
});

Then(
  'I should be presented with a successful contact us submission message',
  async function (this: CucumberWorld) {
    const expectedMessage: string =
      process.env.DEFAULT_SUCCESS_MESSAGE || 'Thank You for your Message!';
    const successMessage = await this.contactUsPage.getSuccessfulMessage();
    expect(successMessage).toContain(expectedMessage);
  },
);

Then(
  'I should be presented with a unsuccessful contact us submission message',
  async function (this: CucumberWorld) {
    const unsuccessfulMessage = await this.contactUsPage.getErrorMessage();
    expect(unsuccessfulMessage).toMatch(/Error: (all fields are required|Invalid email address)/);
  },
);

When(
  'I type specific comment {string} and a number {int} within the comment iput field',
  async function (this: CucumberWorld, comment: string, number: number) {
    await this.contactUsPage.fillComments(comment, number);
  },
);

//Scenario outline with examples
When(
  'I type a first name {string} and a last name {string}',
  async function (this: CucumberWorld, firstName: string, lastName: string) {
    await this.contactUsPage.fillFirstName(firstName);
    await this.contactUsPage.fillLastName(lastName);
  },
);

When(
  'I type a email address {string} and a comment {string}',
  async function (this: CucumberWorld, emailAddress: string, comment: string) {
    await this.contactUsPage.fillEmailAddress(emailAddress);
    await this.contactUsPage.fillComments(comment);
  },
);

Then(
  'I should be presented with header text {string}',
  async function (this: CucumberWorld, expectedErrors: string) {
    await this.contactUsPage.getHeaderText(expectedErrors);
  },
);
