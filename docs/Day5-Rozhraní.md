Skvěle, den 4 máme za sebou a základy tříd jsou položeny! Dnes se ponoříme do jednoho z nejdůležitějších konceptů TypeScriptu, který je naprosto klíčový pro stavbu robustních a dobře strukturovaných frameworků: **Rozhraní (Interfaces)**.

**Den 5: Rozhraní (Interfaces)**

**Proč jsou Rozhraní Důležitá?**

Včera jsme se naučili vytvářet třídy – blueprinty pro objekty, které obsahují jak data (vlastnosti), tak chování (metody). Rozhraní jdou ještě o krok dál v definování _struktury_. Můžeš si je představit jako **kontrakt** nebo **šablonu**, která říká: "Pokud chceš být považován za tento typ (např. `UserCredentials`, `LoginPageElements`, `TestData`), musíš mít tyto konkrétní vlastnosti (a případně metody) s těmito konkrétními typy."

Na rozdíl od tříd, rozhraní sama o sobě neobsahují implementaci (kód v metodách). Pouze _popisují_, jak má objekt nebo třída vypadat. To je nesmírně užitečné pro:

1.  **Vynucení konzistence:** Zajišťuje, že různé části kódu pracují s daty očekávané struktury.
2.  **Zlepšení čitelnosti:** Jasně definuje, jaké "tvary" dat se v systému používají.
3.  **Flexibilitu:** Umožňuje nám definovat, _co_ potřebujeme, aniž bychom se vázali na konkrétní _jak_ (implementaci ve třídě).

**Teorie Dne:**

1.  **Co je Rozhraní (`interface`)?**

    - Syntax: `interface NazevRozhrani { vlastnost: typ; }`
    - Definuje "tvar" (shape) objektu – jaké vlastnosti a jakého typu musí mít.
    - Může definovat i metody (jejich signaturu – název, parametry, návratový typ), ale bez těla.

    ```typescript
    interface Point {
      x: number;
      y: number;
    }

    // Objekt 'pt' musí splňovat kontrakt rozhraní 'Point'
    let pt: Point = { x: 10, y: 20 };
    // let ptWrong: Point = { x: 10 }; // Chyba: Chybí vlastnost 'y'
    ```

2.  **Implementace Rozhraní ve Třídách (`implements`)**

    - Třída může deklarovat, že splňuje kontrakt jednoho nebo více rozhraní pomocí klíčového slova `implements`.
    - TypeScript pak zkontroluje, zda třída skutečně obsahuje všechny vlastnosti a metody definované v rozhraní.

    ```typescript
    interface CanGreet {
      greet(message: string): void; // Signatura metody
    }

    class Person implements CanGreet {
      name: string;

      constructor(name: string) {
        this.name = name;
      }

      // Třída musí implementovat metodu 'greet' definovanou v rozhraní
      greet(message: string): void {
        console.log(`${this.name} says: ${message}`);
      }
    }

    const john = new Person("John");
    john.greet("Hello TypeScript!"); // John says: Hello TypeScript!
    ```

3.  **Rozdíl mezi `interface` a `type` Aliasy**

    - Oba mohou definovat tvar objektu.
    - **`interface`:**
      - Lze je rozšířit pomocí `extends` (podobně jako třídy).
      - Podporují "declaration merging" – pokud definuješ `interface` se stejným názvem vícekrát, TypeScript je spojí dohromady. To `type` neumí.
      - Tradičně se preferují pro definování tvarů objektů a kontraktů pro třídy.
    - **`type`:**

      - Flexibilnější, mohou definovat aliasy pro primitivní typy, union typy, tuple typy atd.
      - Rozšiřují se pomocí průniků (`&`).
      - Často se používají pro typování funkcí nebo pro složitější typové kombinace.

    - **Kdy použít co (zjednodušené pravidlo pro začátek):**
      - Použij `interface`, když definuješ "tvar" objektu nebo kontrakt, který má třída implementovat.
      - Použij `type` pro cokoli jiného (uniony, aliasy pro primitivy, typy funkcí atd.). _Pozn.: V praxi se to může překrývat a záleží i na týmových konvencích._

    ```typescript
    // Rozšíření interface
    interface Animal {
      name: string;
    }
    interface Dog extends Animal {
      breed: string;
    }

    // Rozšíření type aliasu
    type Named = { name: string };
    type User = Named & { age: number };

    // Declaration merging (pouze u interface)
    interface Window {
      title: string;
    }
    interface Window {
      ts: any;
    } // Nyní má Window obě vlastnosti
    // type Window = { title: string };
    // type Window = { ts: any }; // Chyba: Duplicitní identifikátor 'Window'
    ```

