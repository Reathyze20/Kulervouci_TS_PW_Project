Super! Máme za sebou SOLID principy, které nám dávají vodítka pro kvalitní objektově orientovaný návrh. Dnes se podíváme na dva další konkrétní **návrhové vzory**, které řeší běžné problémy při vývoji softwaru a jsou velmi užitečné i při stavbě testovacího frameworku: **Factory (Továrna)** a **Builder (Stavitel)**. Tyto vzory nám často pomáhají dodržovat SOLID principy, zejména OCP a DIP.

**Den 13: Další Návrhové Vzory - Factory, Builder**

**Proč Další Návrhové Vzory?**

Návrhové vzory jsou osvědčená, opakovatelná řešení běžných problémů v softwarovém návrhu. Nepředstavují konkrétní kód, ale spíše šablonu nebo popis, jak strukturovat části kódu k dosažení určitého cíle. Pomáhají nám:

- Řešit problémy efektivněji (nemusíme znovu vynalézat kolo).
- Zlepšit strukturu a flexibilitu kódu.
- Usnadnit komunikaci v týmu (když řekneš "použijeme zde Factory", ostatní vědí, co máš na mysli).

**Teorie Dne:**

1.  **Factory Method / Abstract Factory (Tovární Metoda / Abstraktní Továrna)**

    - **Problém:** Jak vytvářet objekty, když přesný typ objektu, který má být vytvořen, není předem znám nebo se může měnit? Jak oddělit kód, který objekty používá (klient), od kódu, který je vytváří? Jak umožnit snadné přidávání nových typů objektů bez modifikace klienta? (Pomáhá s OCP a DIP).
    - **Koncept (Factory Method):** Definuje rozhraní (nebo abstraktní metodu v rodičovské třídě) pro vytváření objektu, ale nechává na potomcích (subclasses), aby rozhodly, kterou konkrétní třídu vytvoří. Klient pracuje s rodičovskou třídou/rozhraním a volá tovární metodu, aniž by věděl, jaký konkrétní produkt bude vytvořen.
    - **Koncept (Abstract Factory):** Poskytuje rozhraní pro vytváření _rodin souvisejících nebo závislých objektů_, aniž by specifikovalo jejich konkrétní třídy. Představ si továrnu na nábytek, která umí vyrobit židli, stůl a skříň buď v moderním, nebo ve viktoriánském stylu. Abstraktní továrna by měla metody `createChair()`, `createTable()`, `createWardrobe()`, a měli bychom konkrétní továrny `ModernFurnitureFactory` a `VictorianFurnitureFactory`, které by implementovaly tyto metody a vracely odpovídající produkty.
    - **Použití v Test Automation:**
      - **Browser/Driver/Context Factory:** Klasický a velmi užitečný příklad. Vytvoříme funkci nebo třídu (továrnu), která na základě konfigurace (např. string `'chromium'`, `'firefox'`, `'webkit'`) spustí a vrátí odpovídající instanci Playwright `Browser` nebo `BrowserContext`. Náš testovací kód nebo `BasePage` pak jen požádá továrnu o "kontext prohlížeče" a nemusí se starat o to, _jak_ byl spuštěn nebo který konkrétní prohlížeč to je. Centralizuje logiku spouštění prohlížečů.
      - **Test Data Factory:** Může vytvářet různé typy testovacích dat (např. `ValidUser`, `AdminUser`, `UserWithMissingAddress`) na základě nějakého identifikátoru.
      - **(Méně často) Page Object Factory:** Továrna, která by mohla vytvářet instance Page Objectů a automaticky jim předávat (`injectovat`) potřebné závislosti (jako `Page` instanci, logger atd.).

    ```typescript
    // Příklad jednoduché Browser Context Factory (funkce)
    import {
      chromium,
      firefox,
      webkit,
      Browser,
      BrowserContext,
    } from "@playwright/test";

    type BrowserName = "chromium" | "firefox" | "webkit";

    async function createBrowserContext(
      browserName: BrowserName,
      options: object = {}
    ): Promise<{ browser: Browser; context: BrowserContext }> {
      let browser: Browser;
      console.log(`[Factory] Vytvářím kontext pro: ${browserName}`);

      switch (browserName) {
        case "chromium":
          browser = await chromium.launch(options);
          break;
        case "firefox":
          browser = await firefox.launch(options);
          break;
        case "webkit":
          browser = await webkit.launch(options);
          break;
        default:
          // Případ pro neznámý název - můžeme vyhodit chybu nebo použít výchozí
          throw new Error(`Neznámý název prohlížeče: ${browserName}`);
        // nebo: browser = await chromium.launch(options);
      }
      const context = await browser.newContext();
      console.log(`[Factory] Kontext pro ${browserName} vytvořen.`);
      return { browser, context };
    }

    // Použití:
    async function runWithBrowser(name: BrowserName) {
      let browserInstance: Browser | null = null; // Deklarujeme mimo try pro finally
      try {
        // Získáme browser a kontext z továrny
        const { browser, context } = await createBrowserContext(name);
        browserInstance = browser; // Uložíme si instanci pro zavření

        const page = await context.newPage();
        await page.goto("https://playwright.dev/");
        console.log(`Titulek (${name}): ${await page.title()}`);
        // ... další testovací logika ...
        await context.close(); // Zavřeme kontext
      } catch (error) {
        console.error(`Chyba při běhu s ${name}:`, error);
      } finally {
        if (browserInstance) {
          await browserInstance.close(); // Vždy zavřeme browser
          console.log(`[Factory] Prohlížeč ${name} zavřen.`);
        }
      }
    }

    // runWithBrowser('chromium');
    // runWithBrowser('firefox');
    ```

