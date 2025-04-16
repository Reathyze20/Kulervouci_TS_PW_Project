Dobře, organizaci kódu pomocí modulů máme za sebou! To nám dává skvělý základ pro udržení pořádku v našem rostoucím frameworku. Dnes se ponoříme do dalšího mocného nástroje TypeScriptu, který nám pomůže psát ještě flexibilnější a zároveň typově bezpečný kód: **Generika (Generics)**.

**Den 9: Generika (Generics)**

**Co jsou Generika a Proč Jsou Užitečná?**

Představ si, že chceš napsat funkci, která vezme pole jakýchkoli prvků (čísla, stringy, objekty...) a vrátí první prvek tohoto pole. Bez generik bys měl/a několik možností, žádná z nich není ideální:

1.  **Specifické funkce:** Napsat jednu funkci pro pole čísel (`getFirstNumber(arr: number[]): number`), další pro pole stringů (`getFirstString(arr: string[]): string`), atd. -> **Duplikace kódu**.
2.  **Použití `any`:** Napsat funkci `getFirstAny(arr: any[]): any`. -> **Ztráta typové bezpečnosti**. TypeScript neví, jakého typu je vrácená hodnota, takže nemůže provádět kontroly a ztrácíš výhody typování.

**Generika řeší přesně tento problém.** Umožňují nám psát komponenty (funkce, třídy, rozhraní), které mohou pracovat s **různými typy**, aniž by ztratily informaci o těchto typech. Fungují jako **proměnné pro typy**. Definujeme "placeholder" pro typ, který bude specifikován až v momentě, kdy generickou komponentu použijeme.

**Výhody:**

- **Typová bezpečnost:** Zachováváme typové informace napříč kódem. Pokud do generické funkce vložíš pole čísel, TypeScript ví, že vrátí číslo.
- **Znovupoužitelnost:** Napiš kód jednou, použij ho pro mnoho typů.
- **Flexibilita:** Umožňuje uživatelům tvého kódu definovat, s jakými konkrétními typy chtějí pracovat.

**Teorie Dne:**

1.  **Generické Funkce:**

    - Syntax: Používáme lomené závorky `<T>` (nebo jiné písmeno, např. `<U>`, `<K>`, `<V>`) hned za názvem funkce k definici **typové proměnné**. Tuto proměnnou pak můžeme použít v definici parametrů a návratové hodnoty.

    ```typescript
    // 'T' je typová proměnná (placeholder pro typ)
    function identity<T>(arg: T): T {
      console.log(`Typ argumentu: ${typeof arg}`);
      return arg;
    }

    // Volání s explicitním typem
    let outputString = identity<string>("myString");
    console.log(outputString.toUpperCase()); // TypeScript ví, že outputString je string

    // Volání s inferencí typu (TypeScript odvodí T z argumentu)
    let outputNumber = identity(123);
    console.log(outputNumber + 10); // TypeScript ví, že outputNumber je number

    // Příklad funkce vracející první prvek pole
    function getFirstElement<T>(arr: T[]): T | undefined {
      return arr.length > 0 ? arr[0] : undefined;
    }

    let numbers = [10, 20, 30];
    let firstNumber = getFirstElement(numbers); // TypeScript ví, že firstNumber je number | undefined
    if (firstNumber !== undefined) {
      console.log(firstNumber * 2); // Bezpečné násobení
    }

    let strings = ["a", "b", "c"];
    let firstString = getFirstElement(strings); // TypeScript ví, že firstString je string | undefined
    if (firstString !== undefined) {
      console.log(firstString.toLowerCase()); // Bezpečné volání metody stringu
    }
    ```

2.  **Generická Rozhraní:**

    - Typové proměnné můžeme použít i v definici rozhraní.

    ```typescript
    interface Pair<K, V> {
      // Dvě typové proměnné: K pro klíč, V pro hodnotu
      key: K;
      value: V;
    }

    let numberStringPair: Pair<number, string> = { key: 1, value: "one" };
    let stringBooleanPair: Pair<string, boolean> = {
      key: "active",
      value: true,
    };

    console.log(numberStringPair);
    console.log(stringBooleanPair);
    ```

3.  **Generické Třídy:**

    - Podobně jako u rozhraní, třídy mohou být generické. Typová proměnná je dostupná v celé třídě.

    ```typescript
    class Box<T> {
      private content: T;

      constructor(initialContent: T) {
        this.content = initialContent;
      }

      getContent(): T {
        return this.content;
      }

      setContent(newContent: T): void {
        this.content = newContent;
      }
    }

    let stringBox = new Box<string>("Hello Generics!");
    console.log(stringBox.getContent().toUpperCase());

    let numberBox = new Box(100); // Typ T je inferován jako number z konstruktoru
    numberBox.setContent(numberBox.getContent() + 50);
    console.log(numberBox.getContent());

    // let mixedBox = new Box<string>(555); // Chyba: Number není přiřaditelný ke string
    ```

