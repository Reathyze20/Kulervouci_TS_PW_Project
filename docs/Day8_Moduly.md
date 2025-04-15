Jasně, pojďme na Den 8! Teď, když máme solidní základ v TypeScriptu, OOP a asynchronním programování, je čas zaměřit se na to, jak náš kód **organizovat**. S rostoucím projektem se udržování veškerého kódu v jednom nebo několika málo souborech stává noční můrou.

**Den 8: Moduly a Jmenné Prostory (Namespaces)**

**Proč Potřebujeme Moduly?**

Představ si, že stavíš dům. Místo abys měl jednu obrovskou místnost se vším (kuchyň, ložnice, koupelna dohromady), rozdělíš dům do logických celků – pokojů. Každý pokoj má svůj účel a vybavení. Moduly v programování fungují podobně:

- **Organizace:** Rozdělují kód do menších, logických souborů podle jejich zodpovědnosti (např. jeden soubor pro `LoginPage`, jiný pro utility funkce, další pro rozhraní).
- **Znovupoužitelnost:** Umožňují snadno sdílet kód (třídy, funkce, konstanty, typy) mezi různými částmi projektu nebo dokonce mezi různými projekty.
- **Zapouzdření:** Pomáhají izolovat kód. Proměnné a funkce definované v jednom modulu nejsou automaticky dostupné globálně, což zabraňuje konfliktům názvů (když dvě různé části kódu omylem použijí stejný název pro proměnnou). Musíš explicitně označit, co chceš z modulu "vystavit" ven.
- **Údržba:** Je mnohem snazší najít a upravit kód, když je logicky rozdělený.

**Teorie Dne:**

1.  **ES6 Moduly (`import`/`export`)**

    - Toto je **standardní a preferovaný** způsob modularizace v moderním JavaScriptu a TypeScriptu. Každý soubor (`.ts`) je v podstatě považován za modul.
    - **`export`**: Klíčové slovo pro označení toho, co má být z modulu (souboru) dostupné pro ostatní moduly.

      - **Pojmenovaný export (Named Export):** Exportuje konkrétní proměnnou, funkci, třídu, rozhraní, typ atd. pod jejím jménem. V jednom souboru může být více pojmenovaných exportů.

      ```typescript
      // file: utils.ts
      export const PI = 3.14159;

      export function capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }

      export interface Config {
        timeout: number;
      }
      ```

      - **Výchozí export (Default Export):** Označuje jednu hlavní věc, kterou soubor exportuje. V každém souboru může být **maximálně jeden** výchozí export. Často se používá pro export hlavní třídy nebo funkce ze souboru.

      ```typescript
      // file: Calculator.ts
      export default class Calculator {
        add(a: number, b: number): number {
          return a + b;
        }
        // ... další metody
      }
      ```

      _Poznámka:_ Existují diskuse, zda preferovat named nebo default exporty. Named exporty jsou často považovány za explicitnější a lépe podporují refaktoring a "tree shaking" (odstranění nepoužitého kódu). Budeme se držet spíše named exportů, pokud nebude specifický důvod pro default.

    - **`import`**: Klíčové slovo pro načtení (importování) funkcionality z jiného modulu.

      - **Import pojmenovaných exportů:** Používáme složené závorky `{}`. Názvy musí odpovídat exportovaným názvům (i když je lze přejmenovat pomocí `as`).

      ```typescript
      // file: main.ts
      import { PI, capitalize, Config } from "./utils"; // Cesta k souboru (relativní nebo absolutní)
      import { capitalize as makeFirstLetterUpper } from "./utils"; // Přejmenování při importu

      console.log(PI);
      const name = "john";
      console.log(capitalize(name)); // -> John
      console.log(makeFirstLetterUpper("doe")); // -> Doe

      let myConfig: Config = { timeout: 5000 };
      ```

      - **Import výchozího exportu:** Nepoužíváme složené závorky. Můžeme si zvolit libovolný název pro importovanou hodnotu.

      ```typescript
      // file: main.ts
      import MyCalc from "./Calculator"; // Importujeme default export a pojmenujeme ho MyCalc

      const calc = new MyCalc();
      console.log(calc.add(5, 3)); // -> 8
      ```

      - **Import všeho jako jmenný prostor (Namespace Import):** Importuje všechny _pojmenované_ exporty z modulu jako jeden objekt.

      ```typescript
      // file: main.ts
      import * as Utils from "./utils"; // Importuje vše jako objekt Utils

      console.log(Utils.PI);
      console.log(Utils.capitalize("world"));
      let anotherConfig: Utils.Config = { timeout: 1000 };
      ```

      - **Import pouze pro typy (Type-Only Imports):** Pokud importuješ pouze typy (rozhraní, typové aliasy), můžeš použít `import type`. To dává TypeScriptu signál, že tento import lze při kompilaci do JavaScriptu úplně odstranit (protože typy v JS neexistují).

      ```typescript
      import type { Config } from "./utils"; // Importujeme POUZE typ

      let config: Config = { timeout: 3000 };
      // Nelze použít Config jako hodnotu (např. new Config() - pokud by to byla třída)
      ```

