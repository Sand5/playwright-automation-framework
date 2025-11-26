import { BasePage } from "./base/base.page";
import { PageManager } from "./base/page-manager";
import logger from "../logger/logger";

let alertMessage: string;
export class LoginPage extends BasePage {
  constructor(protected pageManager: PageManager) {
    super(pageManager);
  }

  public async enterUsername(username: string): Promise<void> {
    await this.typeTextByPlaceholder("Username", username);
    logger.info(`Entered Username as: ${username}`);
  }

  public async enterPassword(password: string): Promise<void> {
    await this.typeTextByPlaceholder("Password", password);
    logger.info(`Entered Password as: ${password}`);
  }

  public async clickOnLoginButton(): Promise<void> {
    const loginButton = this.page.locator("#login-button");
    await loginButton.hover();
    await loginButton.click({ force: true });
    logger.info("Clicked on the login button");
  }

  public async clickLoginButtonAcceptDialogMessage(): Promise<void> {
    this.page.on("dialog", async (dialog) => {
      alertMessage = dialog.message();
      logger.info(`Alert message: ${alertMessage}`);
      await dialog.accept();
    });
    await this.clickOnLoginButton();
  }

  public async getAlertMessage(): Promise<string> {
    return alertMessage;
  }
}