4.  **Generická Omezení (Generic Constraints):**

    - Někdy chceme omezit, jaké typy mohou být použity jako typová proměnná. Chceme například zajistit, že typ `T` má určitou vlastnost nebo metodu. Používáme k tomu `extends` (ale v kontextu generik to znamená "musí být kompatibilní s" nebo "musí splňovat kontrakt").

    ```typescript
    interface Lengthwise {
      // Rozhraní definující požadovanou vlastnost
      length: number;
    }

    // Funkce přijímá pouze typy, které mají vlastnost 'length'
    function logLength<T extends Lengthwise>(arg: T): T {
      console.log(`Délka: ${arg.length}`); // Bezpečně přistupujeme k .length
      return arg;
    }

    logLength("hello"); // String má .length
    logLength([1, 2, 3]); // Pole má .length
    logLength({ length: 10, value: 3 }); // Objekt s .length je také OK

    // logLength(123);       // Chyba: number nemá vlastnost .length
    // logLength({ name: "test" }); // Chyba: objekt nemá vlastnost .length
    ```

**Kde se Generika Hodí v Testovacím Frameworku?**

- **Utility Funkce:**
  - `getRandomElement<T>(items: T[]): T | undefined` (získání náhodného prvku z pole libovolného typu).
  - `shuffleArray<T>(items: T[]): T[]` (zamíchání pole libovolného typu).
- **API Klienti / Wrappery:**

  - Můžeš mít generickou funkci `sendApiRequest<TResponse>(config: RequestConfig): Promise<ApiResponse<TResponse>>`, kde `TResponse` definuje očekávaný tvar dat v úspěšné odpovědi a `ApiResponse<T>` je generické rozhraní (viz praxe níže). To ti umožní mít jednu funkci pro různé API endpointy a stále mít typovou kontrolu nad odpovědí.

  ```typescript
  // Příklad (velmi zjednodušený)
  interface ApiResponse<T> {
    success: boolean;
    data: T;
    statusCode: number;
    errorMessage?: string;
  }

  async function getUser(
    userId: number
  ): Promise<ApiResponse<{ id: number; name: string; email: string }>> {
    // ... logika pro volání API ...
    console.log(`Fetching user ${userId}`);
    // Simulace úspěšné odpovědi
    return {
      success: true,
      data: { id: userId, name: "John Doe", email: "john@example.com" },
      statusCode: 200,
    };
  }

  async function getProducts(): Promise<
    ApiResponse<{ id: string; price: number }[]>
  > {
    // ... logika pro volání API ...
    console.log("Fetching products");
    // Simulace úspěšné odpovědi
    return {
      success: true,
      data: [
        { id: "prod1", price: 100 },
        { id: "prod2", price: 250 },
      ],
      statusCode: 200,
    };
  }
  ```

- **Správa Testovacích Dat:**
  - Generická třída nebo funkce pro načítání testovacích dat z různých zdrojů (JSON, CSV) a jejich parsování do specifických typových struktur (definovaných rozhraními). `loadTestData<T>(source: string): Promise<T>`.
- **Base Třídy (méně často, ale možné):** V některých pokročilých scénářích může být `BasePage` nebo jiná základní třída generická, aby mohla pracovat s konkrétními typy definovanými v potomcích.

**Praxe Dne:**

1.  **Generická Funkce `getFirstElement`:** Napiš (nebo zkopíruj z teorie) funkci `getFirstElement<T>(arr: T[]): T | undefined`. Otestuj ji s polem čísel a polem stringů.
2.  **Generická Funkce `isInArray`:** Napiš funkci `isInArray<T>(haystack: T[], needle: T): boolean`, která vrátí `true`, pokud se prvek `needle` nachází v poli `haystack`, a `false` jinak. Otestuj ji s čísly i stringy. (Můžeš použít metodu `includes` nebo cyklus).
3.  **Generické Rozhraní `ApiResponse`:**
    - Definuj generické rozhraní `ApiResponse<T>` s vlastnostmi:
      - `data: T`
      - `status: number`
      - `success: boolean`
      - `error?: string` (volitelná chybová zpráva)
    - Vytvoř proměnnou `userResponse` typu `ApiResponse<{ id: number; name: string }>` a přiřaď jí odpovídající objekt.
    - Vytvoř proměnnou `productsResponse` typu `ApiResponse<string[]>` a přiřaď jí odpovídající objekt (např. data budou pole názvů produktů).
4.  **(Zamyšlení / Bonus):** Podívej se na svůj dosavadní kód (utility, stránky). Vidíš místo, kde by použití generik mohlo zjednodušit kód nebo zlepšit typovou bezpečnost? Například, pokud bys měl/a obecnou funkci pro čekání na data z API nebo pro načítání konfiguračních sekcí různých typů.

**Cíl Dne:**

- **Pochopit** koncept generik – psaní kódu, který pracuje s různými typy bezpečně.
- **Umět definovat** a používat generické funkce, rozhraní a (volitelně) třídy.
- **Rozumět** a umět použít generická omezení (`extends`).
- **Identifikovat** příležitosti pro využití generik ve frameworku pro testovací automatizaci (utility, API wrappery, data).

Generika jsou trochu abstraktnější koncept, ale jakmile pochopíš jejich sílu, oceníš, jak čistý a znovupoužitelný kód ti umožňují psát.

Dej vědět, jak ti to jde! Zítra se vrhneme na klíčový návrhový vzor pro UI automatizaci: Page Object Model (POM).
