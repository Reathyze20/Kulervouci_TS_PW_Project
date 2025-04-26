# Zvládnutí konfigurace Playwright (playwright.config.ts): Komplexní průvodce

## 1. Úvod

Konfigurační soubor `playwright.config.ts` představuje centrální řídicí centrum pro spouštění testů pomocí frameworku Playwright v projektech využívajících TypeScript. Jeho správné nastavení je klíčové pro přizpůsobení průběhu testů, správu různých testovacích prostředí a efektivní integraci do CI/CD pipeline.

- **Výchozí umístění**: Kořenový adresář projektu.
- **Použití jiného souboru**: `npx playwright test --config=my.config.ts`.

Pochopení možností a struktury tohoto souboru je nezbytné pro plné využití potenciálu Playwright.

---

## 2. Základní možnosti konfigurace (Globální nastavení)

### `testDir`

- **Účel**: Určuje kořenový adresář pro testovací soubory.
- **Výchozí hodnota**: `'tests'`.
- **Význam**: Nesprávně zadaná cesta znamená, že nebudou nalezeny žádné testy.

### `testMatch` / `testIgnore`

- **Účel**: Glob vzory pro zahrnutí/vyloučení souborů.
- **Výchozí hodnoty**:
  - `testMatch`: `**/*.@(spec|test).?(c|m)[jt]s?(x)`.
  - `testIgnore`: `**/node_modules/**`.

### `timeout`

- **Účel**: Výchozí časový limit (ms) pro jednotlivé testovací kroky.
- **Výchozí hodnota**: `30 000 ms`.
- **Kontext**: Klíčové pro vyvážení rychlosti a stability testů.

### `globalTimeout`

- **Účel**: Maximální čas (ms) pro celou testovací sadu.
- **Výchozí hodnota**: `0` (deaktivováno).

### `fullyParallel`

- **Účel**: Paralelní spouštění testovacích souborů.
- **Výchozí hodnota**: `false` (historicky), často `true` v novějších verzích.

### `forbidOnly`

- **Účel**: Zabránění commitování `.only()` testů.
- **Výchozí hodnota**: `false` (lokálně), `true` (v CI).

### `retries`

- **Účel**: Počet opakování selhávajících testů.
- **Výchozí hodnota**: `0` (lokálně), `2` (v CI).

### `workers`

- **Účel**: Maximální počet paralelních worker procesů.
- **Výchozí hodnota**: Heuristika (např. polovina jader CPU).

### `outputDir`

- **Účel**: Adresář pro ukládání artefaktů testů.
- **Výchozí hodnota**: `'test-results'`.

### `snapshotDir`

- **Účel**: Adresář pro vizuální regresní testování.
- **Výchozí hodnota**: `snapshots` vedle testovacího souboru.

---

## 3. Konfigurace reportérů (`reporter`)

### Vestavěné reportéry

- **`list`**: Výchozí, detailní výstup v reálném čase.
- **`line`**: Minimální výstup, jedna řádka na test.
- **`dot`**: Stručný výstup pro velké množství testů.
- **`html`**: Generuje HTML report.
- **`json`**: Výstup ve formátu JSON.
- **`junit`**: Výstup ve formátu JUnit XML.
- **`github`**: Anotace pro GitHub Actions.

### Příklad konfigurace

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  reporter: [
    "list",
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "results.xml" }],
  ],
});
```

---

## 4. Globální nastavení testů (`use`)

### Možnosti prohlížeče a kontextu

- **`browserName`**: `'chromium'`, `'firefox'`, `'webkit'`.
- **`headless`**: `true` (výchozí), `false` (pro ladění).
- **`viewport`**: `{ width: number, height: number }`.

### Síť a navigace

- **`baseURL`**: Základní URL pro testy.
- **`extraHTTPHeaders`**: Hlavičky pro HTTP požadavky.

### Artefakty

- **`screenshot`**: `'on'`, `'off'`, `'only-on-failure'`.
- **`video`**: `'on'`, `'off'`, `'retain-on-failure'`.
- **`trace`**: `'on'`, `'off'`, `'retain-on-failure'`.

---

## 5. Definování projektů (`projects`)

### Příklad konfigurace

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  projects: [
    {
      name: "Chromium Desktop",
      use: { browserName: "chromium", viewport: { width: 1280, height: 720 } },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
```

---

## 6. Integrace s vývojovými servery (`webServer`)

### Příklad konfigurace

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: "http://localhost:3000" },
});
```

---

## 7. Pokročilá konfigurace

### `globalSetup` / `globalTeardown`

- **Účel**: Spuštění přípravných nebo úklidových operací.
- **Příklad**: Naplnění databáze testovacími daty.

### `expect`

- **timeout**: Výchozí časový limit pro ověření (`5000 ms`).

---

## 8. Závěr

Konfigurační soubor `playwright.config.ts` je klíčovým nástrojem pro efektivní automatizované testování. Doporučené postupy:

- Udržujte konfiguraci přehlednou.
- Optimalizujte paralelismus a artefakty podle prostředí.
- Využívejte proměnné prostředí pro citlivá data.

Dobře strukturovaný konfigurační soubor zajišťuje robustní a udržitelný testovací setup.
