Dnes se podíváme na nástroje, které nám umožňují řídit, jak se náš kód vykonává – jak se rozhoduje a jak opakuje určité operace. Také si představíme základní způsob, jak v JavaScriptu a TypeScriptu strukturovat data pomocí objektů, ještě než se ponoříme do tříd.

**Cíl:** Ovládat větvení a cykly. Rozumět základní syntaxi a použití objektových literálů.

**Teorie - Řídící Struktury:**

Už jsme narazili na `if/else`. Pojďme si to zrekapitulovat a přidat další:

1.  **`if / else if / else`:** Základní větvení kódu.

    ```typescript
    let score: number = 75;

    if (score >= 90) {
      console.log("Výborně!");
    } else if (score >= 75) {
      console.log("Chvalitebně."); // Tento blok se vykoná
    } else if (score >= 60) {
      console.log("Dobře.");
    } else {
      console.log("Nedostatečně.");
    }
    ```

    - Vykoná se **první** blok, jehož podmínka je `true`. Ostatní se přeskočí. `else` je volitelný a vykoná se, pokud žádná předchozí podmínka nebyla `true`.

2.  **`switch`:** Alternativa k `if/else if/else`, vhodná zejména když porovnáváte jednu proměnnou s více konkrétními hodnotami.

    ```typescript
    let browser: string = "chrome";

    switch (browser) {
      case "chrome":
        console.log("Spouštím testy v Chrome.");
        // Zde by byla logika pro Chrome
        break; // DŮLEŽITÉ! Ukončí switch. Bez něj by kód "propadl" do dalšího case.
      case "firefox":
        console.log("Spouštím testy ve Firefoxu.");
        break;
      case "webkit": // Můžeme seskupit více case
      case "safari":
        console.log("Spouštím testy v Safari (WebKit).");
        break;
      default: // Volitelný blok, pokud žádný case neodpovídá
        console.warn(`Prohlížeč ${browser} není explicitně podporován.`);
        break;
    }
    ```

    - Používá striktní porovnání (`===`).
    - Nezapomínej na `break`!

3.  **Cykly (Loops):** Pro opakované vykonávání kódu.

    - **`for` cyklus (klasický):** Nejčastěji používaný, když známe (nebo můžeme snadno určit) počet opakování. Ideální pro práci s indexy polí.

      ```typescript
      let names: string[] = ["Alice", "Bob", "Charlie"];

      // Projdi pole od indexu 0 do names.length - 1
      for (let i: number = 0; i < names.length; i++) {
        console.log(`Index ${i}: ${names[i]}`);
      }
      // Výstup:
      // Index 0: Alice
      // Index 1: Bob
      // Index 2: Charlie
      ```

      - `let i = 0;`: Inicializace počítadla (vykoná se jednou na začátku).
      - `i < names.length;`: Podmínka (kontroluje se před každou iterací; pokud je `false`, cyklus končí).
      - `i++`: Inkrementace (vykoná se na konci každé iterace).

    - **`for...of` cyklus:** Modernější způsob procházení _hodnot_ iterovatelných objektů (jako jsou pole, stringy, Mapy, Sety...). Je čitelnější, když nepotřebuješ index.

      ```typescript
      let scores: number[] = [10, 20, 30];

      for (const score of scores) {
        console.log(`Hodnota: ${score}`); // Přímo přistupuješ k hodnotě
      }
      // Výstup:
      // Hodnota: 10
      // Hodnota: 20
      // Hodnota: 30

      let browserName: string = "Chrome";
      for (const char of browserName) {
        console.log(char); // Vypíše C, h, r, o, m, e
      }
      ```

    - **`for...in` cyklus:** Používá se primárně pro iteraci přes _klíče (vlastnosti)_ objektu. **Pozor:** Nedoporučuje se pro iteraci přes pole (může vracet i jiné vlastnosti než jen indexy a nezaručuje pořadí).

      ```typescript
      const user = { name: "Tester", role: "QA", level: 5 };

      for (const key in user) {
        // key bude postupně "name", "role", "level"
        // Pro přístup k hodnotě musíme použít hranaté závorky: user[key]
        console.log(`Klíč: ${key}, Hodnota: ${user[key]}`);
      }
      // Výstup:
      // Klíč: name, Hodnota: Tester
      // Klíč: role, Hodnota: QA
      // Klíč: level, Hodnota: 5
      ```

    - **`while` cyklus:** Opakuje blok kódu, dokud je podmínka `true`. Podmínka se kontroluje _před_ každou iterací. Vhodné, když nevíme předem, kolikrát cyklus poběží.

      ```typescript
      let attempts: number = 0;
      const maxAttempts: number = 3;
      let loggedIn: boolean = false;

      while (!loggedIn && attempts < maxAttempts) {
        console.log(`Pokus o přihlášení č. ${attempts + 1}`);
        // Zde by byla logika pro přihlášení...
        // Předpokládejme, že se to povede na 2. pokus
        if (attempts === 1) {
          loggedIn = true;
          console.log("Přihlášení úspěšné!");
        }
        attempts++; // DŮLEŽITÉ: Nezapomenout měnit proměnnou v podmínce, jinak hrozí nekonečný cyklus!
      }

      if (!loggedIn) {
        console.log("Přihlášení selhalo po maximálním počtu pokusů.");
      }
      ```

    - **`do...while` cyklus:** Podobný `while`, ale podmínka se kontroluje až _po_ vykonání bloku kódu. To zaručuje, že tělo cyklu proběhne **minimálně jednou**.
      ```typescript
      let userInput: string | null;
      do {
        userInput = prompt("Zadejte 'exit' pro ukončení:"); // prompt není standardní v Node.js, jen pro ilustraci
        console.log(`Zadali jste: ${userInput}`);
      } while (userInput !== "exit");
      console.log("Program ukončen.");
      ```

