Perfektní, jsme ve finále našeho 3týdenního intenzivního plánu! Dnes se zaměříme na nástroje, které nám pomohou udržet náš kód čistý, konzistentní a kvalitní, což je nezbytné pro dlouhodobou udržitelnost frameworku. Poté provedeme rekapitulaci a podíváme se, jak pokračovat dál.

**Den 15: Linting, Formátování & Shrnutí**

**Proč je Kvalita Kódu Důležitá?**

- **Čitelnost:** Kód čteme mnohem častěji, než ho píšeme. Čistý a konzistentní kód je snazší pochopit pro ostatní členy týmu i pro tebe v budoucnu.
- **Údržba:** Snadněji se hledají a opravují chyby, snadněji se přidává nová funkcionalita.
- **Prevence Chyb:** Některé nástroje (linters) dokáží odhalit potenciální logické chyby nebo problematické vzory ještě před spuštěním kódu.
- **Konzistence:** V týmu je důležité, aby všichni psali kód podobným stylem. Nástroje toto pomáhají automatizovat.

**Teorie Dne:**

1.  **Linting s ESLint:**

    - **Co to je?** Statický analyzátor kódu (linter). Prochází tvůj kód _bez spuštění_ a hledá problematické vzory, potenciální chyby, nekonzistence ve stylu a nedodržování best practices.
    - **Proč ESLint?** Je to de facto standard pro linting JavaScriptu a TypeScriptu. Je vysoce konfigurovatelný a rozšiřitelný pomocí pluginů.
    - **Jak funguje?** Používá sadu _pravidel_ (rules). Každé pravidlo kontroluje specifický aspekt kódu (např. nepoužité proměnné, použití `var` místo `let`/`const`, správné použití `async/await`, konzistence v pojmenování).
    - **Konfigurace:** Obvykle pomocí souboru `.eslintrc.js` (doporučeno, protože umožňuje JavaScript logiku) nebo `.eslintrc.json`. Zde definuješ:
      - `parser`: Jaký parser použít pro analýzu kódu (pro TypeScript: `@typescript-eslint/parser`).
      - `plugins`: Rozšíření s dalšími pravidly (pro TypeScript: `@typescript-eslint/eslint-plugin`).
      - `extends`: Základní sady doporučených pravidel, ze kterých vycházíš (např. `eslint:recommended`, `plugin:@typescript-eslint/recommended`).
      - `rules`: Jemné doladění – zapnutí/vypnutí konkrétních pravidel nebo změna jejich úrovně (např. `"error"`, `"warn"`, `"off"`).
    - **Příklad `.eslintrc.js`:**
      ```javascript
      module.exports = {
        root: true, // Zastaví hledání konfigurace ve vyšších složkách
        parser: "@typescript-eslint/parser", // Parser pro TypeScript
        plugins: [
          "@typescript-eslint", // Plugin s TS pravidly
        ],
        extends: [
          "eslint:recommended", // Základní ESLint pravidla
          "plugin:@typescript-eslint/recommended", // Doporučená TS pravidla
          // 'plugin:prettier/recommended', // Integrace s Prettier (viz níže)
        ],
        env: {
          node: true, // Povolí globální proměnné Node.js (např. process)
          es2021: true, // Povolí moderní ES syntaxi
        },
        parserOptions: {
          ecmaVersion: 12,
          sourceType: "module", // Používáme ES6 moduly
        },
        rules: {
          // Zde můžeš přepsat nebo přidat vlastní pravidla
          "no-unused-vars": "off", // Vypneme základní pravidlo (použijeme TS verzi)
          "@typescript-eslint/no-unused-vars": [
            "warn",
            { argsIgnorePattern: "^_" },
          ], // Varovat u nepoužitých proměnných (ignorovat ty začínající _)
          "@typescript-eslint/no-explicit-any": "warn", // Varovat při použití 'any'
          "no-console": process.env.NODE_ENV === "production" ? "warn" : "off", // Zakázat console.log v produkci
          // ... další pravidla podle potřeby
        },
      };
      ```

