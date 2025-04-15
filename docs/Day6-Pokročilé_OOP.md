Paráda! Rozhraní máme zvládnutá a teď se posuneme k dalšímu pilíři objektově orientovaného programování, který je naprosto zásadní pro tvorbu znovupoužitelných a dobře strukturovaných frameworků, jako je Page Object Model (POM).

**Den 6: Pokročilé OOP - Dědičnost a Základní Polymorfismus**

**Proč jsou Dědičnost a Polymorfismus Důležité?**

Včera jsme definovali "kontrakty" pomocí rozhraní. Dnes se zaměříme na to, jak můžeme **sdílet implementaci** (kód) mezi třídami a jak můžeme s objekty různých, ale příbuzných tříd pracovat jednotným způsobem.

- **Dědičnost:** Umožňuje nám vytvořit novou třídu (potomek, _child class_ nebo _derived class_), která přebírá vlastnosti a metody z existující třídy (rodič, _parent class_ nebo _base class_). To je skvělé pro **znovupoužití kódu**. Místo abychom psali stejný kód pro navigaci nebo čekání na prvek v každé třídě reprezentující stránku (Page Object), můžeme tento kód napsat jednou v základní třídě (`BasePage`) a ostatní stránky ho zdědí.
- **Polymorfismus:** Znamená "mnoho tvarů". V OOP to znamená, že objekty odvozených tříd mohou být používány tam, kde je očekáván objekt rodičovské třídy, ale stále si zachovávají své specifické chování. Například můžeme mít pole různých typů stránek (LoginPage, HomePage), ale všechny je můžeme považovat za obecnou "Stránku" a zavolat na nich stejnou metodu (třeba `isLoaded()`), přičemž každá stránka provede svou vlastní specifickou kontrolu.

**Teorie Dne:**

1.  **Dědičnost (`extends`)**

    - Třída může zdědit vlastnosti a metody jiné třídy pomocí klíčového slova `extends`.
    - Potomek má přístup k `public` a `protected` členům rodiče, ale ne k `private` členům.
      - `public`: Přístupné odkudkoli.
      - `protected`: Přístupné uvnitř třídy a jejích potomků.
      - `private`: Přístupné pouze uvnitř třídy, kde byly definovány.
    - **Konstruktor a `super()`:** Pokud má rodičovská třída konstruktor, potomek _musí_ ve svém konstruktoru zavolat konstruktor rodiče pomocí `super()`. Toto volání musí být prvním příkazem v konstruktoru potomka. `super()` předává potřebné parametry konstruktoru rodiče.

    ```typescript
    class Animal {
      name: string;
      protected age: number; // Protected - přístupné v potomcích

      constructor(name: string, age: number) {
        console.log("Animal constructor");
        this.name = name;
        this.age = age;
      }

      move(distanceInMeters: number = 0): void {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
      }
    }

    class Dog extends Animal {
      breed: string;

      constructor(name: string, age: number, breed: string) {
        console.log("Dog constructor starts");
        super(name, age); // Volání konstruktoru Animal - povinné a první!
        console.log("Dog constructor continues");
        this.breed = breed;
      }

      bark(): void {
        console.log(
          `Woof! Woof! My name is ${this.name} and I am ${this.age} years old.`
        ); // Můžeme přistupovat k 'name' (public) a 'age' (protected)
      }

      // Tady nemůžeme přímo přistupovat k private vlastnostem Animal, pokud by tam byly
    }

    const dog = new Dog("Buddy", 5, "Golden Retriever");
    dog.move(10);
    dog.bark();
    // console.log(dog.age); // Chyba: Property 'age' is protected and only accessible within class 'Animal' and its subclasses.
    ```

