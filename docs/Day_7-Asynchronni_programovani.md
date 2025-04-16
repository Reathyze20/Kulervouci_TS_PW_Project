Výborně! Máme za sebou základy OOP včetně dědičnosti a abstraktních tříd. Dnes se vrhneme na naprosto klíčový koncept pro práci s moderním JavaScriptem/TypeScriptem, a obzvláště pro UI test automation: **Asynchronní Programování**.

**Den 7: Asynchronní Programování - Promises a Async/Await**

**Proč je Asynchronní Programování v Testování Klíčové?**

Představ si, co se děje, když tvůj testovací skript interaguje s webovou stránkou:

1.  Klikneš na tlačítko "Přihlásit se".
2.  Prohlížeč odešle požadavek na server.
3.  Server zpracuje přihlašovací údaje.
4.  Server odešle odpověď zpět prohlížeči.
5.  Prohlížeč zpracuje odpověď a překreslí stránku (nebo její část).
6.  *Teprve teď* se na stránce objeví uvítací zpráva, kterou chceš ověřit.

Všechny tyto kroky (síťová komunikace, zpracování na serveru, vykreslování v prohlížeči) **trvají nějaký čas**. Nejsou okamžité. Pokud by tvůj skript byl čistě synchronní (čekal by na dokončení každého řádku, než přejde na další), musel by na tyto operace nějak explicitně čekat (např. pomocí `sleep`, což je velmi špatná praxe).

Navíc, samotný JavaScript v prohlížeči (a v Node.js) je fundamentally **single-threaded** (má jedno hlavní vlákno pro vykonávání kódu) a používá **event loop** pro zpracování asynchronních operací (jako jsou síťové požadavky, časovače, interakce uživatele). Aby hlavní vlákno nezamrzlo čekáním na pomalé operace, tyto operace se spustí na pozadí a JavaScript dostane upozornění (event), až když jsou hotové.

Asynchronní programování nám umožňuje psát kód, který **spustí operaci, která nějakou dobu trvá, a místo čekání pokračuje dál**. Později, až je operace dokončena, můžeme zpracovat její výsledek (nebo chybu).

**Teorie Dne:**

1.  **Callbacky (Krátce, pro Historii):**
    *   Původní způsob, jak řešit asynchronicitu. Funkci předáš jinou funkci (callback), která se má zavolat, až bude původní operace hotová.
    *   Problém: "Callback Hell" nebo "Pyramid of Doom" – mnoho vnořených callbacků dělá kód velmi nepřehledným a špatně spravovatelným.
    ```javascript
    // Příklad callback hell (nebudeme se tím moc zabývat)
    doSomethingAsync(options, function(result1) {
      doAnotherAsync(result1, function(result2) {
        doThirdAsync(result2, function(result3) {
          // ... a tak dále
        }, function(error3) { /* handle error */ });
      }, function(error2) { /* handle error */ });
    }, function(error1) { /* handle error */ });
    ```

2.  **Promises (Sliby):**
    *   Modernější a lepší způsob reprezentace operace, která ještě neskončila, ale slibuje, že v budoucnu dodá výsledek (nebo chybu).
    *   Promise může být v jednom ze tří stavů:
        *   `pending`: Počáteční stav, operace ještě neskončila.
        *   `fulfilled` (nebo `resolved`): Operace úspěšně skončila, Promise má hodnotu.
        *   `rejected`: Operace selhala, Promise má důvod (chybu).
    *   **Použití:**
        *   `.then(onFulfilled, onRejected)`: Metoda pro připojení callbacků. První funkce (`onFulfilled`) se zavolá, když Promise přejde do stavu `fulfilled`. Druhá (volitelná) funkce (`onRejected`) se zavolá, když přejde do stavu `rejected`.
        *   `.catch(onRejected)`: Syntaktický cukr pro `.then(undefined, onRejected)`. Slouží specificky pro zachytávání chyb (rejected Promises).
        *   **Chaining (Řetězení):** Metody `.then()` a `.catch()` *samy vracejí novou Promise*, což umožňuje řetězení operací.

    ```typescript
    // Simulace asynchronní operace, která vrátí Promise
    function fetchData(url: string): Promise<string> {
      console.log(`[fetchData] Začínám stahovat z ${url}...`);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (url === "success") {
            console.log("[fetchData] Data úspěšně stažena.");
            resolve("Toto jsou data!"); // Splnění Promise s hodnotou
          } else {
            console.error("[fetchData] Chyba při stahování.");
            reject(new Error("Nepodařilo se stáhnout data")); // Odmítnutí Promise s chybou
          }
        }, 1500); // Simulace 1.5 sekundové operace
      });
    }

    console.log("Před voláním fetchData...");

    fetchData("success")
      .then((data) => { // Zpracování úspěšného výsledku
        console.log("Úspěch (.then):", data);
        // Můžeme vrátit hodnotu nebo další Promise pro další řetězení
        return data.toUpperCase();
      })
      .then((upperData) => {
        console.log("Zpracovaná data:", upperData);
      })
      .catch((error) => { // Zpracování chyby kdekoli v řetězci
        console.error("Chyba (.catch):", error.message);
      })
      .finally(() => { // Zavolá se vždy (ať už úspěch nebo chyba)
        console.log("Operace fetchData 'success' dokončena (finally).");
      });


    fetchData("failure")
      .then(data => {
        console.log("Tohle se nezavolá u 'failure'. Úspěch:", data);
      })
      .catch(error => {
        console.error("Chyba (.catch) u 'failure':", error.message);
      })
      .finally(() => {
        console.log("Operace fetchData 'failure' dokončena (finally).");
      });

    console.log("Po volání fetchData (tento log se vypíše dříve, než se data stáhnou!)...");
    ```

    *   `Promise.all(promisesArray)`: Vezme pole Promises a vrátí novou Promise, která se splní, až když se splní *všechny* Promises v poli. Výsledkem je pole výsledků jednotlivých Promises. Pokud jakákoli Promise v poli selže, `Promise.all` okamžitě selže.

