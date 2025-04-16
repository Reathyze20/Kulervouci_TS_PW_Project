### **Navrhovaný 3týdenní Intenzivní Učební Plán**

Tento plán je navržen tak, aby byl intenzivní a pokryl klíčové oblasti. Každý den kombinuje teorii a praxi. Flexibilita je možná – pokud některý den budeš potřebovat více času na určitý koncept, přizpůsobíme se.

---

#### **Týden 1: Základy TypeScriptu a Programátorské Myšlení**

**Den 1: Úvod, Nastavení & Základní Typy**
- **Teorie:**
  - Proč TypeScript v automatizaci? Výhody oproti JS. Transpilace.
  - Základní typy: `string`, `number`, `boolean`, `null`, `undefined`, `any`, `unknown`, `void`.
  - Deklarace proměnných: `let`, `const`.
- **Nástroje:**
  - Instalace Node.js, npm/yarn.
  - Nastavení základního TS projektu (`tsc --init` -> `tsconfig.json` – klíčové volby).
  - Instalace Playwright.
- **Praxe:**
  - Napsat jednoduché TS skripty, experimentovat s typy.
  - Zkompilovat a spustit.
  - Spustit ukázkový Playwright test v TS.
- **Cíl:** Mít funkční prostředí, rozumět základní syntaxi a typům.

**Den 2: Funkce a Základní Datové Struktury**
- **Teorie:**
  - Definice funkcí (deklarace vs. expression), typování parametrů a návratových hodnot.
  - Arrow funkce (`=>`).
  - Pole (`Array<T>` nebo `T[]`), základní metody polí (`push`, `pop`, `map`, `filter`).
  - Tuply (`[string, number]`).
- **Praxe:**
  - Psát funkce pro jednoduché úkoly (např. kalkulace, formátování stringů).
  - Práce s poli – vytvoření, přidání/odebrání prvků, transformace.
- **Cíl:** Schopnost psát a typovat funkce, pracovat se základními kolekcemi dat.

**Den 3: Řídící Struktury & Úvod do Objektů**
- **Teorie:**
  - Podmínky (`if/else`, `switch`), cykly (`for`, `while`, `for...of`, `for...in`).
  - Základní objekty v JS/TS (literály `{}`), přístup k vlastnostem.
- **Praxe:**
  - Psát skripty využívající podmínky a cykly (např. iterace polem a filtrování).
  - Vytvářet jednoduché objekty pro reprezentaci dat (např. uživatelská data).
- **Cíl:** Ovládat tok programu, chápat základní strukturu objektů.

**Den 4: Úvod do OOP - Třídy a Základní Zapouzdření**
- **Teorie:**
  - Koncept tříd a objektů. Konstruktor.
  - Vlastnosti (properties) a metody. Modifikátory přístupu (`public`, `private`, `protected`).
  - `this` klíčové slovo.
- **Praxe:**
  - Vytvořit jednoduchou třídu (např. `User`, `LoginPage` – zatím velmi zjednodušeně).
  - Vytvářet instance, volat metody, přistupovat k vlastnostem (respektovat modifikátory).
- **Cíl:** Pochopit základní syntaxi a smysl tříd a zapouzdření.

**Den 5: Rozhraní (Interfaces)**
- **Teorie:**
  - Co jsou rozhraní? Definování "kontraktu" pro objekty a třídy (`implements`).
  - Rozdíl mezi `interface` a `type` aliasy (kdy použít co).
  - Volitelné a `readonly` vlastnosti.
- **Praxe:**
  - Definovat rozhraní pro data (např. `TestData`, `UserCredentials`).
  - Implementovat rozhraní ve třídě.
  - Použít rozhraní pro typování objektů a parametrů funkcí.
- **Cíl:** Chápat roli rozhraní v definování struktur a kontraktů.

---

#### **Týden 2: Pokročilý TypeScript a Základy Frameworku**

**Den 6: Pokročilé OOP - Dědičnost a Základní Polymorfismus**
- **Teorie:**
  - Dědičnost (`extends`), `super()` volání.
  - Přepisování metod (overriding).
  - Základní myšlenka polymorfismu.
  - Abstraktní třídy a metody (`abstract`).
- **Praxe:**
  - Vytvořit základní `BasePage` třídu a od ní odvodit konkrétní stránky (např. `LoginPage`, `HomePage`).
  - Implementovat společnou funkcionalitu v `BasePage`.
- **Cíl:** Rozumět principům dědičnosti a jak je využít pro znovupoužití kódu.

**Den 7: Asynchronní Programování - Promises a Async/Await**
- **Teorie:**
  - Proč je asynchronní programování v testování klíčové (čekání na UI).
  - Callbacky (krátce, pro pochopení historie).
  - Promises (`.then()`, `.catch()`, `Promise.all()`).
  - Syntaktický cukr `async`/`await`.
- **Praxe:**
  - Přepsat synchronní Playwright akce na `async`/`await`.
  - Správně čekat na dokončení akcí.
  - Zpracovat potenciální chyby v asynchronním kódu.
- **Cíl:** Jistě používat `async`/`await` pro práci s Playwright API.

**Den 8: Moduly a Jmenné Prostory (Namespaces)**
- **Teorie:**
  - ES6 moduly (`import`/`export`).
  - Výhody modularity (organizace kódu, znovupoužitelnost).
  - Jmenné prostory (`namespace`) - kdy (a jestli vůbec) je použít v moderním TS.
- **Praxe:**
  - Rozdělit dosavadní kód do logických modulů (souborů).
  - Používat `import`/`export` pro sdílení kódu mezi soubory.
- **Cíl:** Strukturovat kód do logických, spravovatelných celků.

**Den 9: Generika (Generics)**
- **Teorie:**
  - Co jsou generika? Proč jsou užitečná?
  - Psaní generických funkcí, tříd a rozhraní.