2.  **Builder (Stavitel)**

    - **Problém:** Jak vytvořit komplexní objekt, který má mnoho částí nebo volitelných parametrů, krok za krokem? Jak zajistit, aby byl objekt vytvořen konzistentně a aby byl neměnný (immutable) po dokončení stavby? Jak se vyhnout konstruktorům s mnoha parametry (tzv. "telescoping constructor") nebo nutnosti volat mnoho setter metod?
    - **Koncept:** Odděluje proces konstrukce objektu od jeho finální reprezentace. Builder je samostatný objekt, který má metody pro nastavení jednotlivých částí budovaného objektu (např. `setUsername("test")`, `setEmail("test@example.com")`, `isAdmin(true)`). Tyto metody často vracejí `this` (samotný builder), což umožňuje řetězení volání (`builder.setUsername(...).setEmail(...).build()`). Nakonec se zavolá metoda `build()`, která zkompletuje a vrátí finální, často neměnný objekt.
    - **Použití v Test Automation:**
      - **Test Data Builder:** Velmi časté a užitečné! Umožňuje čitelně vytvářet instance objektů s testovacími daty (např. `User`, `Product`, `Order`) pro různé testovací scénáře, kde potřebujeme nastavit jen některé specifické vlastnosti a ostatní mohou mít výchozí hodnoty.
      - **API Request Builder:** Pro sestavování složitých API požadavků s různými hlavičkami, parametry, těly.
      - **Configuration Builder:** Pro sestavení komplexního konfiguračního objektu frameworku z různých zdrojů (soubory, env proměnné, argumenty příkazové řádky).

    ```typescript
    // Příklad Test Data Builderu pro uživatele

    interface User {
      readonly username: string; // Používáme readonly pro neměnnost
      readonly email: string;
      readonly firstName?: string;
      readonly lastName?: string;
      readonly isActive: boolean;
      readonly roles: string[];
    }

    class UserDataBuilder {
      private _username: string = `testuser_${Date.now()}`; // Výchozí hodnoty
      private _email: string = `${this._username}@example.com`;
      private _firstName?: string;
      private _lastName?: string;
      private _isActive: boolean = true;
      private _roles: string[] = ["user"];

      withUsername(username: string): this {
        // Metody vrací 'this' pro řetězení
        this._username = username;
        // Aktualizujeme i email, pokud nebyl explicitně nastaven jinak
        if (this._email.startsWith("testuser_")) {
          this._email = `${username}@example.com`;
        }
        return this;
      }

      withEmail(email: string): this {
        this._email = email;
        return this;
      }

      withFirstName(firstName: string): this {
        this._firstName = firstName;
        return this;
      }

      withLastName(lastName: string): this {
        this._lastName = lastName;
        return this;
      }

      asInactive(): this {
        this._isActive = false;
        return this;
      }

      withRoles(roles: string[]): this {
        this._roles = roles;
        return this;
      }

      asAdmin(): this {
        if (!this._roles.includes("admin")) {
          this._roles.push("admin");
        }
        return this;
      }

      // Metoda build vytvoří a vrátí finální neměnný objekt User
      build(): User {
        // Zde můžeme přidat validaci, zda jsou všechny povinné pole nastaveny
        if (!this._username || !this._email) {
          throw new Error("Username and Email are required to build a User.");
        }

        // Vracíme objekt splňující rozhraní User
        return {
          username: this._username,
          email: this._email,
          firstName: this._firstName,
          lastName: this._lastName,
          isActive: this._isActive,
          roles: [...this._roles], // Vracíme kopii pole pro zajištění neměnnosti
        };
      }
    }

    // Použití Builderu:
    console.log("\n--- User Data Builder ---");

    const defaultUser = new UserDataBuilder().build();
    console.log("Výchozí uživatel:", defaultUser);

    const specificUser = new UserDataBuilder()
      .withUsername("john.doe")
      .withFirstName("John")
      .withLastName("Doe")
      .asInactive()
      .build();
    console.log("Specifický uživatel:", specificUser);

    const adminUser = new UserDataBuilder()
      .withUsername("superadmin")
      .withEmail("admin@corp.com")
      .asAdmin() // Přidá roli admin
      .withRoles(["admin", "auditor"]) // Přepíše role
      .build();
    console.log("Admin uživatel:", adminUser);

    // Porovnejte čitelnost vytvoření 'specificUser' pomocí builderu
    // s potenciálním konstruktorem:
    // new User("john.doe", "john.doe@example.com", "John", "Doe", false, ['user'])
    // nebo s nastavováním vlastností (pokud by User nebyl readonly):
    // const user = new User(...); user.isActive = false; user.firstName = "John"; ...
    ```

