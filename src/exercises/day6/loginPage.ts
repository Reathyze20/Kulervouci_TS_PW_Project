import { Page } from "@playwright/test";
import BasePage from "./basePage";

class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  waitForPageToLoad(): Promise<void> {
    console.log("Cekám, zda se stránka načetla...");
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Stránka se načetla.");
        resolve();
      });
    });
  }

  login(username: string, password: string): void {
    console.log(`Přihlašuji se jako ${username} s heslem ${password}`);
  }
}
