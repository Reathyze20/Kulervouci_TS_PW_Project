Výborně! Jsem rád, že první den proběhl hladce. Pojďme tedy navázat a ponořit se do funkcí a základních způsobů, jak v TypeScriptu uchovávat více hodnot pohromadě – do polí a tupel.

---

### **Den 2: Funkce a Základní Datové Struktury**

**Cíl:** Naučit se definovat, typovat a používat funkce. Pochopit a používat pole a tuply pro ukládání kolekcí dat.

**Teorie - Funkce v TypeScriptu:**

Funkce jsou základním stavebním kamenem každého programu. Umožňují nám seskupit kód, který provádí specifický úkol, a volat ho opakovaně. TypeScript přidává možnost přesně definovat, jaké typy dat funkce přijímá (parametry) a jaký typ dat vrací.

1.  **Deklarace Funkce (Function Declaration):** Klasický způsob definice.

    ```typescript
    function add(x: number, y: number): number {
      return x + y;
    }

    // Volání funkce
    let sum: number = add(5, 3); // sum bude 8
    console.log(sum);
    ```

    - `add`: Jméno funkce.
    - `(x: number, y: number)`: Parametry funkce s jejich typy.
    - `: number`: Typ návratové hodnoty. Pokud funkce nic nevrací, použijeme `: void`.
    - `{ return x + y; }`: Tělo funkce.

2.  **Funkční Výraz (Function Expression):** Funkce je přiřazena do proměnné.

    ```typescript
    const multiply = function (x: number, y: number): number {
      return x * y;
    };

    let product: number = multiply(4, 3); // product bude 12
    console.log(product);
    ```

    - Často se používá s `const`, aby se zabránilo pozdějšímu přepsání proměnné jinou funkcí.

3.  **Arrow Funkce (Arrow Functions - ES6):** Moderní, stručnější syntaxe, obzvláště užitečná pro krátké funkce a má specifické chování s `this` (k tomu se dostaneme později u OOP).

    ```typescript
    // Stručná syntaxe pro jednoduché vrácení hodnoty
    const subtract = (x: number, y: number): number => x - y;

    // Delší syntaxe s tělem funkce
    const divide = (x: number, y: number): number => {
      if (y === 0) {
        throw new Error("Cannot divide by zero!");
      }
      return x / y;
    };

    let difference: number = subtract(10, 4); // difference bude 6
    let quotient: number = divide(10, 2); // quotient bude 5
    console.log(difference);
    console.log(quotient);
    ```

    - `=>` odděluje parametry od těla funkce.
    - Pokud má funkce jen jeden parametr, závorky kolem něj nejsou nutné (např. `n => n * n`).
    - Pokud tělo funkce jen vrací hodnotu, můžeme vynechat `{}` a `return`.

4.  **Typování Návratové Hodnoty:** Je dobrá praxe vždy uvádět návratový typ (`: number`, `: string`, `: void` atd.), i když by ho TS mohl odvodit. Zlepšuje to čitelnost a pomáhá předcházet chybám. Pro funkce, které nic nevrací (jen provádějí akci, např. logování, kliknutí v Playwright), použijeme `: void`.

    ```typescript
    function logMessage(message: string): void {
      console.log(message);
      // Není zde žádný return
    }
    ```

5.  **Volitelné a Výchozí Parametry:**

    - **Volitelný parametr:** Označí se otazníkem `?` za jménem parametru. Musí být na konci seznamu parametrů (nebo následován dalšími volitelnými/rest parametry). V těle funkce bude mít hodnotu `undefined`, pokud nebyl předán.
    - **Výchozí parametr:** Přiřadíme hodnotu přímo v definici parametrů. Pokud hodnota není předána při volání, použije se výchozí.

    ```typescript
    function greetUser(name: string, salutation: string = "Ahoj"): void {
      console.log(`${salutation}, ${name}!`);
    }

    function createUser(username: string, email?: string): void {
      console.log(`Vytvářím uživatele: ${username}`);
      if (email) {
        // Musíme ověřit, zda email existuje
        console.log(`Email: ${email}`);
      }
    }

    greetUser("Petře"); // Použije výchozí "Ahoj" -> "Ahoj, Petře!"
    greetUser("Jano", "Vítej"); // Použije předané "Vítej" -> "Vítej, Jano!"
    createUser("tester"); // -> Vytvářím uživatele: tester
    createUser("tester", "test@example.com"); // -> Vytvářím uživatele: tester \n Email: test@example.com
    ```

**Teorie - Základní Datové Struktury:**

1.  **Pole (Arrays):** Seřazená kolekce hodnot stejného typu (i když TS dovoluje i smíšené typy, je lepší se držet jednoho typu pro přehlednost).

    - **Deklarace:**
      ```typescript
      let numbers: number[] = [1, 2, 3, 4, 5];
      let names: Array<string> = ["Alice", "Bob", "Charlie"]; // Alternativní syntaxe (generická)
      let booleans: boolean[] = [true, false, true];
      let emptyArray: string[] = []; // Prázdné pole stringů
      ```
    - **Přístup k prvkům:** Pomocí indexu (číslování od 0).
      ```typescript
      console.log(names[0]); // Vypíše "Alice"
      names[1] = "Robert"; // Změní druhý prvek na "Robert"
      console.log(names); // Vypíše ["Alice", "Robert", "Charlie"]
      ```
    - **Délka pole:** Vlastnost `length`.
      ```typescript
      console.log(numbers.length); // Vypíše 5
      ```
    - **Základní Metody:**
      - `push(item)`: Přidá prvek na konec pole.
      - `pop()`: Odebere a vrátí poslední prvek.
      - `shift()`: Odebere a vrátí první prvek.
      - `unshift(item)`: Přidá prvek na začátek pole.
      ```typescript
      names.push("David"); // names: ["Alice", "Robert", "Charlie", "David"]
      let lastName = names.pop(); // lastName: "David", names: ["Alice", "Robert", "Charlie"]
      let firstName = names.shift(); // firstName: "Alice", names: ["Robert", "Charlie"]
      names.unshift("Eva"); // names: ["Eva", "Robert", "Charlie"]
      console.log(names);
      ```

