import { Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { ILoginPageActions } from "../exercises/day5/day5";
import { UserCredentials } from "../interfaces/data.interfaces";

export class LoginPage extends BasePage {
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

  async login(username: string, password: string) {
    console.log(`Přihlašuji se jako ${username} s heslem ${password}`);
  }
}
