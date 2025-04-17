Výborně, máme za sebou SRP a OCP! Dnes dokončíme naši prohlídku SOLID principů a podíváme se na zbývající tři: Liskov Substitution Principle (LSP), Interface Segregation Principle (ISP) a Dependency Inversion Principle (DIP). Tyto principy jsou možná trochu abstraktnější, ale stále velmi relevantní pro návrh robustních a flexibilních systémů, včetně našich testovacích frameworků.

**Den 12: SOLID Principy - LSP, ISP, DIP**

**Teorie Dne:**

1.  **L - Liskov Substitution Principle (LSP) - Princip nahraditelnosti podle Liskové**

    - **Definice:** Objekty odvozených tříd (potomci) musí být **nahraditelné** za objekty rodičovské třídy, aniž by to ovlivnilo správnost programu. Jinými slovy, pokud program očekává objekt typu `BasePage`, měl by bez problémů fungovat, i když mu podstrčíme instanci `LoginPage` nebo `HomePage`. Potomek by neměl "rozbít" očekávané chování rodiče.
    - **Proč je to důležité?** Pokud LSP není dodržen, dědičnost ztrácí smysl a polymorfismus se stává nespolehlivým. Kód, který používá odkazy na rodičovskou třídu, by musel neustále kontrolovat, jakého konkrétního typu potomka vlastně má, aby se vyhnul neočekávanému chování.
    - **Jak se může porušit?**
      - Potomek přepisuje metodu rodiče tak, že dělá něco úplně jiného nebo neočekávaného (např. metoda `save()` v rodiči ukládá data, v potomkovi je maže).
      - Potomek v přepsané metodě vyhazuje výjimky, které rodičovská metoda nevyhazovala (a které kód používající rodiče neočekává).
      - Potomek zpřísňuje vstupní podmínky (preconditions) pro metodu (např. metoda rodiče přijímá `number`, potomek vyžaduje pouze kladná čísla).
      - Potomek oslabuje výstupní podmínky (postconditions) metody (např. metoda rodiče garantuje, že po volání bude určitý stav, potomek tuto garanci poruší).
    - **V kontextu Test Automation Frameworku:**
      - Naše struktura `BasePage` -> `LoginPage` / `HomePage` by měla LSP dodržovat. Pokud máme funkci, která přijímá `BasePage` a volá `await page.getTitle()`, mělo by to fungovat stejně (vrátit titulek) bez ohledu na to, jestli je to instance `BasePage`, `LoginPage` nebo `HomePage`.
      - **Příklad potenciálního porušení:** Kdybychom v `BasePage` měli metodu `async performCommonAction(): Promise<void>` a v `LoginPage` bychom ji přepsali tak, že by za určitých okolností vyhodila specifickou výjimku `LoginSpecificException`, kterou kód pracující s `BasePage` neočekává. Nebo kdyby `performCommonAction` v `BasePage` něco nastavila a v `LoginPage` by to místo toho smazala.
    - **Jak aplikovat:** Při přepisování metod v potomcích se ujistěte, že dodržujete "kontrakt" definovaný rodičovskou třídou. Neměňte zásadně význam metody, neočekávaně neměňte její vedlejší efekty a buďte opatrní s výjimkami.