3.  **Async/Await (Syntaktický Cukr):**
    *   Nejmodernější a **nejčitelnější způsob práce s Promises**. Umožňuje psát asynchronní kód, který vypadá téměř jako synchronní.
    *   Je postaven na Promises, jen mění syntaxi.
    *   **`async` Klíčové slovo:** Píše se před definici funkce (`async function myFunction() { ... }` nebo `const myArrowFunc = async () => { ... }` nebo `class MyClass { async myMethod() { ... } }`).
        *   Označuje, že funkce bude pracovat asynchronně.
        *   **Vždy vrací Promise.** I když explicitně vrátíš hodnotu (např. `return 5;`), `async` funkce ji automaticky "zabalí" do Promise (`Promise.resolve(5)`).
        *   Uvnitř `async` funkce můžeme používat klíčové slovo `await`.
    *   **`await` Klíčové slovo:** Může být použito **pouze uvnitř `async` funkce**.
        *   Píše se před výraz, který vrací Promise (např. `await fetchData("success");`).
        *   **Pozastaví vykonávání `async` funkce**, dokud se Promise za `await` nevyřeší (nesplní nebo neodmítne).
        *   Pokud se Promise **splní**, `await` vrátí splněnou hodnotu.
        *   Pokud se Promise **odmítne**, `await` vyvolá chybu (kterou můžeme zachytit pomocí `try...catch`).

    ```typescript
    async function processData() {
      console.log("[processData] Začínám zpracování...");
      try {
        // await pozastaví funkci, dokud fetchData neskončí
        const data = await fetchData("success"); // await "rozbalí" hodnotu z Promise
        console.log("[processData] Data přijata:", data);

        const upperData = data.toUpperCase();
        console.log("[processData] Data zpracována:", upperData);

        // Můžeme awaitovat i více Promises za sebou
        // const anotherData = await fetchData("another/url");
        // console.log("[processData] Další data:", anotherData);

        return upperData; // Async funkce vrátí Promise.resolve(upperData)

      } catch (error) {
        console.error("[processData] Došlo k chybě:", error.message);
        // Můžeme chybu dále zpracovat nebo ji znovu vyhodit
        throw new Error("Zpracování selhalo"); // Async funkce vrátí Promise.reject(...)
      } finally {
          console.log("[processData] Zpracování dokončeno (finally).")
      }
    }

    async function run() {
        console.log("Spouštím run...");
        const result = await processData(); // Čekáme na dokončení processData
        console.log("Výsledek z processData:", result);

        console.log("\nZkouším chybový scénář:");
        try {
            await fetchData("failure");
        } catch (err) {
            console.error("Chyba zachycena v run():", err.message);
        }
        console.log("run() dokončen.");
    }

    run(); // Spustíme celou sekvenci
    ```

    *   **Error Handling:** Používáme standardní `try...catch...finally` bloky, což je mnohem přirozenější než `.catch()` u Promises.

**Relevance pro Playwright:**

**Téměř všechny metody Playwright, které interagují se stránkou (`page.goto()`, `page.click()`, `element.fill()`, `page.waitForSelector()`, `expect(locator).toBeVisible()`, atd.), jsou ASYNCHRONNÍ a VRACEJÍ PROMISE!**

Proto budeme v našich testech a Page Objectech **vždy** používat `async/await`.

