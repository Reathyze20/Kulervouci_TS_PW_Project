**2. Strategy (Behaviorální vzor)**

- **Účel (Intent):** Definuje rodinu algoritmů, zapouzdřuje každý z nich a činí je vzájemně zaměnitelnými. Umožňuje měnit algoritmus nezávisle na klientech, kteří ho používají.
- **Problém, který řeší:**
  - Máš třídu, která může provádět nějakou činnost (algoritmus) několika různými způsoby.
  - Chceš se vyhnout velkým podmínkovým blokům (`if/else` nebo `switch`), které vybírají, jaký způsob použít.
  - Potřebuješ mít možnost snadno přidávat nové způsoby (algoritmy) bez úpravy třídy, která je používá.
  - Chceš mít možnost měnit použitý algoritmus za běhu programu.
  - Klasický příklad: Různé způsoby výpočtu trasy v navigaci (nejkratší, nejrychlejší, pěší, MHD, na kole), různé kompresní algoritmy, různé způsoby řazení dat.
- **Struktura (zjednodušeně):**
  - `Context` (Kontext): Třída, která potřebuje provádět nějaký algoritmus. Udržuje si referenci na objekt `Strategy`. _Nezná_ konkrétní implementaci algoritmu, pouze volá metodu definovanou v rozhraní `Strategy`. Obvykle má metodu pro nastavení (změnu) aktuální strategie.
  - `Strategy` (Strategie): Společné rozhraní pro všechny konkrétní algoritmy (strategie). Definuje jednu nebo více metod, které `Context` volá.
  - `ConcreteStrategy` (Konkrétní Strategie): Třídy implementující rozhraní `Strategy`. Každá představuje jeden konkrétní algoritmus.
- **Generický Příklad (TypeScript):**

  ```typescript
  // Strategy interface
  interface SortStrategy {
    sort(data: number[]): number[];
  }

  // Concrete Strategies
  class BubbleSortStrategy implements SortStrategy {
    sort(data: number[]): number[] {
      console.log("Sorting using Bubble Sort");
      // ... actual bubble sort logic ...
      return data.sort((a, b) => a - b); // Simplified for example
    }
  }
  class QuickSortStrategy implements SortStrategy {
    sort(data: number[]): number[] {
      console.log("Sorting using Quick Sort");
      // ... actual quick sort logic ...
      return data.sort((a, b) => a - b); // Simplified for example
    }
  }

  // Context
  class DataSorter {
    private strategy: SortStrategy;
    private dataSet: number[];

    constructor(strategy: SortStrategy, data: number[]) {
      this.strategy = strategy;
      this.dataSet = data;
    }

    // Allow changing the strategy at runtime
    setStrategy(strategy: SortStrategy): void {
      this.strategy = strategy;
    }

    sortData(): number[] {
      console.log("Context: Sorting data using set strategy.");
      return this.strategy.sort([...this.dataSet]); // Pass copy to avoid side effects
    }
  }

  // Client code
  const numbers = [5, 1, 4, 2, 8];

  const sorter1 = new DataSorter(new BubbleSortStrategy(), numbers);
  console.log("Client: Strategy is set to Bubble Sort.");
  sorter1.sortData();

  console.log("\nClient: Strategy is set to Quick Sort.");
  sorter1.setStrategy(new QuickSortStrategy());
  sorter1.sortData();
  ```

- **Relevance pro Playwright/TS testování:**
  - **Různé způsoby přihlášení:** Máš přihlášení přes UI formulář, přes API token, pomocí přednastavených cookies? Můžeš mít `LoginStrategy` rozhraní a konkrétní strategie `UiLoginStrategy`, `ApiLoginStrategy`, `CookieLoginStrategy`. Tvůj test nebo setup metoda pak použije tu správnou strategii podle potřeby.
    ```typescript
    interface LoginStrategy {
      login(user: UserCredentials): Promise<void>;
    }
    // Test setup:
    const loginStrategy = getLoginStrategy(config.loginType); // e.g., 'api' or 'ui'
    await loginStrategy.login(standardUser);
    ```
  - **Různé metody pro čekání na prvky:** Někdy potřebuješ čekat na viditelnost, jindy na 'attached' stav, jindy na specifický text nebo atribut. Můžeš mít `WaitStrategy` a konkrétní implementace.
  - **Různé validační mechanismy:** Potřebuješ validovat data z UI oproti databázi, API odpovědi nebo souboru? Můžeš mít `ValidationStrategy`.
  - **Generování různých typů reportů:** Po skončení testů můžeš chtít generovat HTML report, poslat notifikaci na Slack nebo jen vypsat do konzole. `ReportingStrategy` může zapouzdřit tyto různé způsoby.
  - **Interakce s různými typy elementů:** Pokud máš komplexní komponenty (např. různé typy grafů, tabulek), které vyžadují specifické interakce, ale sdílejí obecný cíl (např. "získat hodnotu"), Strategy může pomoci.
- **Výhody/Nevýhody v Testování:**
  - **Výhody:**
    - **Flexibilita:** Snadné přidávání nových algoritmů (způsobů) bez změny kontextu (testu, Page Objectu).
    - **Open/Closed Principle:** Kontext je uzavřený pro modifikaci, ale otevřený pro rozšíření (přidáním nových strategií).
    - **Čistší kód kontextu:** Odstraňuje `if/else` nebo `switch` pro výběr algoritmu z hlavní třídy.
    - **Zaměnitelnost:** Algoritmy (strategie) lze snadno měnit, i za běhu, což je skvělé pro testování různých scénářů (např. přihlásit se různými způsoby ve stejném testu).
  - **Nevýhody:**
    - **Více tříd:** Zvyšuje počet tříd/souborů v projektu.
    - **Klient musí znát strategie:** Kód, který nastavuje strategii (často klient nebo konfigurační část), musí vědět o existenci různých konkrétních strategií, aby mohl vybrat tu správnou. Kontext sám je od nich izolován.
    - Komunikace mezi strategií a kontextem může být někdy složitější, pokud strategie potřebuje hodně dat z kontextu.

**Srovnání se State (který probereme později):** Strategy a State si jsou strukturálně velmi podobné. Hlavní rozdíl je v _záměru_. Strategy obvykle zapouzdřuje různé způsoby, _jak_ něco udělat, a tyto způsoby jsou často na sobě nezávislé. State zapouzdřuje _chování_ spojené s různými _stavy_ objektu a jednotlivé stavy často vědí o ostatních stavech a řídí přechody mezi nimi.

**Jak ti sedí vzor Strategy? Vidíš jeho uplatnění například v těch různých přihlašovacích metodách nebo způsobech validace v testech?**

Až budeš chtít, mrkneme na Decorator.