2.  **I - Interface Segregation Principle (ISP) - Princip segregace (oddělení) rozhraní**

    - **Definice:** Klienti (třídy, které používají rozhraní) by **neměli být nuceni záviset na metodách (v rozhraní), které nepoužívají**. Je lepší mít více malých, specifických rozhraní než jedno velké, obecné ("tlusté") rozhraní.
    - **Proč je to důležité?** Velká rozhraní vedou k tomu, že třídy musí implementovat metody, které pro ně nemají smysl (např. vyhodí výjimku "Not Implemented" nebo mají prázdné tělo). To vede k matoucímu a méně robustnímu kódu. Změna v jedné části tlustého rozhraní může vynutit změny ve všech třídách, které ho implementují, i když danou část vůbec nepoužívají.
    - **Analogie:** Nechcete mít jedno univerzální dálkové ovládání pro televizi, klimatizaci, garážová vrata a mixér. Bylo by obrovské, plné tlačítek, která pro většinu operací nepotřebujete, a pokud by se změnilo ovládání mixéru, museli byste měnit celé univerzální ovládání. Lepší je mít samostatné, malé ovladače pro každé zařízení.
    - **V kontextu Test Automation Frameworku:**
      - **Příklad porušení ISP:** Představte si jedno obrovské rozhraní `IWebDriver` definující _všechny_ možné akce: `click()`, `fill()`, `getText()`, `takeScreenshot()`, `executeScript()`, `switchToFrame()`, `manageCookies()`, `setGeolocation()`, `performTouchAction()`. Pokud byste chtěli implementovat jednoduchý "Read-Only WebDriver", který umí jen číst text a titulek, stále byste museli implementovat (nebo alespoň deklarovat) _všechny_ ostatní metody, i když je nikdy nepoužijete.
      - **Příklad dodržení ISP:** Místo jednoho `IWebDriver` bychom měli menší, zaměřená rozhraní: `IClickable`, `ITextInput`, `ITakesScreenshot`, `ICookieManager`, `INavigation`. Třída implementující konkrétní WebDriver by pak implementovala pouze ta rozhraní, jejichž funkcionalitu skutečně poskytuje. Náš "Read-Only WebDriver" by implementoval třeba jen `ITextReadable` a `INavigation`.
      - V našem POM: Místo jednoho obřího rozhraní `IPageActions` pro všechny možné akce na všech stránkách je lepší mít buď metody přímo v konkrétních Page Objectech (což přirozeně segreguje), nebo pokud potřebujeme sdílet určitou _sadu_ akcí mezi různými typy stránek/komponent, můžeme definovat menší rozhraní (např. `ISearchable { search(term: string): Promise<void>; }`, `ILoggableOut { logout(): Promise<LoginPage>; }`).
    - **Jak aplikovat:** Když definujete rozhraní, zamyslete se, zda všechny metody logicky patří k sobě a zda všichni klienti, kteří budou rozhraní implementovat (nebo používat), budou skutečně potřebovat _všechny_ jeho metody. Pokud ne, zvažte rozdělení na menší rozhraní.

3.  **D - Dependency Inversion Principle (DIP) - Princip inverze závislostí**

    - **Definice:**
      1.  Moduly vyšší úrovně (např. logika testu) by **neměly záviset na modulech nižší úrovně** (např. konkrétní implementace `PlaywrightWebDriver` nebo `ConsoleLogger`). Oba by měly **záviset na abstrakcích** (např. rozhraní `IWebDriver`, `ILogger`).
      2.  Abstrakce by **neměly záviset na detailech**. Detaily (konkrétní implementace) by měly **záviset na abstrakcích**.
    - **Proč je to důležité?** Tento princip podporuje **volné provázání (loose coupling)** mezi komponentami systému. Když jsou komponenty volně provázané, můžeme snadno vyměnit jednu implementaci za jinou (např. vyměnit logování do konzole za logování do souboru nebo databáze), aniž bychom museli měnit kód, který danou funkcionalitu používá (např. naše Page Objecty nebo testy). To výrazně zvyšuje flexibilitu a testovatelnost systému.
    - **Analogie:** Zase ta zásuvka. Váš notebook (modul vyšší úrovně) nezávisí na konkrétní elektrárně (modul nižší úrovně), která vyrábí elektřinu. Oba závisí na standardizovaném rozhraní – elektrické zásuvce a zástrčce (abstrakce). Můžete vyměnit dodavatele elektřiny (implementaci) bez nutnosti upravovat notebook. Detail (elektrárna) závisí na abstrakci (musí dodávat proud podle standardu definovaného zásuvkou).
    - **V kontextu Test Automation Frameworku:**

      - **Příklad bez DIP:** Váš `BasePage` by přímo vytvářel instanci konkrétního reportéru: `this.reporter = new HtmlReporter();`. Tím `BasePage` (vyšší úroveň) přímo závisí na `HtmlReporter` (nižší úroveň). Pokud chcete změnit reportér na `JsonReporter`, musíte změnit kód `BasePage`.
      - **Příklad s DIP:**

        1.  Definujeme rozhraní `IReporter { log(message: string): void; save(): Promise<void>; }` (abstrakce).
        2.  Vytvoříme konkrétní implementace: `class HtmlReporter implements IReporter { ... }`, `class JsonReporter implements IReporter { ... }`. (Detaily závisí na abstrakci).
        3.  Náš `BasePage` (nebo spíše nějaký centrální konfigurační/inicializační mechanismus) bude **přijímat instanci `IReporter` zvenčí** (např. v konstruktoru nebo přes setter metodu – tomuto se říká **Dependency Injection**).

        ```typescript
        // V BasePage nebo TestSetup
        private reporter: IReporter;

        constructor(page: Page, reporter: IReporter) { // Přijímáme závislost
            // ...
            this.reporter = reporter;
        }

        async someAction() {
            // ...
            this.reporter.log("Akce provedena."); // Používáme abstrakci
        }
        ```

        Nyní `BasePage` závisí pouze na abstrakci `IReporter`. Kde se rozhodne, která konkrétní implementace (`HtmlReporter`, `JsonReporter`) se použije? Někde "výše" – v místě, kde se framework inicializuje, často na základě konfigurace. Můžeme snadno podstrčit jiný reportér bez změny `BasePage`.

      - Podobně bychom mohli abstrahovat konfiguraci (`IConfigReader`), datové zdroje (`ITestDataProvider`), API klienty (`IApiClient`) atd.

    - **Jak aplikovat:** Definujte rozhraní (abstrakce) pro klíčové závislosti vašeho systému (logování, reporting, konfigurace, přístup k datům, WebDriver/Browser instance). Místo aby si třídy samy vytvářely instance těchto závislostí, nechte si je "vstříknout" zvenčí (nejčastěji přes konstruktor). Tomuto vzoru se říká **Dependency Injection (DI)** a je to hlavní způsob, jak dosáhnout DIP.

