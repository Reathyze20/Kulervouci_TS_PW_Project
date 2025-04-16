Super! Jdeme na **Den 4: Úvod do OOP - Třídy a Základní Zapouzdření**.

**Teorie:**

1.  **Co je Třída (Class)?**

    - Představ si třídu jako **šablonu** nebo **výrobní plán** pro objekty. Definuje, jaké _vlastnosti_ (data, např. barva auta, jméno uživatele) a _metody_ (chování, schopnosti, např. auto může jet, uživatel se může přihlásit) budou mít objekty vytvořené podle této šablony.
    - Třída sama o sobě nic nedělá, je to jen popis.

2.  **Co je Objekt (Instance)?**

    - Objekt je **konkrétní výtvor** vytvořený podle šablony (třídy). Každý objekt má _vlastní kopii vlastností_, ale sdílí _stejnou definici metod_ ze své třídy.
    - Proces vytvoření objektu z třídy se nazývá **instance** nebo **instanciace**.
    - _Analogie:_ Třída `Pernicek`. Objekty: konkrétní perníček č. 1, perníček č. 2 (každý má vlastní zdobení, ale oba byly upečeny podle stejného receptu/třídy).

3.  **Základní syntaxe Třídy v TypeScriptu:**

    ```typescript
    class NazevTridy {
      // Vlastnosti (Properties / Fields) - data, která objekt bude mít
      vlastnost1: typ;
      vlastnost2: typ = vychoziHodnota; // Může mít výchozí hodnotu

      // Konstruktor (Constructor) - speciální metoda pro vytvoření a inicializaci objektu
      constructor(parametr1: typ, parametr2: typ) {
        // 'this' odkazuje na právě vytvářený objekt (instanci)
        this.vlastnost1 = parametr1; // Přiřadíme hodnotu z parametru do vlastnosti objektu
        console.log("Objekt třídy NazevTridy byl vytvořen!");
      }

      // Metody (Methods) - funkce definující chování objektu
      metoda1(parametrMetody: typ): navratovyTyp {
        // Kód metody, může pracovat s vlastnostmi objektu pomocí 'this'
        console.log(`Hodnota vlastnosti1 je: ${this.vlastnost1}`);
        return /* nějaká hodnota */;
      }

      metoda2(): void {
        // Metoda, která nic nevrací
        console.log("Provádím akci...");
        this.metoda1("něco"); // Metoda může volat jinou metodu téže třídy
      }
    }

    // Vytvoření instance (objektu) třídy pomocí klíčového slova 'new'
    // Volá se konstruktor třídy
    let mujObjekt = new NazevTridy("hodnota pro vlastnost1", nejakaJinaHodnota);
    let druhyObjekt = new NazevTridy("jiná hodnota", dalsiHodnota);

    // Volání metody na objektu
    mujObjekt.metoda2();

    // Přístup k vlastnosti (pokud je public - viz dále)
    console.log(mujObjekt.vlastnost1);
    ```

4.  **Konstruktor (`constructor`)**

    - Speciální metoda, která se automaticky zavolá, když vytváříš novou instanci třídy pomocí `new`.
    - Jeho hlavním úkolem je **inicializovat** vlastnosti objektu (nastavit jim počáteční hodnoty), často pomocí parametrů předaných při volání `new`.
    - Třída může mít maximálně jeden konstruktor.

5.  **Vlastnosti (Properties / Fields)**

    - Proměnné definované uvnitř třídy, které uchovávají stav (data) objektu.
    - Každá instance třídy má vlastní sadu hodnot pro tyto vlastnosti.

6.  **Metody (Methods)**

    - Funkce definované uvnitř třídy, které definují chování objektu.
    - Mohou přistupovat k vlastnostem objektu a volat jiné metody téhož objektu pomocí klíčového slova `this`.

7.  **Klíčové slovo `this`**

    - Uvnitř metod třídy (a konstruktoru) `this` odkazuje na **aktuální instanci (objekt)**, na které byla metoda zavolána.
    - Je nezbytné pro přístup k vlastnostem a jiným metodám _této konkrétní instance_. `this.vlastnost1`, `this.metoda1()`.