2.  **Iterace Přes Pole:** Procházení prvků pole.

    - **`for...of` (preferovaný způsob pro hodnoty):**
      ```typescript
      for (const name of names) {
        console.log(`Jméno: ${name}`);
      }
      ```
    - **`forEach` (metoda pole):**
      ```typescript
      names.forEach((name, index) => {
        console.log(`Jméno na indexu ${index}: ${name}`);
      });
      ```

3.  **Transformace a Filtrace Polí (velmi užitečné!):**

    - **`map()`:** Vytvoří _nové_ pole transformací každého prvku původního pole. Původní pole zůstane nezměněno.
      ```typescript
      let numbers: number[] = [1, 2, 3, 4];
      let squares: number[] = numbers.map((num) => num * num);
      // squares: [1, 4, 9, 16]
      // numbers: [1, 2, 3, 4] (zůstalo stejné)
      console.log(squares);
      ```
    - **`filter()`:** Vytvoří _nové_ pole obsahující pouze ty prvky, které splňují danou podmínku. Původní pole zůstane nezměněno.
      ```typescript
      let ages: number[] = [15, 25, 30, 12, 45];
      let adults: number[] = ages.filter((age) => age >= 18);
      // adults: [25, 30, 45]
      // ages: [15, 25, 30, 12, 45] (zůstalo stejné)
      console.log(adults);
      ```

4.  **Tuply (Tuples):** Podobné poli, ale s _fixním počtem prvků_, kde _typ každého prvku je známý_ a pevně daný na své pozici. Jsou užitečné, když chcete vrátit z funkce několik hodnot různých typů.

    ```typescript
    // Definice tuply: [typPrvku1, typPrvku2, ...]
    let userProfile: [string, number, boolean];

    // Přiřazení hodnot (musí odpovídat typům a počtu)
    userProfile = ["tester123", 30, true];
    // userProfile = ["tester123", true, 30]; // Chyba! Špatné typy na pozicích.
    // userProfile = ["tester123", 30];      // Chyba! Chybí třetí prvek.

    // Přístup k prvkům (jako u pole)
    console.log("Username:", userProfile[0]); // "tester123"
    console.log("Age:", userProfile[1]); // 30
    console.log("Is Active:", userProfile[2]); // true

    // Můžeme měnit hodnoty, ale typ musí sedět
    userProfile[1] = 31;
    // userProfile[0] = 100; // Chyba! První prvek musí být string.

    // Příklad funkce vracející tuplu
    function getUserData(userId: number): [string, string] {
      // Simulace načtení dat...
      if (userId === 1) {
        return ["Alice", "alice@example.com"];
      } else {
        return ["Unknown", "unknown@example.com"];
      }
    }

    let [username, email] = getUserData(1); // Destructuring assignment - elegantní přiřazení
    console.log(`Uživatel: ${username}, Email: ${email}`); // Uživatel: Alice, Email: alice@example.com
    ```

---

**Praktické Úkoly (Den 2):**

1.  **Funkce pro výpočty:**
    - Napiš funkci (použij arrow syntaxi `=>`) s názvem `calculateRectangleArea`, která přijme dva parametry `width: number` a `height: number` a vrátí plochu obdélníka (`number`). Otestuj ji zavoláním s různými hodnotami.
    - Napiš funkci `isEven`, která přijme jedno číslo (`num: number`) a vrátí `boolean` (true, pokud je číslo sudé, jinak false). (Nápověda: použij operátor modulo `%`).
2.  **Práce s poli:**
    - Vytvoř pole `testResults: number[]` obsahující několik číselných výsledků testů (např. `[85, 92, 78, 95, 88, 60]`).
    - Použij metodu `filter`, abys vytvořil/a nové pole `passingResults`, které bude obsahovat pouze výsledky >= 75. Vypiš `passingResults` do konzole.
    - Použij metodu `map`, abys vytvořil/a nové pole `resultsAsStrings`, které bude obsahovat původní výsledky převedené na stringy s přidaným textem, např. `"Výsledek: 85 bodů"`. Vypiš `resultsAsStrings` do konzole.
    - Použij `forEach` k vypsání každého výsledku z původního `testResults` pole do konzole.
3.  **Jednoduchá Tupla:**
    - Definuj typ pro tuplu, která bude reprezentovat výsledek přihlášení: `LoginResult = [boolean, string];` (první hodnota značí úspěch/neúspěch, druhá je zpráva pro uživatele).
    - Napiš funkci `tryLogin(user: string, pass: string): LoginResult`, která simuluje přihlášení. Pokud `user === "admin"` a `pass === "password123"`, vrátí `[true, "Přihlášení úspěšné"]`, jinak vrátí `[false, "Nesprávné jméno nebo heslo"]`.
    - Zavolej funkci `tryLogin` dvakrát (jednou se správnými, jednou s nesprávnými údaji) a vypiš výsledky (úspěch i zprávu) do konzole. Použij destructuring assignment pro přiřazení výsledků do proměnných (např. `let [success, message] = tryLogin(...)`).

Experimentuj, zkoušej si kód měnit, dělej chyby a sleduj, co ti TypeScript říká. To je nejlepší způsob, jak se učit! Až budeš mít úkoly hotové nebo narazíš na problém, dej vědět. Hodně štěstí!