**Teorie - Úvod do Objektů (Object Literals):**

Předtím, než se dostaneme k OOP a třídám, se podíváme na základní způsob, jak v JS/TS seskupovat související data a funkce dohromady – pomocí **objektových literálů**. Objekt je kolekce párů **klíč-hodnota** (key-value pairs). Klíče jsou obvykle stringy (nebo Symboly), hodnoty mohou být jakéhokoli typu (číslo, string, boolean, pole, jiný objekt, funkce...).

```typescript
// Vytvoření objektu pomocí literálu {}
const user = {
  // Klíč: hodnota
  firstName: "Jan",
  lastName: "Tester",
  age: 30,
  isActive: true,
  roles: ["admin", "tester"], // Hodnota může být pole
  address: {
    // Hodnota může být jiný objekt (vnořený objekt)
    street: "Testovací 123",
    city: "Praha",
  },
  // Metoda (funkce jako vlastnost objektu)
  getFullName: function (): string {
    return this.firstName + " " + this.lastName; // 'this' odkazuje na tento objekt (user)
  },
  // Metoda s ES6 syntaxí (stručnější)
  logActivity() {
    console.log(`User ${this.firstName} activity logged.`);
  },
};

// Přístup k vlastnostem:

// 1. Tečková notace (dot notation) - preferovaná, pokud je klíč platný identifikátor
console.log(user.firstName); // "Jan"
console.log(user.address.city); // "Praha"
user.logActivity(); // Spustí metodu logActivity

// 2. Hranaté závorky (bracket notation) - nutné, pokud klíč není platný identifikátor
//    (obsahuje mezery, pomlčky, začíná číslem) nebo pokud je klíč uložen v proměnné.
console.log(user["lastName"]); // "Tester"
let propertyName = "age";
console.log(user[propertyName]); // 30 (získá hodnotu vlastnosti, jejíž jméno je v proměnné propertyName)

// user."first-name" = "Petr"; // Toto by nefungovalo, "first-name" není platný identifikátor
user["first-name"] = "Petr"; // Pomocí bracket notation můžeme i takové vlastnosti nastavit/číst
console.log(user["first-name"]); // "Petr"

// Úprava vlastnosti
user.age = 31;
console.log(user.age); // 31

// Přidání nové vlastnosti
user.email = "jan.tester@example.com";
console.log(user.email);

// Volání metody
console.log(user.getFullName()); // "Jan Tester"
```

- **Klíče:** Pokud klíč neobsahuje speciální znaky, uvozovky kolem něj nejsou v definici literálu nutné (`firstName: "Jan"`). Pokud ano, musíte použít uvozovky (`"first-name": "Petr"`).
- **`this`:** Klíčové slovo `this` uvnitř metody objektu odkazuje na samotný objekt, což umožňuje metodě pracovat s ostatními vlastnostmi téhož objektu.

---

**Praktické Úkoly (Den 3):**

1.  **Hledání v poli pomocí cyklu:**
    - Vytvoř pole čísel, např. `let data: number[] = [12, 5, 8, 130, 44, 99];`.
    - Napiš **klasický `for` cyklus**, který najde **index** prvního prvku v poli `data`, který je větší než `50`. Pokud takový prvek existuje, vypiš jeho index a hodnotu do konzole. Pokud neexistuje, vypiš zprávu "Žádný prvek větší než 50 nebyl nalezen.".
    - _Bonus:_ Zkus to vyřešit i pomocí `while` cyklu.
2.  **Iterace přes vlastnosti objektu:**
    - Vytvoř objekt `testConfig`, který bude obsahovat konfiguraci pro testy. Například:
      ```typescript
      const testConfig = {
        browser: "chrome",
        baseUrl: "https://example.com",
        retries: 2,
        headless: true,
      };
      ```
    - Použij cyklus **`for...in`** k vypsání všech klíčů a jejich odpovídajících hodnot z objektu `testConfig` do konzole ve formátu `"Konfigurace [klíč]: [hodnota]"`.
3.  **Reprezentace testovacích dat:**
    - Vytvoř objekt `loginTestData`, který bude obsahovat data potřebná pro přihlašovací test: `username`, `password` a `expectedMessage` (očekávaná zpráva po přihlášení, např. "Welcome, Tester!").
    - Napiš funkci `displayLoginData(data)`, která přijme objekt jako `loginTestData` a vypíše jeho vlastnosti (`username`, `password`, `expectedMessage`) čitelně do konzole.
    - Zavolej funkci `displayLoginData` s tvým objektem `loginTestData`.
    - _Zamyšlení:_ Jak bys zajistil/a, že funkce `displayLoginData` dostane objekt, který _opravdu_ má vlastnosti `username`, `password` a `expectedMessage`? (Zatím jen nápad, k tomu se dostaneme později s rozhraními a typy).
