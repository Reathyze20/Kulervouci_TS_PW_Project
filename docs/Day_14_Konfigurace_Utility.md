Výborně! Máme za sebou návrhové vzory Factory a Builder. Teď se posuneme od specifických vzorů k dalším **nezbytným součástem** každého robustního testovacího frameworku, které nejsou přímo testy ani Page Objecty, ale zajišťují jeho správné fungování, flexibilitu a použitelnost.

**Den 14: Architektura Frameworku - Konfigurace, Utility, Reporting**

**Proč Potřebujeme Tyto Komponenty?**

Představ si framework jen jako sadu testů a Page Objectů. Brzy narazíš na otázky:

- Kde je definována URL adresa testované aplikace? A co když ji potřebuji změnit pro jiné prostředí (vývoj, staging, produkce)?
- Jak spustím testy v jiném prohlížeči? Jak nastavím timeouty?
- Potřebuji generovat náhodná data (emaily, hesla) pro registraci. Kam dám kód pro tuto funkci, aby se neopakoval?
- Jak zjistím, které testy prošly, které selhaly a proč? Kde najdu přehledné výsledky?

Odpovědi na tyto otázky leží právě v komponentách, na které se zaměříme dnes:

- **Konfigurace:** Oddělení nastavení od kódu.
- **Utility/Helpers:** Znovupoužitelné pomocné funkce.
- **Reporting:** Prezentace výsledků testů.

**Teorie Dne:**

1.  **Správa Konfigurace**

    - **Cíl:** Oddělit nastavení, která se mohou měnit (URL, timeouty, přihlašovací údaje pro testovací účty, typ prohlížeče, přepínače funkcí), od samotného kódu testů a frameworku. Umožnit snadnou změnu těchto nastavení pro různá prostředí nebo běhy testů bez nutnosti měnit kód.
    - **Běžné Způsoby:**
      - **Konfigurační Soubory:** Nejčastější přístup.
        - **JSON:** Jednoduchý, čitelný, dobře podporovaný (`config.json`, `config.staging.json`).
        - **YAML:** Čitelnější pro složitější struktury, vyžaduje parser.
        - **JavaScript/TypeScript soubory (`.js`/`.ts`):** Umožňují programovou logiku v konfiguraci (např. dynamické sestavení URL), mohou exportovat objekt. Playwright často používá `playwright.config.ts`.
        - **`.env` soubory:** Pro ukládání citlivých údajů (hesla, API klíče) a environment-specific proměnných. Často se používají v kombinaci s knihovnou jako `dotenv` pro jejich načtení do environmentálních proměnných Node.js procesu. **Nikdy nekomitujte `.env` soubory s reálnými citlivými údaji do Gitu!** (Přidejte `.env` do `.gitignore`). Místo toho mějte `example.env` nebo `template.env`.
      - **Environmentální Proměnné:** Proměnné nastavené v operačním systému nebo CI/CD pipeline (např. `process.env.BASE_URL`, `process.env.BROWSER`). Umožňují přepsat hodnoty ze souborů pro specifické běhy. Jsou standardem pro CI/CD.
      - **Argumenty Příkazové Řádky:** Pro rychlé přepínače při spouštění (např. `npm test -- --browser=firefox`). Knihovny jako `yargs` nebo `commander` mohou pomoci s parsováním.
    - **Načítání a Priorita:** Často se kombinuje více zdrojů. Běžná priorita (vyšší číslo má přednost):
      1. Argumenty příkazové řádky
      2. Environmentální proměnné
      3. Specifický konfigurační soubor pro prostředí (např. `.env.staging`)
      4. Obecný konfigurační soubor (např. `.env` nebo `config.json`)
      5. Výchozí hodnoty v kódu.
    - **Struktura Konfiguračního Objektu:** Je dobré mít centrální, typovaný objekt (pomocí rozhraní), který drží všechna konfigurační data. Tento objekt je pak přístupný napříč frameworkem (často pomocí Dependency Injection nebo jako singleton).

    ```typescript
    // Příklad rozhraní pro konfiguraci (např. src/interfaces/config.interface.ts)
    export interface TestConfig {
      baseUrl: string;
      apiBaseUrl?: string;
      browser: "chromium" | "firefox" | "webkit";
      headless: boolean;
      defaultTimeout: number;
      reporter: "html" | "list" | "json";
      // ... další nastavení
    }

    // Příklad jednoduchého načítání z JSON (např. src/config/config-loader.ts)
    import * as fs from "fs";
    import * as path from "path";
    import type { TestConfig } from "../interfaces/config.interface.ts";

    function loadConfig(): TestConfig {
      const env = process.env.NODE_ENV || "development"; // Získání prostředí (nebo výchozí)
      const configPath = path.resolve(__dirname, `config.${env}.json`); // Cesta ke specifickému souboru
      const defaultConfigPath = path.resolve(__dirname, "config.base.json"); // Cesta k základnímu souboru

      let baseConfig: Partial<TestConfig> = {};
      if (fs.existsSync(defaultConfigPath)) {
        baseConfig = JSON.parse(fs.readFileSync(defaultConfigPath, "utf-8"));
      }

      let envConfig: Partial<TestConfig> = {};
      if (fs.existsSync(configPath)) {
        envConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      }

      // Jednoduché sloučení (env přepisuje base) - pro hluboké sloučení by byla potřeba knihovna
      const mergedConfig = { ...baseConfig, ...envConfig };

      // Případné přepsání z environmentálních proměnných (zjednodušeno)
      const finalConfig: TestConfig = {
        baseUrl:
          process.env.BASE_URL ||
          mergedConfig.baseUrl ||
          "http://localhost:3000",
        browser:
          (process.env.BROWSER as TestConfig["browser"]) ||
          mergedConfig.browser ||
          "chromium",
        headless: process.env.HEADLESS
          ? process.env.HEADLESS === "true"
          : mergedConfig.headless ?? true,
        defaultTimeout:
          parseInt(process.env.TIMEOUT || "", 10) ||
          mergedConfig.defaultTimeout ||
          5000,
        reporter:
          (process.env.REPORTER as TestConfig["reporter"]) ||
          mergedConfig.reporter ||
          "list",
        // Ostatní hodnoty...
        apiBaseUrl: process.env.API_BASE_URL || mergedConfig.apiBaseUrl,
      };

      // Validace konfigurace by byla dobrý nápad zde

      return finalConfig;
    }

    export const config = loadConfig(); // Načteme konfiguraci při startu a exportujeme ji
    ```

    _Poznámka:_ Playwright má svůj vlastní konfigurační soubor `playwright.config.ts`, který řeší mnoho z těchto věcí (výběr prohlížeče, timeouty, reporting, base URL atd.). Je důležité mu rozumět a využívat ho. Náš vlastní konfigurační mechanismus může doplňovat specifická nastavení aplikace nebo testů, která Playwright neřeší.