2.  **Jmenné Prostory (`namespace`)**
    - Starší způsob organizace kódu v TypeScriptu, který byl populární před širokým přijetím ES6 modulů. Primárně sloužil k zabránění kolizím v globálním jmenném prostoru.
    - Syntax: `namespace MyNamespace { export class MyClass {} }`
    - Použití: `const instance = new MyNamespace.MyClass();`
    - **Kdy (a jestli vůbec) je použít dnes?**
      - **Obecně se jim vyhýbej a preferuj ES6 moduly.** Moduly jsou standardem, lépe se integrují s ekosystémem JavaScriptu a nástroji.
      - Možná **ojedinělá** využití:
        - Práce se starším kódem, který je takto strukturován.
        - Někdy se používají v deklaračních souborech (`.d.ts`) pro globální knihovny, které nemají moduly.
        - Velmi specifické případy pro logické seskupení _velmi úzce_ souvisejících typů nebo konstant uvnitř jednoho souboru (i když i zde lze často použít jiné vzory).
    - **Pro náš framework budeme používat výhradně ES6 moduly.** Je důležité o `namespace` vědět, ale nebudeme je aktivně používat pro strukturování našeho kódu.

**Praxe Dne:**

Je čas vzít kód, který jsme napsali v předchozích dnech, a rozdělit ho do logických souborů (modulů).

1.  **Vytvoř Strukturu Složek:**

    - V kořeni projektu vytvoř složku `src` (pokud ji ještě nemáš).
    - Uvnitř `src` vytvoř následující složky:
      - `pages`: Pro Page Object třídy.
      - `interfaces`: Pro soubory s rozhraními.
      - _(Možná později přidáme `utils`, `tests`, `config` atd.)_