2.  **Formátování s Prettier:**

    - **Co to je?** Nástroj pro automatické formátování kódu ("opinionated code formatter"). Nezajímá ho ani tak logika kódu, jako jeho _vzhled_ (odsazení, délka řádků, uvozovky, středníky atd.).
    - **Proč Prettier?** Odstraňuje nekonečné debaty o stylu kódu v týmu. Nastaví se jednou a pak automaticky zajišťuje konzistentní formátování napříč celým projektem. Šetří čas a mentální energii.
    - **Konfigurace:** Soubor `.prettierrc` (JSON) nebo `.prettierrc.js`. Možností nastavení je záměrně málo, protože je "opinionated".
    - **Příklad `.prettierrc`:**
      ```json
      {
        "semi": true, // Používat středníky na konci řádků
        "singleQuote": true, // Používat jednoduché uvozovky pro stringy
        "trailingComma": "es5", // Čárka na konci v objektech a polích (kde je to v ES5 platné)
        "printWidth": 80, // Maximální délka řádku (snaží se dodržet)
        "tabWidth": 2, // Šířka tabulátoru (pro odsazení)
        "arrowParens": "always" // Vždy závorky kolem parametrů arrow funkcí (např. (x) => ...)
      }
      ```
    - **Integrace s ESLint:** Často se používají společně. Prettier se stará o formátování, ESLint o kvalitu kódu a potenciální chyby. Aby si nelezly do zelí (např. ESLint chce dvojité uvozovky, Prettier jednoduché), používají se:
      - `eslint-config-prettier`: Vypne v ESLintu všechna pravidla, která jsou konfliktní s Prettierem (pravidla týkající se čistě formátování).
      - `eslint-plugin-prettier`: Spouští Prettier jako pravidlo ESLintu a hlásí rozdíly ve formátování jako ESLint chyby. (Často doporučeno přidat `plugin:prettier/recommended` do `extends` v `.eslintrc.js`, což aplikuje obojí).

3.  **`package.json` a Skripty:**

    - Soubor `package.json` je srdcem každého Node.js projektu. Obsahuje metadata (název, verze), závislosti (`dependencies`, `devDependencies`) a také sekci `scripts`.
    - **`scripts`:** Umožňují definovat vlastní příkazy, které lze spouštět pomocí `npm run <nazev_skriptu>` (nebo `yarn <nazev_skriptu>`).
    - **Příklad skriptů pro linting a formátování:**
      ```json
      // package.json
      {
        // ... ostatní sekce ...
        "scripts": {
          "test": "playwright test", // Spustí Playwright testy
          "lint": "eslint . --ext .ts --report-unused-disable-directives --max-warnings 0", // Spustí ESLint na všechny .ts soubory
          "lint:fix": "eslint . --ext .ts --fix", // Spustí ESLint a pokusí se automaticky opravit problémy
          "format": "prettier --write \"src/**/*.ts\" \"tests/**/*.ts\" \"*.{js,ts,json}\"", // Spustí Prettier a přepíše soubory podle pravidel
          "format:check": "prettier --check \"src/**/*.ts\" \"tests/**/*.ts\" \"*.{js,ts,json}\"" // Zkontroluje formátování (užitečné pro CI)
        }
        // ... dependencies a devDependencies ...
      }
      ```

4.  **Integrace s Editorem (např. VS Code):**
    - Nainstaluj rozšíření "ESLint" a "Prettier - Code formatter".
    - Nakonfiguruj VS Code (v `settings.json`), aby používal Prettier jako výchozí formátovač a aby formátoval kód při uložení (`"editor.formatOnSave": true`). ESLint bude automaticky zobrazovat chyby a varování přímo v kódu.

**Nástroje (Instalace):**

