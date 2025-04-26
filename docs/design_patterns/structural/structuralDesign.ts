import { Page } from "@playwright/test";
import { PageInterface } from "../../../src/interfaces/pageInterface";

export class LoginPage implements PageInterface {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async getPageUrl() {
    return this.page.url();
  }

  async getUserName() {
    return this.page.locator("#user-name").textContent();
  }
}
