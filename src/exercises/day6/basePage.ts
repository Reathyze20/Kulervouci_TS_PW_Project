import { Page } from "@playwright/test";

abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    console.log(`Navigating to URL: ${url}`);
    // Případně: await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    console.log("Getting page title...");
    return "Mock Title"; // Mock hodnota pro účely demonstrace
  }

  abstract waitForPageToLoad(): Promise<void>;
}

export default BasePage;
