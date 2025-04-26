import { Page } from "@playwright/test";

export interface PageInterface {
  page: Page;
  getPageUrl: () => Promise<void>;
  getUserName: () => Promise<string>;
  getUserEmail: () => Promise<string>;
  getUserPhone: () => Promise<string>;
}