2.  **Přesuň Soubory a Uprav Kód:**

    - **Rozhraní:**
      - Vytvoř soubor `src/interfaces/data.interfaces.ts`.
      - Přesuň do něj definice `UserCredentials` a `TestData`.
      - Přidej `export` před každé rozhraní: `export interface UserCredentials { ... }`, `export interface TestData { ... }`.
      - Vytvoř soubor `src/interfaces/page.interfaces.ts`.
      - Přesuň do něj definici `ILoginPageActions` (pokud jsi ji měl/a zvlášť) a označ ji jako `export`.
    - **BasePage:**
      - Vytvoř soubor `src/pages/base.page.ts`.
      - Přesuň do něj definici `abstract class BasePage`.
      - Označ třídu jako `export`: `export abstract class BasePage { ... }`.
      - Přidej potřebné `import` na začátek souboru. Minimálně budeš potřebovat `import type { Page } from '@playwright/test';` (pokud používáš typ `Page`).
    - **LoginPage:**
      - Vytvoř soubor `src/pages/login.page.ts`.
      - Přesuň do něj definici `class LoginPage`.
      - Označ třídu jako `export`: `export class LoginPage ...`.
      - Přidej `import`:
        - `import { BasePage } from './base.page';` (importuješ BasePage ze stejné složky).
        - `import type { Page } from '@playwright/test';` (pokud používáš typ `Page`).
        - `import type { ILoginPageActions } from '../interfaces/page.interfaces';` (pokud `LoginPage` implementuje toto rozhraní; všimni si `../` pro cestu o úroveň výš).
        - `import type { UserCredentials } from '../interfaces/data.interfaces';` (pokud metoda `login` přijímá tento typ).
    - **HomePage:**
      - Vytvoř soubor `src/pages/home.page.ts`.
      - Přesuň do něj definici `class HomePage`.
      - Označ třídu jako `export`: `export class HomePage ...`.
      - Přidej potřebné `import` podobně jako u `LoginPage` (`BasePage`, `Page`).
    - **(Hlavní Soubor / Test):**

      - Vytvoř (nebo uprav) hlavní soubor, kde bys používal/a tyto třídy (např. `src/main.ts` nebo pokud už máš nastavený Playwright, tak testovací soubor jako `src/tests/example.test.ts`).
      - Importuj potřebné třídy a rozhraní:

      ```typescript
      // Příklad v src/main.ts
      import { LoginPage } from "./pages/login.page";
      import { HomePage } from "./pages/home.page";
      import type { UserCredentials } from "./interfaces/data.interfaces";
      // import type { Page } from '@playwright/test'; // Pokud bys zde pracoval s Page

      async function main() {
        console.log("Spouštím hlavní funkci...");

        // Tady by normálně byla instance Playwright 'page'
        const mockPage: any = {
          // Jednoduchý mock pro demonstraci
          goto: async (url: string) => console.log(`Mock GOTO: ${url}`),
          title: async () => "Mock Title",
          locator: (selector: string) => ({
            waitFor: async (options: any) =>
              console.log(`Mock WAITFOR: ${selector}`, options),
            fill: async (value: string) =>
              console.log(`Mock FILL: ${selector} with ${value}`),
            click: async () => console.log(`Mock CLICK: ${selector}`),
          }),
        };

        const loginPage = new LoginPage(mockPage);
        const homePage = new HomePage(mockPage); // Jen pro ukázku

        const credentials: UserCredentials = {
          username: "test",
          password: "pw",
        };

        try {
          await loginPage.navigate("/login"); // Používáme metody z BasePage
          await loginPage.waitForPageToLoad(); // Implementováno v LoginPage
          await loginPage.login(credentials.username, credentials.password); // Metoda z LoginPage

          // Příklad volání metody z HomePage
          // await homePage.waitForPageToLoad();
          // const greeting = await homePage.getUserGreeting();
          // console.log("Greeting:", greeting);

          console.log("Hlavní funkce dokončena.");
        } catch (error) {
          console.error("Chyba v main:", error);
        }
      }

      main();
      ```

3.  **Zkompiluj a Spusť:**
    - Ujisti se, že máš `tsconfig.json` nastavený správně (hlavně `module` by měl být nastaven na něco jako `"CommonJS"` pro Node.js nebo `"ESNext"`/`"ES2020"`/`"ES2022"` pokud cílíš na moderní prostředí, a `outDir` pro výstupní složku, např. `"./dist"`).
    - Spusť kompilaci `tsc`.
    - Spusť výsledný JavaScript kód (např. `node dist/main.js`). Ověř, že vše funguje a importy/exporty jsou správně propojené.

**Cíl Dne:**

- **Pochopit** výhody modularity kódu.
- **Umět používat** `export` (named a default) a `import` (named, default, namespace) pro sdílení kódu mezi soubory (moduly).
- **Vědět**, proč jsou ES6 moduly preferované před `namespace`.
- **Prakticky strukturovat** dosavadní kód frameworku (stránky, rozhraní) do logických souborů a složek pomocí modulů.

Rozdělení kódu do modulů je základem pro udržovatelný a škálovatelný projekt. Jakmile si na `import` a `export` zvykneš, stane se to tvou druhou přirozeností.

Dej vědět, až budeš mít kód reorganizovaný, nebo pokud narazíš na nějaké problémy s cestami nebo syntaxí importů/exportů! Zítra se podíváme na Generika.
