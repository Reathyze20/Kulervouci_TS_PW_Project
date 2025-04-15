Fantasticky! Máme za sebou důležité stavební kameny TypeScriptu a organizaci kódu. Dnes se konečně dostáváme k návrhovému vzoru, který je naprosto **zásadní pro tvorbu udržitelných, čitelných a robustních frameworků pro UI test automatizaci**: **Page Object Model (POM)**.

**Den 10: Úvod do Návrhových Vzorů - Page Object Model (POM)**

**Proč POM? Co Řeší?**

Představ si test, který ověřuje přihlášení. Bez POM by mohl vypadat nějak takto (pseudokód):

```typescript
// Špatný příklad - Bez POM
test("Login Test - No POM", async ({ page }) => {
  await page.goto("/login");
  await page.locator("#username").fill("testuser");
  await page.locator("#password").fill("password123");
  await page.locator('button[type="submit"]').click();
  await expect(page.locator(".user-greeting")).toHaveText("Welcome, testuser!");
  // Co když se změní selektor pro username? Musíš ho opravit zde.
  // Co když stejné přihlášení potřebuješ v jiném testu? Kopírovat kód?
  // Co když se změní přihlašovací flow? Opravovat na mnoha místech?
  // Je tento test čitelný na první pohled? Co vlastně dělá z pohledu uživatele?
});
```

Tento přístup má několik **zásadních problémů**:

- **Křehkost:** Jakákoli změna v UI (změna ID, třídy, struktury) si vyžádá úpravu _všech_ testů, které daný prvek používají.
- **Duplicita Kódu:** Stejné selektory a sekvence akcí (jako vyplnění přihlašovacího formuláře) se opakují v mnoha testech.
- **Špatná Čitelnost:** Testovací skript je zahlcen detaily implementace (selektory, konkrétní Playwright volání). Není na první pohled jasné, jaký uživatelský scénář test pokrývá.
- **Složitá Údržba:** Opravy a úpravy jsou časově náročné a náchylné k chybám.

**Page Object Model řeší tyto problémy tím, že odděluje logiku testu od logiky interakce se stránkou.**

**Teorie Dne:**

1.  **Co je Page Object?**

    - Page Object je **třída**, která reprezentuje jednu konkrétní **stránku** nebo **významnou komponentu** (např. hlavička, postranní menu, dialogové okno) v testované aplikaci.
    - Zapouzdřuje **prvky (elements)** této stránky a **akce (actions)**, které s nimi uživatel může provádět.

2.  **Anatomie Page Object Třídy:**

    - **Lokátory (Locators/Selectors):**
      - Definice způsobu, jak nalézt prvky na stránce (CSS selektory, XPath, ID, Playwright `Locator` objekty).
      - Měly by být uloženy jako **vlastnosti třídy**, typicky `private` nebo `protected` a `readonly`, aby se neměnily a nebyly přímo přístupné zvenčí. Tím zajistíme, že pokud se selektor změní, stačí ho opravit **na jednom místě** – uvnitř Page Objectu.
      - Příklad: `private readonly usernameInput = '#username';` nebo lépe s Playwright: `private readonly usernameInputLocator = this.page.locator('#username');`
    - **Akce (Action Methods):**
      - **Veřejné metody (`public`)**, které reprezentují **uživatelské akce** na stránce (např. `login`, `fillUsername`, `clickLoginButton`, `searchForProduct`).
      - Tyto metody **skrývají detaily interakce** s Playwright API a lokátory. Místo `await page.locator('#username').fill('user')` v testu zavoláš `await loginPage.fillUsername('user')`.
      - Metody by měly být pojmenovány podle **akce**, kterou uživatel provádí, ne podle toho, s jakým prvkem interagují (např. `login()` je lepší než `fillFormAndClickSubmit()`).
      - **Návratová hodnota:** Pokud akce způsobí přechod na jinou stránku nebo zobrazení jiné komponenty, metoda by měla **vrátit instanci odpovídajícího Page Objectu**. Například metoda `login()` na `LoginPage` by mohla vrátit `Promise<HomePage>`. To umožňuje plynulé řetězení akcí v testu (`await loginPage.login(...).waitForDashboard()`).
      - Všechny metody interagující s `page` budou `async` a budou používat `await`.
    - **Verifikace/Stav (Verification/State Methods - Volitelné):**
      - Metody, které vrací informace o stavu stránky (např. `getErrorMessage(): Promise<string>`, `isUserLoggedIn(): Promise<boolean>`, `getPageHeaderText(): Promise<string>`).
      - Pomáhají udržet logiku pro získávání stavu stránky uvnitř Page Objectu.
      - **Pozor:** Samotné `expect()` (asertace) by měly zůstat **v testovacím skriptu**, ne v Page Objectu. Page Object poskytuje data nebo stav, test ověřuje, zda je správný. (Např. `const message = await loginPage.getErrorMessage(); expect(message).toContain('Invalid credentials');`). Oddělení zodpovědnosti.
    - **Konstruktor:**
      - Typicky přijímá instanci Playwright `Page` jako parametr (dependency injection). Tuto instanci si uloží do `private readonly page` vlastnosti pro použití v akčních metodách.
      - Pokud dědíme z `BasePage`, zavolá `super(page)`.

