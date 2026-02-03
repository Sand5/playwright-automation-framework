import { BasePage } from './base/base.page';
import { expect } from '@playwright/test';
import logger from '../logger/logger';
import type { PageManager } from './base/page-manager';

export class ContactUsPage extends BasePage {
  constructor(protected pageManager: PageManager) {
    super(pageManager);
  }
  // Methods and properties for Contact Us Page can be added here

  public async fillFirstName(firstName: string): Promise<void> {
    await this.page.locator('input[name="first_name"]').fill(firstName);
    logger.info(`Filled in first name: ${firstName}`);
  }

  public async fillLastName(lastName: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
    logger.info(`Filled in last name: ${lastName}`);
  }

  public async fillEmailAddress(emailAddress: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Email Address' }).fill(emailAddress);
    logger.info(`Filled in email address: ${emailAddress}`);
  }

  public async fillComments(comments: string, number?: number): Promise<void> {
    const fullComments = number !== undefined ? `${comments} ${number}` : comments;
    await this.page.getByRole('textbox', { name: 'Comments' }).fill(fullComments);
    logger.info(`Filled in comments: ${fullComments}`);
  }

  public async clickOnSubmitButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'SUBMIT' }).click();
    logger.info('Clicked on the submit button');
  }

  public async getSuccessfulMessage(): Promise<string> {
    //Waits for the success message element to be visible on the page
    await this.page.waitForSelector("div[id='contact_reply'] h1");

    // Retrieves the text content of the success message element
    const successMessage = await this.page.innerText("div[id='contact_reply'] h1");
    logger.info(`Successful contact us submission message displayed: ${successMessage}`);
    return successMessage;
  }

  public async getErrorMessage(): Promise<string> {
    //Waits for the success message element to be visible on the page
    await this.page.waitForSelector('body');

    // Retrieves the text content of the success message element
    const body = this.page.locator('body');

    // Extract the text content from the body element
    const unsuccessfulMessage = await body.textContent();

    // Return the body text, or an empty string if textContent() returns null
    logger.info(
      `Expected unsuccessful contact us submission message displayed: ${unsuccessfulMessage}`,
    );
    return unsuccessfulMessage ?? '';
  }

  public async getHeaderText(expectedText: string): Promise<void> {
    // Normalize expected text into separate lines
    const expectedLines = expectedText
      .replace(/\\n/g, '\n')
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);

    // Pull raw textContent from the DOM (includes ALL errors)
    const locator = this.page.locator("xpath=//div[@id='contact_reply']/h1 | //body").first();

    const rawText = (await locator.textContent()) || '';

    // Convert <br> to newline and normalize whitespace
    const actualLines = rawText
      .replace(/<br\s*\/?>/gi, '\n') // turn <br> into newline
      .replace(/\r?\n/g, '\n') // normalize line endings
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);

    logger.info('=== EXPECTED LINES ===\n' + expectedLines.join('\n'));
    logger.info('=== ACTUAL RAW LINES ===\n' + actualLines.join('\n'));

    // Validate all expected lines exist in actual lines
    expect(actualLines).toEqual(expect.arrayContaining(expectedLines));
  }
}