2.  **Přepisování Metod (Method Overriding)**

    - Potomek může poskytnout vlastní implementaci metody, která již existuje v rodičovské třídě. Metoda v potomkovi musí mít stejný název a stejnou signaturu (parametry a jejich typy, návratový typ – nebo kompatibilní).
    - Uvnitř přepsané metody můžeme zavolat původní implementaci rodiče pomocí `super.nazevMetody()`.

    ```typescript
    class Cat extends Animal {
      constructor(name: string, age: number) {
        super(name, age);
      }

      // Přepisujeme metodu move z třídy Animal
      override move(distanceInMeters: number = 5): void {
        // TypeScript 4.3+ doporučuje 'override' klíčové slovo
        console.log("Cat sneaks...");
        super.move(distanceInMeters); // Zavoláme původní metodu move z Animal
      }

      meow(): void {
        console.log("Meow!");
      }
    }

    const cat = new Cat("Whiskers", 3);
    cat.move(); // Zavolá se přepsaná metoda z Cat
    ```

    _Poznámka:_ Klíčové slovo `override` není striktně vyžadováno, ale je dobrým zvykem ho používat (pokud je zapnutá volba `noImplicitOverride` v `tsconfig.json`), protože pomáhá předejít chybám (např. překlepům v názvu metody, kterou chceme přepsat).

3.  **Základní Polymorfismus**

    - Proměnná typu rodičovské třídy může obsahovat instanci potomka.
    - Když zavoláme metodu na této proměnné, zavolá se _přepsaná_ verze metody z potomka (pokud existuje).

    ```typescript
    let someAnimal: Animal; // Proměnná typu Animal

    someAnimal = new Dog("Rex", 2, "German Shepherd"); // Může držet instanci Dog
    someAnimal.move(20); // Zavolá se Dog.move (pokud by byla přepsána) nebo Animal.move

    someAnimal = new Cat("Snowball", 1); // Může držet instanci Cat
    someAnimal.move(); // Zavolá se přepsaná Cat.move()

    // someAnimal.bark(); // Chyba: Property 'bark' does not exist on type 'Animal'.
    // Přestože someAnimal aktuálně drží Dog, TypeScript zná jen metody definované v typu Animal.
    ```

4.  **Abstraktní Třídy a Metody (`abstract`)**

    - Abstraktní třída slouží jako základní šablona, ale **nelze z ní přímo vytvořit instanci**.
    - Může obsahovat jak běžné (konkrétní) metody s implementací, tak **abstraktní metody**.
    - Abstraktní metoda má pouze definici (název, parametry, návratový typ), ale **žádné tělo (implementaci)**. Je označena klíčovým slovem `abstract`.
    - Každá _neabstraktní_ třída, která dědí z abstraktní třídy, **musí implementovat** všechny abstraktní metody zděděné od rodiče.
    - Ideální pro `BasePage` v automatizaci – definujeme, že _každá_ stránka musí mít např. metodu `waitForPageToLoad()`, ale jak přesně se to udělá, záleží na konkrétní stránce.

    ```typescript
    // Předpokládejme, že máme přístup k typu 'Page' z knihovny Playwright
    import { Page } from "@playwright/test"; // Jen pro ilustraci typu

    abstract class BasePage {
      // Instance Playwright stránky, přístupná potomkům
      protected readonly page: Page;

      constructor(page: Page) {
        this.page = page;
      }

      // Konkrétní metoda - implementace je zde
      async navigate(url: string): Promise<void> {
        console.log(`[BasePage] Naviguji na ${url}`);
        // V reálu: await this.page.goto(url);
      }

      async getTitle(): Promise<string> {
        console.log("[BasePage] Získávám titulek stránky");
        // V reálu: return await this.page.title();
        return "Mock Title";
      }

      // Abstraktní metoda - BEZ implementace, vynucuje implementaci v potomcích
      abstract waitForPageToLoad(): Promise<void>;
    }

    // const base = new BasePage(); // Chyba: Cannot create an instance of an abstract class.

    class ConcreteLoginPage extends BasePage {
      // Musíme implementovat konstruktor a zavolat super()
      constructor(page: Page) {
        super(page);
      }

      // Musíme implementovat ABSTRAKTNÍ metodu z BasePage
      async waitForPageToLoad(): Promise<void> {
        console.log(
          "[ConcreteLoginPage] Čekám na načtení přihlašovací stránky (např. na viditelnost login formuláře)"
        );
        // V reálu: await this.page.waitForSelector("#login-form", { state: 'visible' });
      }

      // Specifické metody pro LoginPage
      async login(user: string, pass: string): Promise<void> {
        console.log(
          `[ConcreteLoginPage] Provádím přihlášení uživatele ${user}`
        );
        // V reálu: await this.page.fill('#username', user); ... atd.
      }
    }

    class ConcreteHomePage extends BasePage {
      constructor(page: Page) {
        super(page);
      }

      async waitForPageToLoad(): Promise<void> {
        console.log(
          "[ConcreteHomePage] Čekám na načtení domovské stránky (např. na viditelnost uvítací zprávy)"
        );
        // V reálu: await this.page.waitForSelector(".welcome-message", { state: 'visible' });
      }

      async getUserGreeting(): Promise<string> {
        console.log("[ConcreteHomePage] Získávám uvítací text");
        // V reálu: return await this.page.textContent(".welcome-message");
        return "Welcome, User!";
      }
    }
    ```

