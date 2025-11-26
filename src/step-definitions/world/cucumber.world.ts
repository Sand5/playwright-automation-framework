import {
  World,
  setWorldConstructor,
  IWorldOptions,
} from "@cucumber/cucumber";
import { PageManager } from "../../page-objects/base/page-manager";
import { BasePage } from "../../page-objects/base/base.page";
import { HomePage } from "../../page-objects/home.page";
import { ContactUsPage } from "../../page-objects/contact-us.page";
import { LoginPage } from "../../page-objects/login.page";
import logger from "../../logger/logger";
import { pageFixture } from "../hooks/browser-context.fixture";

interface IUser {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export class CucumberWorld extends World {
  // ----------------- Internal references -----------------
  private _pageManager?: PageManager;
  private _basePage?: BasePage;
  private _homePage?: HomePage;
  private _contactUsPage?: ContactUsPage;
  private _loginPage?: LoginPage;

  private _url?: string;
  private _user: IUser = {};

  // ----------------- Constructor -----------------
  constructor(options: IWorldOptions) {
    super(options);
    logger.info("Cucumber World initialized for a new scenario.");
  }

  // ----------------- PageManager / Pages -----------------
  get pageManager(): PageManager {
    if (!this._pageManager) {
      if (!pageFixture.page) {
        throw new Error("pageFixture.page is not initialized yet!");
      }
      this._pageManager = new PageManager(pageFixture.page);
    }
    return this._pageManager;
  }

  get basePage(): BasePage {
    if (!this._basePage) this._basePage = this.pageManager.createBasePage(); // lazy-load shared BasePage
    return this._basePage;
  }

  get homePage(): HomePage {
    if (!this._homePage) this._homePage = this.pageManager.createHomePage(); // lazy-load HomePage
    return this._homePage;
  }

  get contactUsPage(): ContactUsPage {
    if (!this._contactUsPage)
      this._contactUsPage = this.pageManager.createContactUsPage(); // lazy-load ContactUsPage
    return this._contactUsPage;
  }

  get loginPage(): LoginPage {
    if (!this._loginPage) this._loginPage = this.pageManager.createLoginePage(); // lazy-load LoginPage
    return this._loginPage;
  }

  // ----------------- Scenario state -----------------
  set url(url: string) {
    this._url = url;
  }

  get url(): string | undefined {
    return this._url;
  }

  set user(data: IUser) {
    // Merge new data with existing _user state
    this._user = { ...this._user, ...data };
  }

  get user(): IUser {
    return this._user;
  }

  // ----------------- New helper for dynamic user data -----------------
  async setUserData(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) {
    // Destructure for logging convenience
    const { firstName, lastName, email } = data;

    // Build a log message dynamically
    let logMessage = "Setting user info:";
    if (firstName) logMessage += ` First Name: ${firstName}`;
    if (lastName) logMessage += ` Last Name: ${lastName}`;
    if (email) logMessage += ` Email: ${email}`;

    logger.info(logMessage);

    // Update internal _user state
    this.user = data;
  }
  // ----------------- Scenario cleanup -----------------

  // Reset pages for next scenario
  resetPages() {
    this._pageManager = undefined;
    this._basePage = undefined;
    this._homePage = undefined;
    this._contactUsPage = undefined;
  }
}

// Tell Cucumber to use this custom World
setWorldConstructor(CucumberWorld);