```typescript
import { Page, expect } from '@playwright/test'; // Typy z Playwright

abstract class BasePage {
    protected readonly page: Page;
    constructor(page: Page) { this.page = page; }

    // Metody jsou nyní async a vrací Promise
    async navigate(url: string): Promise<void> {
        console.log(`[BasePage] Naviguji na ${url}`);
        await this.page.goto(url); // Čekáme, až se navigace dokončí
    }

    async getTitle(): Promise<string> {
        console.log("[BasePage] Získávám titulek stránky");
        const title = await this.page.title(); // Čekáme na získání titulku
        return title;
    }

    abstract waitForPageToLoad(): Promise<void>;
}

class ConcreteLoginPage extends BasePage {
    constructor(page: Page) { super(page); }

    async waitForPageToLoad(): Promise<void> {
        console.log("[ConcreteLoginPage] Čekám na načtení přihlašovací stránky...");
        // Použití await s Playwright lokátorem a čekáním
        await this.page.locator("#username").waitFor({ state: 'visible', timeout: 5000 });
        console.log("[ConcreteLoginPage] Přihlašovací stránka načtena.");
    }

    async login(username: string, password: string): Promise<void> {
        console.log(`[ConcreteLoginPage] Provádím přihlášení uživatele ${username}`);
        await this.page.locator("#username").fill(username); // Čekáme na vyplnění
        await this.page.locator("#password").fill(password); // Čekáme na vyplnění
        await this.page.locator("button[type='submit']").click(); // Čekáme na kliknutí
    }
}

// Příklad použití v testu (zjednodušeno)
async function runLoginTest(page: Page) {
    const loginPage = new ConcreteLoginPage(page);

    try {
        await loginPage.navigate("/login");
        await loginPage.waitForPageToLoad();
        await loginPage.login("testuser", "password123");
        // Zde by přišly další kroky a ověření (např. čekání na HomePage)
        console.log("Přihlášení pravděpodobně úspěšné (v reálu bychom ověřili stav).");
    } catch (error) {
        console.error("Test přihlášení selhal:", error);
    }
}

// Pro spuštění tohoto příkladu by bylo potřeba skutečné Playwright prostředí.
// Např. v testovacím souboru Playwright:
// test('Login Test Example', async ({ page }) => {
//    await runLoginTest(page);
//    // Přidej expect() pro ověření stavu po přihlášení
//    await expect(page.locator('.welcome-message')).toBeVisible();
// });
```

**Praxe Dne:**

1.  **Refaktoruj Včerejší Kód:**
    *   Projdi třídy `BasePage`, `LoginPage`, `HomePage`, které jsi vytvořil včera.
    *   Označ všechny metody, které by v reálu interagovaly s prohlížečem (jako `navigate`, `getTitle`, `waitForPageToLoad`, `login`, `getUserGreeting`) jako `async`.
    *   Uprav jejich návratový typ na `Promise<void>` nebo `Promise<string>` (nebo jiný relevantní typ, pokud by něco vracely).
    *   Do těl metod přidej `console.log` indikující začátek a konec operace a mezi ně vlož `await new Promise(resolve => setTimeout(resolve, 50));` pro simulaci krátkého čekání (nepotřebuješ reálný Playwright kód, jen simuluj asynchronicitu).

2.  **Napiš Jednoduchou Async Funkci:**
    *   Napiš `async` funkci `performLoginFlow`, která:
        *   Vytvoří instanci `LoginPage` (můžeš jí předat `null` nebo `{}` jako mock `page`, pokud nemáš reálnou).
        *   Zavolá (pomocí `await`) `loginPage.navigate(...)`.
        *   Zavolá (pomocí `await`) `loginPage.waitForPageToLoad()`.
        *   Zavolá (pomocí `await`) `loginPage.login(...)`.
        *   Přidej `try...catch` blok kolem těchto volání pro zachycení potenciálních chyb.
        *   Vypiš do konzole zprávy o průběhu.

3.  **(Bonus):** Zkus použít `Promise.all` k simulaci spuštění dvou nezávislých asynchronních úkolů současně (např. dvě fiktivní `fetchData` volání) a počkej na dokončení obou.

**Cíl Dne:**

*   **Pochopit**, proč je asynchronní programování nezbytné pro UI test automation.
*   **Rozumět** konceptu Promises (`.then`, `.catch`).
*   **Jistě používat** syntaxi `async/await` pro psaní čitelného asynchronního kódu.
*   **Vědět**, jak používat `try...catch` pro ošetření chyb v `async` funkcích.
*   **Aplikovat** `async/await` na metody v Page Objectech, protože Playwright API je asynchronní.

`async/await` se stane tvým každodenním nástrojem při práci s Playwright. Je to elegantní způsob, jak zkrotit asynchronní povahu webových interakcí.

Dej vědět, jak ti cvičení půjdou a jestli je koncept Promises a async/await jasný! Zítra se podíváme na moduly a jmenné prostory – jak náš kód lépe organizovat.