- **Praxe:**
  - Vytvořit jednoduchou generickou funkci (např. pro práci s poli různých typů).
  - Zvážit, kde by se generika mohla hodit ve frameworku.
- **Cíl:** Pochopit sílu generik pro psaní flexibilního a typově bezpečného kódu.

**Den 10: Úvod do Návrhových Vzorů - Page Object Model (POM)**
- **Teorie:**
  - Detailní rozbor POM. Proč? Výhody (čitelnost, údržba, znovupoužitelnost).
  - Anatomie Page Objectu (selektory, metody reprezentující akce).
  - Vztah k `BasePage`.
- **Praxe:**
  - Refaktorovat dosavadní kód do solidní POM struktury.
  - Vytvořit několik Page Objectů pro jednoduchou testovací aplikaci.
  - Napsat testy využívající tyto Page Objecty.
- **Cíl:** Být schopen navrhnout a implementovat základní POM.

---

#### **Týden 3: Stavba Frameworku a SOLID Principy**

**Den 11: SOLID Principy - SRP a OCP**
- **Teorie:**
  - Single Responsibility Principle (SRP) a Open/Closed Principle (OCP).
  - Jak je aplikovat na Page Objecty, utility, testy.
- **Praxe:**
  - Zrevidovat stávající POM a kód.
  - Identifikovat porušení SRP a OCP.
  - Refaktorovat kód tak, aby lépe odpovídal těmto principům.
- **Cíl:** Rozumět a začít aplikovat první dva SOLID principy.

**Den 12: SOLID Principy - LSP, ISP, DIP**
- **Teorie:**
  - Liskov Substitution Principle, Interface Segregation Principle, Dependency Inversion Principle.
  - Příklady z testování (např. různé typy WebDriverů/Browserů, různé typy reportérů, konfigurace).
- **Praxe:**
  - Diskuse a hledání příkladů aplikace těchto principů.
- **Cíl:** Mít povědomí o všech SOLID principech a jejich relevanci.

**Den 13: Další Návrhové Vzory - Factory, Builder**
- **Teorie:**
  - Factory Method/Abstract Factory.
  - Builder (např. pro komplexní vytváření testovacích dat nebo konfigurací).
- **Praxe:**
  - Navrhnout jednoduchou Factory pro Playwright `BrowserContext`.
  - Navrhnout Builder pro vytváření objektu s testovacími daty.
- **Cíl:** Pochopit a umět použít Factory a Builder vzory.

**Den 14: Architektura Frameworku - Konfigurace, Utility, Reporting**
- **Teorie:**
  - Správa konfigurace (environmentální proměnné, konfigurační soubory).
  - Utility/Helper funkce.
  - Základní koncepty reportingu v Playwright.
- **Praxe:**
  - Implementovat načítání základní konfigurace.
  - Vytvořit jednoduchou utility funkci.
  - Nakonfigurovat základní HTML reportér v Playwright.
- **Cíl:** Rozumět klíčovým komponentám frameworku mimo samotné testy a Page Objecty.

**Den 15: Linting, Formátování & Shrnutí**
- **Teorie:**
  - Proč je kvalita kódu důležitá? ESLint, Prettier.
  - Krátce o `package.json` a skriptech (`npm run ...`).
- **Nástroje:**
  - Nastavit ESLint a Prettier v projektu.
- **Praxe:**
  - Spustit linting a formátování na stávajícím projektu.
  - Opravit nalezené problémy.
- **Shrnutí:** Rekapitulace klíčových konceptů z celých 3 týdnů.
- **Cíl:** Nastavit nástroje pro kvalitu kódu, zrekapitulovat naučené.

---

### **Ověření Startovních Znalostí (Krátký Kvíz)**

Abych lépe pochopil tvůj současný základ, zkus prosím odpovědět na pár otázek. Nemusíš se bát, nejde o známky, jen o nastavení správného tempa.

1. Co si představíš pod pojmem "proměnná" v programování? K čemu slouží?
2. Jaký je základní účel "funkce" nebo "metody"?
3. Můžeš stručně popsat, co dělá podmínka `if/else`?
4. Setkal/a ses někdy s pojmem "objektově orientované programování" (OOP)? Pokud ano, co si pod tím vybavíš (i kdyby jen mlhavě)?

Odpověz naprosto přirozeně a svými slovy.

---

### **Začínáme: Den 1 - Úvod, Nastavení & Základní Typy**

Tak pojďme na to! Dnešním cílem je připravit si půdu pod nohama – nainstalovat potřebné nástroje a seznámit se s úplnými základy TypeScriptu.

**Teorie:**
- **TypeScript (TS):** Představ si ho jako JavaScript (JS), ale s "návodem" navíc. Tím návodem jsou **typy**.
- **Transpilace:** Překlad TypeScriptu do JavaScriptu.
- **Základní Typy:** `string`, `number`, `boolean`, `null`, `undefined`, `any`, `unknown`, `void`.
- **Deklarace Proměnných:** `let`, `const`.

**Praktická Část - Nastavení Prostředí:**
1. Nainstaluj Node.js.
2. Inicializuj npm projekt.
3. Nainstaluj TypeScript a Playwright.
4. Vytvoř `tsconfig.json` a nastav klíčové volby.

**Tvůj První Úkol (Den 1):**
1. Proveď všechny kroky instalace a nastavení.
2. Vytvoř soubor `hello.ts` a napiš jednoduchý kód.
3. Zkompiluj a spusť kód pomocí `tsc` a `node`.
4. Vyzkoušej `ts-node` a experimentuj s chybami.

Až budeš mít hotovo, nebo pokud narazíš na jakýkoliv problém, dej mi vědět. Jsi na správné cestě!