Otevři terminál v kořenové složce projektu a spusť:

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier
# nebo pomocí yarn:
# yarn add --dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier
```

**Praxe Dne:**

1.  **Nastav Konfiguraci:**
    - Vytvoř soubory `.eslintrc.js` a `.prettierrc` v kořeni projektu s obsahem podobným příkladům výše. Uprav si pravidla podle preferencí, ale pro začátek stačí doporučené sady.
    - **Důležité:** Pokud chceš integraci Prettier s ESLint, přidej `"plugin:prettier/recommended"` na konec pole `extends` v `.eslintrc.js`.
2.  **Přidej Skripty:**
    - Otevři `package.json` a do sekce `scripts` přidej skripty `lint`, `lint:fix`, `format`, `format:check` (viz příklad výše). Uprav cesty k souborům (`"src/**/*.ts"` atd.) podle struktury tvého projektu.
3.  **Spusť Nástroje:**
    - Otevři terminál v kořeni projektu.
    - Spusť linting: `npm run lint` (nebo `yarn lint`). Podívej se na výstup. ESLint pravděpodobně najde nějaké problémy nebo varování (nepoužité proměnné, chybějící typy, formátování pokud nemáš integraci s Prettier atd.).
    - Zkus automatickou opravu: `npm run lint:fix`. Některé problémy (hlavně stylové) by měly zmizet.
    - Spusť formátování: `npm run format`. Projdi si změněné soubory (pokud nějaké byly) a podívej se, jak Prettier upravil jejich vzhled.
4.  **(Volitelné):** Nastav si VS Code (nebo jiný editor) pro automatické formátování při uložení a zobrazování lint chyb.

**Shrnutí 3 Týdnů:**

Wow, uběhlo to rychle! Pojďme si stručně zrekapitulovat, co jsme za ty 3 týdny probrali:

- **Základy TypeScriptu:** Typový systém, základní typy, proměnné, funkce, pole, objekty, řídící struktury. Pochopili jsme výhody TS oproti JS pro větší projekty.
- **OOP v TS:** Třídy, konstruktory, vlastnosti, metody, modifikátory přístupu (`public`, `private`, `protected`), klíčové slovo `this`.
- **Rozhraní (`interface`):** Definování kontraktů a tvarů objektů, rozdíl oproti `type`, implementace ve třídách. Klíčové pro typování dat a API.
- **Pokročilé OOP:** Dědičnost (`extends`, `super()`), přepisování metod (`override`), základní polymorfismus, abstraktní třídy a metody (`abstract`). Základ pro `BasePage` a znovupoužitelnost.
- **Asynchronní Programování:** Callbacky (historie), Promises (`.then`, `.catch`), a hlavně `async/await` pro čitelnou práci s asynchronními operacemi (naprosto zásadní pro Playwright).
- **Moduly:** Organizace kódu do souborů pomocí `import`/`export`. Klíčové pro udržitelnost.
- **Generika (`<T>`):** Psaní flexibilního a typově bezpečného kódu, který pracuje s různými typy (utility, API wrappery).
- **Page Object Model (POM):** Základní návrhový vzor pro UI automatizaci – oddělení logiky testu od interakce se stránkou. Lokátory, akce, `BasePage`.
- **SOLID Principy:** SRP, OCP, LSP, ISP, DIP – vodítka pro psaní čistého, flexibilního a udržovatelného kódu.
- **Další Návrhové Vzory:** Factory (vytváření objektů bez znalosti konkrétního typu), Builder (konstrukce komplexních objektů).
- **Architektura Frameworku:** Správa konfigurace, utility funkce, reporting (Playwright reportéry, trace).
- **Kvalita Kódu:** Linting (ESLint) a formátování (Prettier).

Prošel jsi obrovský kus cesty od manuálních zkušeností k pochopení základních principů a nástrojů pro tvorbu robustních testovacích frameworků v TypeScriptu s Playwright!

**Cíl Dne:**

- **Pochopit** význam lintingu a formátování pro kvalitu kódu.
- **Umět nastavit** a používat ESLint a Prettier v TypeScript projektu.
- **Definovat** a používat npm skripty pro spouštění těchto nástrojů.
- **Zrekapitulovat** klíčové koncepty naučené během 3 týdnů.
- **Získat přehled** o možných dalších krocích ve studiu.