3.  **Vztah k `BasePage`:**

    - Jak jsme viděli v Dni 6, konkrétní Page Objecty (`LoginPage`, `HomePage`) **dědí** (`extends`) z `BasePage`.
    - Získávají tak přístup ke společné funkcionalitě (instance `page`, obecné metody jako `navigate`, `getTitle`, společné čekací mechanismy atd.) definované v `BasePage`.

4.  **Výhody (Shrnutí):**
    - **Znovupoužitelnost:** Kód pro interakci se stránkou (lokátory, akce) je na jednom místě a může být volán z více testů.
    - **Čitelnost:** Testovací skripty se stávají mnohem čistšími. Čtou se jako sekvence uživatelských akcí, ne jako změť selektorů a Playwright volání.
    - **Údržba:** Pokud se změní UI, stačí upravit odpovídající Page Object třídu na jednom místě. Testy zůstávají (ideálně) beze změny.
    - **Separace Zodpovědností (Separation of Concerns):** Test se stará o _co_ a _proč_ testovat (logika testu, scénář, aserce). Page Object se stará o _jak_ interagovat se stránkou (implementační detaily).

**Praxe Dne:**

Vezmeme kód pro `LoginPage` a `HomePage` (a `BasePage`), který jsme vytvořili a refaktorovali v minulých dnech, a upravíme ho do solidnější POM struktury.

1.  **Uprav `BasePage` (pokud je třeba):**

    - Ujisti se, že `BasePage` (`src/pages/base.page.ts`) má `protected readonly page: Page;` a konstruktor, který ji přijímá. Může obsahovat obecné metody jako `navigate`, `getTitle`.

2.  **Refaktoruj `LoginPage` (`src/pages/login.page.ts`):**

    ```typescript
    import type { Page, Locator } from "@playwright/test";
    import { BasePage } from "./base.page";
    import { HomePage } from "./home.page"; // Importujeme HomePage pro návratový typ

    export class LoginPage extends BasePage {
      // --- Lokátory ---
      // Používáme Playwright Locators - jsou robustnější a doporučené
      private readonly usernameInput: Locator;
      private readonly passwordInput: Locator;
      private readonly loginButton: Locator;
      private readonly errorMessage: Locator; // Přidáme lokátor pro chybovou hlášku

      // Konstruktor přijímá Page a inicializuje lokátory a volá super
      constructor(page: Page) {
        super(page); // Zavoláme konstruktor BasePage
        // Inicializujeme lokátory v konstruktoru
        this.usernameInput = this.page.locator("#username"); // Nahraď skutečným selektorem
        this.passwordInput = this.page.locator("#password"); // Nahraď skutečným selektorem
        this.loginButton = this.page.locator('button[type="submit"]'); // Nahraď skutečným selektorem
        this.errorMessage = this.page.locator(".error-message"); // Nahraď skutečným selektorem
      }

      // --- Akce ---

      // Implementace abstraktní metody z BasePage (pokud ji tam máš)
      async waitForPageToLoad(): Promise<void> {
        console.log("[LoginPage] Čekám na načtení přihlašovací stránky...");
        await this.usernameInput.waitFor({ state: "visible", timeout: 5000 });
        console.log("[LoginPage] Přihlašovací stránka načtena.");
      }

      async fillUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
      }

      async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
      }

      async clickLoginButton(): Promise<void> {
        await this.loginButton.click();
      }

      /**
       * Kompletní akce přihlášení.
       * Vyplní jméno, heslo a klikne na tlačítko.
       * Vrací instanci HomePage, protože úspěšné přihlášení vede na domovskou stránku.
       */
      async login(username: string, password: string): Promise<HomePage> {
        console.log(`[LoginPage] Provádím přihlášení uživatele ${username}`);
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
        // Předpokládáme, že úspěšné přihlášení nás přesměruje na HomePage
        // Vracíme novou instanci HomePage, které předáme stejný 'page' objekt
        return new HomePage(this.page);
      }

      // --- Verifikace/Stav ---

      async getErrorMessage(): Promise<string | null> {
        // Vrátí text chybové zprávy, pokud je viditelná, jinak null
        if (await this.errorMessage.isVisible()) {
          return await this.errorMessage.textContent();
        }
        return null;
      }

      async isErrorMessageVisible(): Promise<boolean> {
        return await this.errorMessage.isVisible();
      }
    }
    ```