**Praxe Dne:**

1.  **Vytvoř `BasePage`:**

    - Vytvoř nový soubor (např. `pages/base.page.ts`).
    - Definuj `abstract class BasePage`.
    - Přidej `protected readonly page: Page;` (importuj `Page` z `@playwright/test`). _Poznámka: Pokud ještě Playwright testy nepouštíš přímo, můžeš zatím použít `any` místo `Page` nebo si vytvořit jednoduchý mock `interface Page { goto(url: string): Promise<void>; title(): Promise<string>; /_ ... _/ }`._
    - Přidej konstruktor, který přijímá `Page` a ukládá ji do `this.page`.
    - Přidej konkrétní metody `navigate(url: string)` a `getTitle()` (zatím mohou jen vypisovat do konzole, co dělají).
    - Přidej abstraktní metodu `waitForPageToLoad(): Promise<void>;` (všimni si středníku místo složených závorek `{}`). _Pozn.: Používáme `Promise<void>`, protože Playwright operace jsou asynchronní, k tomu se dostaneme zítra detailněji._

2.  **Vytvoř Odvozené Stránky:**

    - Vytvoř soubory `pages/login.page.ts` a `pages/home.page.ts`.
    - V `login.page.ts` definuj `class LoginPage extends BasePage`.
    - Implementuj konstruktor volající `super(page)`.
    - Implementuj metodu `waitForPageToLoad()` s `console.log`, který specifikuje, na co by čekal na login stránce (např. `#username` field).
    - Přidej specifickou metodu `login(username: string, password: string): Promise<void>` (opět stačí `console.log`).
    - Podobně v `home.page.ts` definuj `class HomePage extends BasePage`, implementuj konstruktor a `waitForPageToLoad()` (čekání na jiný prvek, např. `#dashboard`) a přidej specifickou metodu `getUserGreeting(): Promise<string>`.

3.  **(Bonus/Zamyšlení):**
    - Jak bys mohl/a použít polymorfismus? Představ si funkci, která přijímá pole stránek typu `BasePage[]` a na každé zavolá `waitForPageToLoad()`. Každá instance (LoginPage, HomePage) by spustila svou vlastní implementaci.

**Cíl Dne:**

- **Rozumět** principům dědičnosti (`extends`, `super()`, modifikátory přístupu).
- **Chápat**, jak přepisování metod (`override`) umožňuje specializovat chování v potomcích.
- **Pochopit** základní myšlenku polymorfismu.
- **Umět definovat** a používat abstraktní třídy a metody (`abstract`) pro vynucení implementace v potomcích.
- **Aplikovat** tyto koncepty na vytvoření základní struktury pro Page Object Model s `BasePage` a konkrétními odvozenými stránkami.

Toto je klíčový krok k budování znovupoužitelné a udržovatelné struktury pro tvůj testovací framework. Dědičnost nám pomůže sdílet společný kód a abstraktní třídy zajistí, že všechny naše Page Objecty budou mít konzistentní základní rozhraní.

Až budeš mít hotovo, nebo pokud narazíš na problémy, dej vědět! Zítra nás čeká neméně důležité téma: Asynchronní programování.