**Praxe Dne:**

Dnes se zaměříme spíše na diskusi a identifikaci příležitostí, protože plná implementace DIP často vyžaduje DI kontejnery nebo složitější setup, což je nad rámec základů.

1.  **Diskuse LSP:** Projděte znovu přepsané metody v `LoginPage` a `HomePage` (např. `waitForPageToLoad`). Dodržují kontrakt `BasePage`? Mění zásadně jejich chování?
2.  **Diskuse ISP:** Podívejte se na rozhraní, která jste vytvořili (např. `ILoginPageActions`, pokud ho máte). Je dostatečně specifické? Nebo obsahuje metody, které by ne všechny implementující třídy potřebovaly? (V našem jednoduchém případě je to pravděpodobně v pořádku, ale představte si rozsáhlejší aplikaci).
3.  **Identifikace Závislostí (pro DIP):**
    - Jaké externí služby nebo komponenty vaše Page Objecty (nebo `BasePage`) momentálně používají nebo by mohly v budoucnu používat?
      - `Page` instance z Playwright (tu už si necháváme injectovat – to je vlastně DIP!)
      - Logování? (Zatím používáme `console.log`)
      - Čtení konfigurace? (Např. base URL, timeouty)
      - Generování testovacích dat?
      - Reporting?
    - Pro každou identifikovanou závislost: Jak by vypadalo rozhraní (abstrakce)? Jak by mohly vypadat různé implementace? Jak byste tuto závislost "vstříkli" do třídy, která ji potřebuje (nejčastěji přidáním parametru do konstruktoru)?

**Cíl Dne:**

- **Mít povědomí** o principech Liskov Substitution Principle (LSP), Interface Segregation Principle (ISP) a Dependency Inversion Principle (DIP).
- **Rozumět**, jak tyto principy přispívají k flexibilitě a robustnosti kódu.
- **Dokázat identifikovat** potenciální porušení LSP a ISP.
- **Pochopit** základní myšlenku DIP a Dependency Injection – závislost na abstrakcích místo konkrétních implementací.
- **Vidět relevanci** těchto principů pro návrh pokročilejších částí testovacího frameworku (konfigurace, reporting, logování, data).

SOLID principy jsou komplexní téma a jejich plné pochopení a aplikace vyžaduje praxi. Důležité je mít o nich povědomí a snažit se je brát v úvahu při návrhu kódu. Zítra se podíváme na další konkrétní návrhové vzory (Factory, Builder), které nám pomohou řešit běžné problémy při tvorbě frameworku a často nám pomohou i dodržet SOLID principy (zejména OCP a DIP).