3.  **Refaktoruj `HomePage` (`src/pages/home.page.ts`):**

    - Podobně přidej lokátory (např. `welcomeMessage`, `logoutButton`).
    - Přidej metody pro akce (`clickLogout`) a získání stavu (`getWelcomeMessage`).
    - Implementuj `waitForPageToLoad` pro HomePage (čekání na specifický prvek na home page).
    - Metoda `clickLogout` by mohla vracet `Promise<LoginPage>`.

4.  **Napiš Test Využívající POM (`src/main.ts` nebo `src/tests/login.test.ts`):**

    ```typescript
    // Příklad v src/main.ts (nebo lépe v Playwright testu)
    import { LoginPage } from "./pages/login.page";
    // Import expect a test z Playwright, pokud jsi v testovacím souboru
    // import { test, expect, Page } from '@playwright/test';

    // Funkce simulující běh testu (v reálném Playwright testu by to bylo uvnitř 'test(...)')
    async function runSimpleLoginTest(
      page: any /* Nahraď Page z Playwright */
    ) {
      console.log("--- Spouštím Test Přihlášení (s POM) ---");
      const loginPage = new LoginPage(page);

      await loginPage.navigate("/login"); // Metoda zděděná z BasePage
      await loginPage.waitForPageToLoad(); // Metoda implementovaná v LoginPage

      // Provádíme akci login, která vrací HomePage
      const homePage = await loginPage.login("testuser", "correctPassword");
      console.log("Přihlášení provedeno, očekáváme HomePage.");

      // Nyní můžeme pracovat s HomePage
      await homePage.waitForPageToLoad();
      const greeting = await homePage.getWelcomeMessage(); // Metoda z HomePage
      console.log("Ověření: Uvítací zpráva:", greeting);

      // Zde by v reálném testu byla aserce:
      // expect(greeting).toContain("Welcome, testuser");

      // Příklad logoutu
      // const finalLoginPage = await homePage.clickLogout();
      // await finalLoginPage.waitForPageToLoad();
      // expect(await finalLoginPage.isErrorMessageVisible()).toBe(false); // Ověření, že jsme na login page bez chyby

      console.log("--- Test Přihlášení Dokončen ---");
    }

    // --- Simulace spuštění ---
    const mockPage: any = {
      // Znovu použijeme mock pro demonstraci bez Playwright
      goto: async (url: string) => console.log(`Mock GOTO: ${url}`),
      title: async () => "Mock Title",
      locator: (selector: string) => ({
        fill: async (value: string) =>
          console.log(`Mock FILL: ${selector} with ${value}`),
        click: async () => console.log(`Mock CLICK: ${selector}`),
        waitFor: async (options: any) =>
          console.log(`Mock WAITFOR: ${selector}`, options),
        isVisible: async () => {
          console.log(`Mock isVisible: ${selector}`);
          return (
            selector.includes("welcome") || selector.includes("username")
          ); /* Simulace */
        },
        textContent: async () => {
          console.log(`Mock textContent: ${selector}`);
          return selector.includes("welcome")
            ? "Mock Welcome, testuser!"
            : "Mock Error";
        },
      }),
    };

    // Mock pro HomePage (jen pro spuštění ukázky)
    class HomePage extends BasePage {
      private readonly welcomeMessage = this.page.locator(".welcome-message");
      constructor(page: any) {
        super(page);
      }
      async waitForPageToLoad() {
        await this.welcomeMessage.waitFor({ state: "visible" });
        console.log("[HomePage] Načtena.");
      }
      async getWelcomeMessage() {
        return this.welcomeMessage.textContent();
      }
      // async clickLogout(): Promise<LoginPage> { /* ... */ return new LoginPage(this.page); }
    }

    runSimpleLoginTest(mockPage).catch(console.error);

    // Všimni si, jak je 'runSimpleLoginTest' čistý - popisuje kroky uživatele.
    // Všechny detaily ('#username', '.click()', '.fill()') jsou skryty v Page Objectech.
    ```

**Cíl Dne:**

- **Hluboce porozumět** principům, výhodám a struktuře Page Object Modelu.
- **Být schopen navrhnout** a implementovat základní Page Object třídu (lokátory, akce, konstruktor).
- **Refaktorovat** existující kód do POM struktury, využívající dědičnost z `BasePage`.
- **Napsat test**, který efektivně využívá Page Objecty k oddělení testovací logiky od implementace interakce se stránkou.

POM je základním kamenem většiny úspěšných a udržitelných UI automatizačních projektů. Je to investice do struktury, která se mnohonásobně vrátí při údržbě a rozšiřování testů.

Jak ti šlo refaktorování a pochopení principů POM? Jsou nějaké části nejasné? Zítra se podíváme na SOLID principy, které nám pomohou psát ještě čistší a flexibilnější kód v našich Page Objectech a celém frameworku.