8.  **Zapouzdření (Encapsulation) a Modifikátory Přístupu**

    - Jeden ze základních pilířů OOP. Jde o **skrytí vnitřního stavu a implementačních detailů objektu** před vnějším světem a poskytnutí kontrolovaného přístupu k nim prostřednictvím veřejných metod (rozhraní objektu).
    - Pomáhá chránit data před nechtěnými změnami a zjednodušuje používání objektu (nemusíš znát jeho vnitřnosti).
    - V TypeScriptu (a podobných jazycích) se zapouzdření dosahuje pomocí **modifikátorů přístupu**:
      - **`public` (výchozí):** Člen (vlastnost nebo metoda) je přístupný odkudkoli – zevnitř třídy, z odvozených tříd (o dědičnosti později) i z vnějšku třídy (přes instanci). Pokud neuvedeš žádný modifikátor, je automaticky `public`.
      - **`private`:** Člen je přístupný **pouze zevnitř třídy**, ve které byl definován. Ani odvozené třídy, ani kód vně třídy k němu nemají přímý přístup. Toto je nejsilnější forma zapouzdření. Často se používá pro interní detaily nebo data, která by neměla být měněna zvenčí.
      - **`protected`:** Člen je přístupný zevnitř třídy, ve které byl definován, **a také zevnitř odvozených tříd**. Není přístupný z vnějšku třídy.

    ```typescript
    class Example {
      public publicProperty: string = "Jsem veřejná";
      private privateProperty: string = "Jsem soukromá";
      protected protectedProperty: string = "Jsem chráněná";

      constructor() {}

      public publicMethod(): void {
        console.log("Veřejná metoda volá:");
        console.log(this.publicProperty); // OK
        console.log(this.privateProperty); // OK (jsme uvnitř třídy)
        console.log(this.protectedProperty); // OK (jsme uvnitř třídy)
        this.privateMethod(); // OK
      }

      private privateMethod(): void {
        console.log("Toto je soukromá metoda.");
      }
    }

    let ex = new Example();

    // Přístup z vnějšku třídy
    console.log(ex.publicProperty); // OK
    ex.publicMethod(); // OK

    // console.log(ex.privateProperty); // Chyba! Property 'privateProperty' is private...
    // ex.privateMethod();            // Chyba! Property 'privateMethod' is private...

    // console.log(ex.protectedProperty); // Chyba! Property 'protectedProperty' is protected...
    ```

**Příklad v kontextu testování (velmi zjednodušený `LoginPage`):**

```typescript
class LoginPage {
  // Vlastnosti (obvykle selektory v reálném POM) - zatím jen stringy
  private usernameInputSelector: string = "#username";
  private passwordInputSelector: string = "#password";
  public loginButtonSelector: string = "button[type='submit']"; // Tlačítko může být public

  // Konstruktor by zde mohl přijímat Playwright 'page' objekt, ale zatím ho vynecháme

  // Metody reprezentující akce uživatele
  public fillUsername(username: string): void {
    console.log(
      `Vyplňuji username '${username}' do pole '${this.usernameInputSelector}'`
    );
    // Zde by v reálu byl Playwright kód: await page.fill(this.usernameInputSelector, username);
  }

  public fillPassword(password: string): void {
    console.log(`Vyplňuji heslo do pole '${this.passwordInputSelector}'`);
    // Zde by byl Playwright kód: await page.fill(this.passwordInputSelector, password);
    this.logAttempt(); // Můžeme volat privátní metodu
  }

  public clickLoginButton(): void {
    console.log(`Klikám na tlačítko '${this.loginButtonSelector}'`);
    // Zde by byl Playwright kód: await page.click(this.loginButtonSelector);
  }

  // Příklad privátní metody pro interní logiku
  private logAttempt(): void {
    console.log("Interní log: Pokus o zadání hesla.");
  }

  // Kombinovaná metoda pro celou akci
  public login(username: string, password: string): void {
    console.log("--- Provádím kompletní přihlášení ---");
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLoginButton();
    console.log("--- Přihlášení dokončeno ---");
  }
}

// Použití třídy
let loginPage = new LoginPage();
loginPage.fillUsername("testuser");
loginPage.fillPassword("password123");
loginPage.clickLoginButton();

console.log("\nNebo pomocí kombinované metody:");
loginPage.login("anotherUser", "secretPass");

// Můžeme přistoupit k public vlastnosti:
console.log(`\nSelector pro login tlačítko: ${loginPage.loginButtonSelector}`);

// Nemůžeme přistoupit k private vlastnostem:
// console.log(loginPage.usernameInputSelector); // Chyba!
// loginPage.logAttempt(); // Chyba!
```

---

**Praktický Úkol (Den 4):**

1.  **Vytvoř třídu `User`:**
    - Třída bude mít následující **privátní** vlastnosti: `username` (string), `email` (string), `registrationDate` (typ `Date`).
    - Přidej **konstruktor**, který přijme `username` a `email` jako parametry a nastaví odpovídající vlastnosti. Vlastnost `registrationDate` inicializuj v konstruktoru na aktuální datum a čas (`new Date()`).
    - Přidej **veřejnou** metodu `getUserInfo(): string`, která vrátí string obsahující informace o uživateli (např. "Uživatel: testuser, Email: test@example.com, Registrován: [datum]"). Můžeš použít metodu `toLocaleDateString()` nebo `toISOString()` na objektu `Date` pro formátování data.
    - Přidej **veřejnou** metodu `changeEmail(newEmail: string): void`, která umožní změnit email uživatele.
    - _Bonus:_ Přidej **privátní** metodu `isValidEmail(email: string): boolean`, která velmi zjednodušeně ověří, zda email obsahuje znak `@`. Metoda `changeEmail` by měla tuto privátní metodu použít a změnit email pouze pokud je platný (jinak může vypsat varování do konzole).
2.  **Vytvoř instanci třídy `User`:** Vytvoř alespoň jednoho uživatele pomocí `new User(...)`.
3.  **Použij metody:** Zavolej na vytvořeném objektu metody `getUserInfo()` a `changeEmail()`. Vypiš výsledek `getUserInfo()` do konzole před a po změně emailu. Pokud jsi implementoval bonus, vyzkoušej změnu na platný i neplatný email.

Tímto si procvičíš definici třídy, konstruktor, vlastnosti, metody, `this` a použití modifikátorů `public` a `private`. Dej vědět, jak ti to jde!