2.  **Utility / Helper Funkce**

    - **Cíl:** Shromáždit na jednom místě malé, znovupoužitelné funkce, které řeší běžné úkoly nesouvisející přímo s logikou testů nebo stránek. Dodržuje princip DRY (Don't Repeat Yourself) a SRP.
    - **Co sem patří?**
      - Generátory náhodných dat (stringy, čísla, emaily, UUID).
      - Formátovací funkce (datum, čas, měna).
      - Funkce pro práci s řetězci, poli, objekty.
      - Funkce pro specifické výpočty potřebné v testech.
      - Jednoduché wrappery kolem externích knihoven (např. pro specifické logování).
      - Funkce pro práci se soubory (pokud to není součástí jiné specializované třídy).
    - **Organizace:** Obvykle se umisťují do složky `src/utils` nebo `src/helpers`. Mohou být rozděleny do více souborů podle kategorie (např. `string.utils.ts`, `data.generator.ts`, `date.utils.ts`). Měly by to být čisté funkce (pure functions), pokud je to možné – pro stejný vstup vrátí stejný výstup a nemají vedlejší efekty.

    ```typescript
    // Příklad: src/utils/data.generator.ts
    import { v4 as uuidv4 } from "uuid"; // Potřeba instalovat uuid: npm install uuid @types/uuid

    export function generateRandomEmail(domain: string = "test.local"): string {
      const timestamp = Date.now();
      const randomPart = Math.random().toString(36).substring(2, 8);
      return `user_${timestamp}_${randomPart}@${domain}`;
    }

    export function generateUUID(): string {
      return uuidv4();
    }

    // Příklad: src/utils/string.utils.ts
    export function capitalize(str: string): string {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    ```

3.  **Reporting v Playwright**

    - **Cíl:** Poskytnout jasný a srozumitelný přehled o výsledcích běhu testů – co prošlo, co selhalo, proč selhalo, jak dlouho to trvalo. Zásadní pro analýzu a ladění.
    - **Vestavěné Reportéry Playwright:** Playwright nabízí několik skvělých vestavěných reportérů, které se konfigurují v `playwright.config.ts`.
      - **`list` (výchozí):** Jednoduchý výpis do konzole.
      - **`line`:** Kompaktnější výpis do konzole.
      - **`dot`:** Tečky pro prošlé testy, písmena pro selhání (dobré pro CI).
      - **`html`:** **Velmi doporučený!** Generuje interaktivní HTML report (ve složce `playwright-report`), kde můžete filtrovat výsledky, vidět detaily každého kroku testu, trasy (trace), screenshoty, videa a logy konzole. Skvělý pro lokální ladění i pro sdílení výsledků.
      - **`json`:** Generuje JSON soubor s výsledky, vhodný pro strojové zpracování nebo integraci s jinými nástroji.
      - **`junit`:** Generuje XML report ve formátu JUnit, kompatibilní s mnoha CI/CD platformami (Jenkins, GitLab CI, atd.).
      - **`blob`:** Novější formát pro nahrávání výsledků do služeb jako Current (~Azure Playwright portal).
    - **Konfigurace v `playwright.config.ts`:**

      ```typescript
      import { defineConfig } from "@playwright/test";

      export default defineConfig({
        // ... další nastavení ...

        /* Reporter to use. See https://playwright.dev/docs/test-reporters */
        reporter: [
          ["list"], // Výpis do konzole
          ["html", { open: "never", outputFolder: "my-test-report" }], // HTML report do složky 'my-test-report', neotvírat automaticky
          ["json", { outputFile: "results.json" }], // JSON report
        ],

        /* Sdílená nastavení pro všechny projekty */
        use: {
          /* Base URL pro akce jako `await page.goto('/')` */
          baseURL: process.env.BASE_URL || "http://localhost:3000",

          /* Sbírat trace při prvním opakování selhaného testu. See https://playwright.dev/docs/trace-viewer */
          trace: "on-first-retry", // 'on', 'off', 'retain-on-failure'

          /* Zachytávat screenshoty a videa */
          screenshot: "only-on-failure", // 'on', 'off'
          video: "retain-on-failure", // 'on', 'off', 'on-first-retry'
        },

        // ... definice projektů ...
      });
      ```

    - **Trace Viewer:** Mimořádně užitečný nástroj Playwright (`npx playwright show-trace <cesta_k_trace.zip>`). Umožňuje krok po kroku procházet testem, vidět stav DOM, síťové požadavky a logy konzole pro každý krok. Trace se generuje na základě nastavení `trace` v konfiguraci.

**Praxe Dne:**

1.  **Implementuj Načítání Konfigurace:**

    - Vytvoř jednoduchý `config.base.json` soubor v `src/config` (nebo jinde) s pár základními hodnotami (např. `baseUrl`, `defaultTimeout`).
    - (Volitelně) Vytvoř `config.staging.json` s jinou `baseUrl`.
    - Zkus si napsat jednoduchou funkci (inspirovanou příkladem výše, ale nemusí být tak komplexní) v `src/config/config-loader.ts`, která načte base config a případně ho přepíše hodnotami ze staging configu (pokud existuje nebo pokud je nastavena env proměnná `NODE_ENV=staging`). Můžeš použít `fs.readFileSync` a `JSON.parse`.
    - Exportuj načtený konfigurační objekt.
    - V hlavním skriptu (`src/main.ts` nebo testu) importuj konfiguraci a vypiš její hodnoty. Zkus spustit s `NODE_ENV=staging node ...` (pokud používáš Node.js přímo) a bez toho, abys viděl rozdíl.
    - **Poznámka:** Pokud už intenzivně používáš `playwright.config.ts`, zaměř se spíše na pochopení jeho struktury a možností (baseURL, use, reporter, projekty).

2.  **Vytvoř Utility Funkci:**

    - Vytvoř soubor `src/utils/data.generator.ts`.
    - Implementuj funkci `generateRandomString(length: number): string`, která vrátí náhodný alfanumerický řetězec dané délky.
    - Importuj a použij tuto funkci v `src/main.ts` nebo testu pro vygenerování a vypsání náhodného řetězce.

3.  **Nakonfiguruj HTML Reportér:**
    - Otevři (nebo vytvoř) `playwright.config.ts`.
    - V sekci `reporter` přidej nebo uprav záznam pro HTML reportér: `['html', { open: 'on-failure', outputFolder: 'playwright-report' }]`. (Otevře report automaticky jen pokud nějaký test selže).
    - V sekci `use` nastav `trace: 'on'`, `screenshot: 'on'`, `video: 'on'` (prozatím zapneme vše, abychom viděli, co se generuje).
    - Spusť nějaký jednoduchý Playwright test (např. `npx playwright test`).
    - Prohlédni si obsah složky `playwright-report`. Otevři `index.html`. Prozkoumej strukturu reportu, podívej se na kroky, screenshoty, video a trace (pokud se vygeneroval – pro úspěšný test může být nutné `trace: 'on'`).

**Cíl Dne:**

- **Rozumět** potřebě oddělení konfigurace od kódu a znát běžné způsoby její správy (soubory, env proměnné).
- **Být schopen** implementovat jednoduchý mechanismus načítání konfigurace nebo rozumět konfiguraci v `playwright.config.ts`.
- **Chápat** účel utility/helper funkcí a umět vytvořit a používat jednoduchou utility funkci.
- **Znát** základní vestavěné reportéry Playwright, zejména HTML reportér.
- **Umět nakonfigurovat** základní reporting a sběr artefaktů (trace, screenshoty, video) v `playwright.config.ts`.

Tyto komponenty tvoří podpůrnou strukturu frameworku, která je klíčová pro jeho praktické použití a údržbu. Zítra nás čeká poslední den intenzivního plánu – zaměříme se na kvalitu kódu pomocí lintingu a formátování a uděláme celkové shrnutí.