4.  **Volitelné Vlastnosti (`?`)**

    - Pokud vlastnost v rozhraní nemusí být vždy přítomna, označíme ji otazníkem (`?`).

    ```typescript
    interface Configuration {
      baseUrl: string;
      timeout?: number; // timeout je volitelný
    }

    let config1: Configuration = { baseUrl: "http://example.com" }; // OK
    let config2: Configuration = { baseUrl: "http://test.com", timeout: 5000 }; // OK
    ```

5.  **Readonly Vlastnosti (`readonly`)**

    - Pokud chceme, aby vlastnost byla po vytvoření objektu neměnná, použijeme `readonly`.

    ```typescript
    interface UserProfile {
      readonly userId: number;
      email: string;
    }

    let profile: UserProfile = { userId: 123, email: "user@example.com" };
    profile.email = "new.user@example.com"; // OK
    // profile.userId = 456; // Chyba: Cannot assign to 'userId' because it is a read-only property.
    ```

**Praxe Dne:**

1.  **Definuj Rozhraní pro Data:**

    - Vytvoř `interface` s názvem `UserCredentials`. Mělo by vyžadovat vlastnosti `username` (typ `string`) a `password` (typ `string`).
    - Vytvoř `interface` s názvem `TestData`. Mělo by mít povinnou vlastnost `testName` (typ `string`) a volitelnou vlastnost `priority` (typ `number`).
    - Vytvoř několik objektů, které odpovídají těmto rozhraním, a přiřaď jim správný typ (např. `let creds: UserCredentials = { ... };`). Experimentuj s chybějícími nebo přebytečnými vlastnostmi, abys viděl chyby TypeScriptu.

2.  **Implementuj Rozhraní ve Třídě:**

    - Vytvoř `interface` s názvem `ILoginPageActions`. Mělo by definovat signatury metod:
      - `fillUsername(username: string): void;`
      - `fillPassword(password: string): void;`
      - `clickLoginButton(): void;`
    - Vezmi (nebo vytvoř novou velmi jednoduchou) třídu `LoginPage`.
    - Deklaruj, že `LoginPage` implementuje `ILoginPageActions` (`class LoginPage implements ILoginPageActions { ... }`).
    - Doplň do třídy `LoginPage` metody požadované rozhraním (stačí zatím jen `console.log` uvnitř metod, např. `console.log(\`Filling username: ${username}\`);`).
    - Vytvoř instanci `LoginPage` a zavolej její metody.

3.  **Použij Rozhraní pro Typování Parametrů Funkcí:**

    - Napiš funkci `processTestData`, která přijímá jeden parametr typu `TestData` (rozhraní z kroku 1). Uvnitř funkce vypiš název testu a pokud je priorita definována, vypiš i ji.
    - Zavolej tuto funkci s různými objekty `TestData` (některé s prioritou, některé bez).

4.  **Experimentuj s `readonly`:**
    - Uprav `interface UserCredentials` tak, aby `username` bylo `readonly`. Zkus po vytvoření objektu `UserCredentials` změnit jeho `username` a sleduj chybu.

**Cíl Dne:**

- **Pochopit**, co jsou rozhraní a proč jsou v TypeScriptu (a tedy i v našem budoucím frameworku) tak důležitá.
- **Umět definovat** rozhraní pro popis struktury dat.
- **Vědět, jak implementovat** rozhraní ve třídě a co to znamená.
- **Rozumět** základním rozdílům mezi `interface` a `type` a kdy preferovat `interface`.
- **Používat** volitelné (`?`) a `readonly` modifikátory.

Rozhraní jsou stavebním kamenem pro dobře navržené systémy. V kontextu testovacího frameworku je budeme používat neustále – pro definování Page Objectů, testovacích dat, konfigurace, očekávaných struktur API odpovědí atd.

Dej mi vědět, až budeš mít úkoly hotové, nebo pokud narazíš na jakékoli nejasnosti. Jdeme na to!