**Praxe Dne:**

1.  **Navrhni Factory (Teoreticky/Pseudokód):**

    - Jak by vypadala struktura funkce nebo třídy `createDriver(config: DriverConfig): Promise<WebDriver>` (použijme fiktivní `WebDriver` a `DriverConfig`), která by na základě konfigurace (např. `{ type: 'selenium', browser: 'chrome', remoteUrl: '...' }` nebo `{ type: 'playwright', browser: 'firefox' }`) vytvářela různé instance "WebDriverů"? Zaměř se na `switch` nebo podmínky a volání různých inicializačních funkcí.
    - Jak by to pomohlo dodržet OCP (přidání nového typu driveru by nemělo měnit kód, který driver používá) a DIP (kód používající driver by závisel na rozhraní `WebDriver`, ne na konkrétní implementaci)?

2.  **Implementuj Builder:**
    - Vytvoř jednoduché rozhraní `interface TestConfig { baseUrl: string; timeout?: number; browser: 'chromium' | 'firefox' | 'webkit'; headless: boolean; retries: number; }`.
    - Implementuj třídu `TestConfigBuilder` s metodami jako `withBaseUrl(url: string)`, `withTimeout(ms: number)`, `useBrowser(browserName: 'chromium' | 'firefox' | 'webkit')`, `runHeadless(isHeadless: boolean)`, `withRetries(count: number)` a finální metodou `build(): TestConfig`. Nastav rozumné výchozí hodnoty v builderu.
    - Vytvoř pomocí builderu alespoň dvě různé konfigurace a vypiš je do konzole.

**Cíl Dne:**

- **Pochopit** účel a základní strukturu návrhových vzorů Factory a Builder.
- **Rozpoznat** situace v testovacím frameworku, kde mohou být tyto vzory užitečné (vytváření driverů/kontextů, testovacích dat, konfigurací, API požadavků).
- **Umět implementovat** jednoduchý Builder pro vytváření komplexních objektů čitelným a flexibilním způsobem.
- **Vidět souvislost** mezi těmito vzory a SOLID principy (zejména OCP a DIP).

Factory a Builder jsou mocné nástroje pro zpřehlednění a zpružnění kódu, zejména když pracujete s objekty, jejichž vytváření je netriviální nebo variabilní.

Jak ti šla implementace Builderu? Máš představu, jak bys navrhl/a tu Browser Factory? Zítra se zaměříme na další klíčové komponenty frameworku: konfiguraci, utility a reporting.
