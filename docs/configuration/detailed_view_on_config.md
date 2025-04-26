````markdown
# Komplexní průvodce konfigurací Playwright (playwright.config.ts)

## 1. Úvod do konfigurace Playwright

Konfigurace testů v Playwright je klíčovým prvkem pro efektivní a spolehlivé automatizované testování webových aplikací. Centrálním bodem této konfigurace je soubor `playwright.config.ts` (nebo `playwright.config.js`), který slouží jako řídicí centrum pro definování toho, jak Playwright testy vyhledává, spouští a jaké výstupy generuje.¹ Správné nastavení tohoto souboru je zásadní pro konzistenci, údržbu a škálovatelnost testovací sady.

### 1.1 Struktura souboru a nastavení

Typicky se konfigurační soubor nachází v kořenovém adresáři projektu a je automaticky generován při inicializaci Playwright projektu pomocí příkazu `npm init playwright@latest`.³ Jedná se o standardní modul Node.js, který exportuje konfigurační objekt nebo funkci vracející tento objekt.

Pro zajištění typové bezpečnosti a lepší podpory automatického doplňování kódu v moderních editorech (jako je VS Code) se důrazně doporučuje používat pomocnou funkci `defineConfig` importovanou z `@playwright/test`, zejména při práci s TypeScriptem.¹

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Konfigurační volby zde...
});
```
````

### 1.2 TypeScript vs. JavaScript

Ačkoli většina příkladů v oficiální dokumentaci a v tomto průvodci používá TypeScript ¹, principy konfigurace jsou naprosto identické i pro JavaScriptové projekty. Hlavním rozdílem je absence typových anotací v JavaScriptu.¹⁵ Funkce `defineConfig` poskytuje výhody i v JavaScriptu díky JSDoc anotacím, které umožňují editorům poskytovat lepší našeptávání.

```javascript
// playwright.config.js
// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = defineConfig({
  // Konfigurační volby zde...
});

module.exports = config;
```

## 2. Základní konfigurace na nejvyšší úrovni (TestConfig)

Volby na nejvyšší úrovni konfiguračního souboru, označované jako `TestConfig`, definují globální chování celého testovacího běhu.² Tyto vlastnosti se nacházejí přímo v exportovaném objektu, mimo blok `use`.

### 2.1 Definování struktury testů

Tyto volby určují, kde Playwright hledá testovací soubory a které z nich má zahrnout nebo vyloučit.

- `testDir`: Určuje kořenový adresář, ve kterém Playwright rekurzivně hledá testovací soubory. Cesta je relativní k umístění konfiguračního souboru.¹
  - Příklad: `testDir: './tests'`
- `testMatch`: Definuje glob vzory nebo regulární výrazy, které musí soubory splňovat, aby byly považovány za testovací soubory. Playwright porovnává absolutní cesty souborů. Výchozí hodnota je `**/*.@(spec|test).?(c|m)[jt]s?(x)`, což zahrnuje soubory končící na `.spec.js`, `.test.ts`, `.spec.mjs` atd..²
  - Příklad: `testMatch: '**/e2e/**/*.spec.ts'`
- `testIgnore`: Definuje glob vzory nebo regulární výrazy pro soubory nebo adresáře, které mají být při hledání testů ignorovány. Opět se porovnávají absolutní cesty.²
  - Příklad: `testIgnore: ['**/node_modules/**', '**/test-utils/**']`

Precizní kontrola nad tím, které soubory jsou spouštěny, je zásadní pro organizaci testů. Projekty často obsahují různé typy testů (např. `unit`, `integrační`, `end-to-end`) nebo pomocné soubory v rámci adresářové struktury testů. Bez `testMatch` a `testIgnore` by Playwright mohl zkusit spustit soubory, které nejsou zamýšleny jako testy, nebo by mohl zahrnout nechtěné soubory. Tyto volby umožňují vývojářům přesně definovat, co představuje spustitelný testovací soubor pro daný kontext spuštění, čímž předcházejí chybám a zajišťují, že jsou spuštěny pouze relevantní testy.²

### 2.2 Řízení strategie spouštění

Tyto volby ovlivňují paralelismus, opakování testů a časové limity.

- `timeout`: Nastavuje maximální čas v milisekundách pro provedení každého jednotlivého testu. Tento čas zahrnuje samotnou testovací funkci, přípravu a úklid fixtur a `beforeEach`/`afterEach` hooky. Výchozí hodnota je `30000` ms (30 sekund).¹
  - Příklad: `timeout: 60 * 1000 // 1 minuta`
- `globalTimeout`: Nastavuje maximální čas v milisekundách pro celý testovací běh. Používá se k zabránění nekonečně běžícím procesům, zejména v CI prostředích. Pokud je tento čas překročen, běh je ukončen.⁵
  - Příklad: `globalTimeout: 30 * 60 * 1000 // 30 minut`
- `fullyParallel`: Logická hodnota (`boolean`), která povoluje paralelní spouštění testů uvnitř jednotlivých souborů. Standardně Playwright spouští soubory paralelně, ale testy uvnitř jednoho souboru běží sekvenčně. Zapnutí této volby může výrazně zrychlit běh, ale vyžaduje, aby testy byly plně izolované.¹
  - Příklad: `fullyParallel: true`
- `forbidOnly`: Logická hodnota, často nastavená na `!!process.env.CI`, která způsobí selhání testovacího běhu, pokud je v kódu nalezen `test.only` nebo `describe.only`. Tím se zabraňuje nechtěnému commitování kódu, který spouští pouze podmnožinu testů.¹
  - Příklad: `forbidOnly: !!process.env.CI`
- `retries`: Počet pokusů o opakované spuštění neúspěšného testu. Používá se pro zvládání občasně selhávajících (flaky) testů, zejména v CI. V CI se často nastavuje na `1` nebo `2`, zatímco lokálně na `0`.¹
  - Příklad: `retries: process.env.CI ? 2 : 0`
- `workers`: Maximální počet paralelních worker procesů, které Playwright použije pro spouštění testů. Může být nastaveno jako číslo nebo jako procento logických jader CPU (např. `'50%'`). Výchozí hodnota je polovina logických jader CPU. V CI se často omezuje na `1` nebo `2` pro předvídatelnost a správu zdrojů.¹
  - Příklad: `workers: process.env.CI ? 1 : '50%'`

Volby jako `fullyParallel`, `workers`, `retries` a `timeout` představují kompromis mezi rychlostí a stabilitou. Agresivní paralelismus (`fullyParallel: true`, vysoký počet `workers`) zrychluje provádění, ale může zvýšit soupeření o systémové zdroje a potenciálně zavést nestabilitu, pokud testy nejsou dokonale izolované nebo pokud testovaný systém nezvládá zátěž. Příliš časté používání `retries` může maskovat skutečné problémy v aplikaci nebo testech. Nastavení vhodných `timeout`ů zabraňuje zablokování běhu, ale musí brát v úvahu různou rychlost prostředí. Existence těchto odlišných ovládacích prvků (`fullyParallel` vs `workers`, `timeout` vs `globalTimeout`, `retries`) ukazuje, že Playwright poskytuje nástroje pro jemné doladění této rovnováhy na základě potřeb projektu, možností infrastruktury a tolerance k riziku nestability versus doba provádění.¹

### 2.3 Správa výstupů a artefaktů

Tyto volby řídí, kam se ukládají výsledky testů, snímky obrazovky, videa, trasování a snapshoty.

- `outputDir`: Adresář pro ukládání artefaktů testů, jako jsou snímky obrazovky, videa, trasování a výstupy reportérů (např. HTML report). Výchozí hodnota je `'test-results'`.¹
  - Příklad: `outputDir: 'playwright-artifacts/'`
- `snapshotDir`: Adresář, kde jsou ukládány soubory snapshotů (pro `toMatchSnapshot`, `toHaveScreenshot`). Výchozí hodnota je `<testDir>/__screenshots__`. Lze přizpůsobit pomocí `snapshotPathTemplate`.
- `snapshotPathTemplate`: Šablona řetězce pro řízení názvů a umístění souborů snapshotů. Umožňuje dynamické cesty založené na struktuře testovacích souborů, názvu projektu a argumentech předaných snapshot funkcím. Dostupné tokeny zahrnují `{testDir}`, `{testFilePath}`, `{testFileName}`, `{platform}`, `{projectName}`, `{testName}`, `{arg}`, `{ext}`.⁵
  - Příklad: `snapshotPathTemplate: '__snapshots__/{platform}/{projectName}/{testFilePath}/{arg}{ext}'`
- `ignoreSnapshots`: Logická hodnota (`boolean`), která určuje, zda mají být přeskočeny snapshotové aserce (`toMatchSnapshot`, `toHaveScreenshot`). Užitečné v CI, kde aktualizace snapshotů není žádoucí. Výchozí hodnota je `false`.⁵
  - Příklad: `ignoreSnapshots: !!process.env.CI`
- `updateSnapshots`: Řídí, kdy Playwright aktualizuje existující soubory snapshotů skutečnými výsledky z testovacího běhu. Možné hodnoty jsou `'all'` (aktualizovat všechny), `'none'` (neaktualizovat), `'missing'` (vytvořit nové, pokud chybí - výchozí), `'changed'` (aktualizovat pouze ty, které se neshodují).⁵ Lokálně se pro zamýšlené aktualizace často používá příznak `--update-snapshots` nebo hodnota `'all'`.
  - Příklad: `updateSnapshots: 'missing'`

### 2.4 Metadata a pojmenování

- `metadata`: Objekt pro přidání vlastních metadat (klíč-hodnota) do reportů. Užitečné pro přidání informací o prostředí, verzi atd..⁵
  - Příklad: `metadata: { environment: process.env.TEST_ENV || 'local', release: '1.5.0' }`
- `name`: Název pro konfiguraci testů, který bude viditelný v reportu a během provádění testů (pokud není přepsán `testProject.name`).⁵
  - Příklad: `name: 'E2E Regression Suite'`

### 2.5 Přehled základních voleb na nejvyšší úrovni

Následující tabulka shrnuje klíčové volby `TestConfig`:

| Volba                  | Typ                                               | Výchozí hodnota                                         | Stručný účel                                       |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| `testDir`              | string                                            | `'tests'` (pokud existuje) nebo aktuální adresář        | Adresář s testovacími soubory.                     |
| `timeout`              | number                                            | `30000` (30s)                                           | Časový limit pro jednotlivý test (v ms).           |
| `fullyParallel`        | boolean                                           | `false`                                                 | Povolit paralelní běh testů i uvnitř souborů.      |
| `forbidOnly`           | boolean                                           | `false`                                                 | Zakázat `test.only` v CI.                          |
| `retries`              | number                                            | `0`                                                     | Počet opakování neúspěšných testů.                 |
| `workers`              | number \| string                                  | Polovina logických jader CPU                            | Maximální počet paralelních workerů.               |
| `outputDir`            | string                                            | `'test-results'`                                        | Adresář pro artefakty (screenshoty, videa, trace). |
| `globalTimeout`        | number                                            | `0` (bez limitu)                                        | Časový limit pro celý testovací běh (v ms).        |
| `grep`                 | RegExp \| Array<RegExp>                           | `undefined`                                             | Filtr pro spuštění testů podle názvu.              |
| `grepInvert`           | RegExp \| Array<RegExp>                           | `undefined`                                             | Inverzní filtr pro vyloučení testů podle názvu.    |
| `testMatch`            | string \| RegExp \| Array<...>                    | `**/*.@(spec\|test).?(c\|m)[jt]s?(x)`                   | Vzory pro nalezení testovacích souborů.            |
| `testIgnore`           | string \| RegExp \| Array<...>                    | `**/node_modules/**`                                    | Vzory pro ignorování souborů/adresářů.             |
| `snapshotPathTemplate` | string                                            | `'{testDir}/__screenshots__/{testFilePath}/{arg}{ext}'` | Šablona pro cesty k souborům snapshotů.            |
| `updateSnapshots`      | `"all"` \| `"none"` \| `"missing"` \| `"changed"` | `"missing"`                                             | Kdy aktualizovat snapshoty.                        |
| `ignoreSnapshots`      | boolean                                           | `false`                                                 | Ignorovat snapshotové aserce.                      |
| `metadata`             | object                                            | `undefined`                                             | Vlastní metadata pro reporty.                      |
| `name`                 | string                                            | `undefined`                                             | Název konfigurace pro reporty.                     |

Tato tabulka slouží jako rychlý referenční průvodce pro základní volby řídící fundamentální aspekty testovacího běhu, než se ponoříme do detailnějších konfigurací jako `use` nebo `projects`.

## 3. Konfigurace testovacího prostředí pomocí `use` (TestOptions)

Objekt `use` je jednou z nejdůležitějších částí konfigurace. Obsahuje volby, které jsou předány do kontextu prohlížeče (`BrowserContext`) a stránky (`Page`), a definují tak prostředí pro každý jednotlivý test v rámci svého rozsahu platnosti.¹ Tyto volby jsou nejčastěji přepisovány na různých úrovních konfigurace (globální, projektová, souborová, testová).

### 3.1 Základní nastavení

- `baseURL`: Základní URL pro navigaci (např. `await page.goto('/')`) a síťové požadavky. Zjednodušuje práci s relativními cestami.¹
  - Příklad: `baseURL: 'http://localhost:4200'`
- `browserName`: Určuje jádro prohlížeče (`'chromium'`, `'firefox'`, `'webkit'`). Obvykle se nastavuje v rámci `projects`.⁴
  - Příklad: `browserName: 'firefox'`
- `channel`: Specifikuje distribuční kanál prohlížeče (např. `'chrome'`, `'msedge'`, `'chrome-beta'`, `'msedge-dev'`). Umožňuje testovat proti konkrétním verzím prohlížečů Chrome nebo Edge.⁴
  - Příklad: `channel: 'msedge-beta'`
- `headless`: Logická hodnota (`boolean`) pro spuštění prohlížeče v headless režimu (bez viditelného UI). Výchozí je `true`. Pro lokální ladění se často nastavuje na `false`.³
  - Příklad: `headless: process.env.CI ? true : false`
- `viewport`: Nastavuje velikost okna prohlížeče (šířka, výška). Použijte `null` pro deaktivaci emulace a použití skutečné velikosti okna.⁴
  - Příklad: `viewport: { width: 1280, height: 720 }`
- `deviceScaleFactor`: Emuluje poměr pixelů zařízení (device pixel ratio, DPR). Ovlivňuje vizuální hustotu stránky.⁴
  - Příklad: `deviceScaleFactor: 1.5`
- `isMobile`: Logická hodnota indikující emulaci mobilního zařízení (ovlivňuje meta viewport tag, standardně povoluje dotykové události). Není podporováno ve Firefoxu.⁴
  - Příklad: `isMobile: true`
- `hasTouch`: Logická hodnota specifikující podporu dotykových událostí.⁴
  - Příklad: `hasTouch: true`
- `userAgent`: Nastavuje vlastní řetězec user agent.⁴
  - Příklad: `userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)...'`

### 3.2 Artefakty a ladění

- `screenshot`: Konfiguruje automatické pořizování snímků obrazovky po každém testu (`'on'`, `'off'`, `'only-on-failure'`). Neocenitelné pro ladění selhání.⁴
  - Příklad: `screenshot: 'only-on-failure'`
- `trace`: Konfiguruje nahrávání podrobného trasování běhu testu (`'on'`, `'off'`, `'retain-on-failure'`, `'on-first-retry'`). Trasování obsahuje akce, síťové požadavky, logy konzole a další, což poskytuje komplexní pohled na průběh testu.¹
  - Příklad: `trace: 'retain-on-failure'`
- `video`: Konfiguruje automatické nahrávání videa z provádění testu (`'on'`, `'off'`, `'retain-on-failure'`, `'on-first-retry'`). Pomáhá vizuálně pochopit selhání.⁴
  - Příklad: `video: 'on-first-retry'`
- `launchOptions`: Objekt s dodatečnými volbami předávanými přímo metodě `browserType.launch()`. Umožňuje jemné řízení spouštění prohlížeče.⁴
  - Příklad: `launchOptions: { args: ['--disable-gpu'], slowMo: 250 }`

### 3.3 Chování kontextu a stránky

- `acceptDownloads`: Logická hodnota (`boolean`) pro automatické přijímání všech stahování iniciovaných během testu. Výchozí je `true`.⁴
  - Příklad: `acceptDownloads: false`
- `bypassCSP`: Logická hodnota (`boolean`) pro obejití Content Security Policy stránky. Může být užitečné, pokud CSP zasahuje do provádění testu.⁴
  - Příklad: `bypassCSP: true`
- `colorScheme`: Emuluje mediální vlastnost `prefers-color-scheme` (`'light'`, `'dark'`, `'no-preference'`, `null`) pro testování světlého/tmavého režimu.⁴
  - Příklad: `colorScheme: 'dark'`
- `extraHTTPHeaders`: Objekt pro přidání vlastních HTTP hlaviček ke každému požadavku z kontextu prohlížeče. Užitečné pro autentizaci, nastavení specifických typů obsahu atd..⁴
  - Příklad: `extraHTTPHeaders: { 'X-Test-Session': '...' }`
- `geolocation`: Objekt pro emulaci geolokace (`{ latitude, longitude, accuracy }`).⁴
  - Příklad: `geolocation: { latitude: 49.83, longitude: 18.28, accuracy: 50 }`
- `httpCredentials`: Objekt pro základní HTTP autentizaci (`{ username, password }`). Playwright automaticky zpracuje výzvy k autentizaci.⁴
  - Příklad: `httpCredentials: { username: 'test', password: 'pwd' }`
- `ignoreHTTPSErrors`: Logická hodnota (`boolean`) pro ignorování HTTPS chyb (např. neplatných certifikátů). Užitečné v testovacích prostředích s vlastními certifikáty.⁴
  - Příklad: `ignoreHTTPSErrors: true`
- `javaScriptEnabled`: Logická hodnota (`boolean`) pro povolení/zakázání JavaScriptu v kontextu prohlížeče. Výchozí je `true`.⁴
  - Příklad: `javaScriptEnabled: false`
- `locale`: Nastavuje locale prohlížeče (ovlivňuje `navigator.language`, hlavičku `Accept-Language`, formátování dat a čísel).¹
  - Příklad: `locale: 'cs-CZ'`
- `permissions`: Pole řetězců pro udělení specifických oprávnění prohlížeče (např. `'geolocation'`, `'notifications'`, `'camera'`, `'clipboard-read'`).⁴
  - Příklad: `permissions: ['geolocation']`
- `proxy`: Konfiguruje nastavení síťového proxy serveru (`{ server, bypass?, username?, password? }`).⁴
  - Příklad: `proxy: { server: 'socks5://myproxy.example.com:1080' }`
- `storageState`: Cesta k souboru nebo objekt obsahující stav úložiště (cookies, local storage). Často se používá k simulaci přihlášeného uživatele nebo specifického stavu aplikace.⁴
  - Příklad: `storageState: 'auth/user-state.json'`
- `timezoneId`: Mění časové pásmo kontextu prohlížeče. Užitečné pro testování aplikací závislých na čase.⁴
  - Příklad: `timezoneId: 'Europe/Prague'`
- `clientCertificates`: Pole objektů pro konfiguraci klientských SSL certifikátů (`[{ origin, certPath?, keyPath?, pfxPath?, passphrase? }]`).⁴
- `connectOptions`: Volby pro připojení k existujícímu websocket endpointu prohlížeče (`wsEndpoint, headers?, timeout?, exposeNetwork?`).⁴

### 3.4 Řízení akcí a navigace

- `actionTimeout`: Výchozí časový limit (v ms) pro jednotlivé akce Playwright jako `click()`, `fill()`, `waitFor()` atd. Pokud akce trvá déle, test selže. Výchozí hodnota `0` znamená žádný limit.⁴
  - Příklad: `actionTimeout: 15 * 1000 // 15 sekund`
- **Poznámka**: `navigationTimeout` (pro `goto`, `waitForNavigation` atd.) se nastavuje na úrovni stránky (`page.setDefaultNavigationTimeout()`) nebo jako parametr těchto metod, nikoli v bloku `use`, ale konceptuálně souvisí s `actionTimeout`.

Blok `use` je neuvěřitelně mocný, protože konfiguruje stav a chování kontextu prohlížeče pro testy. Volby jako `storageState`, `locale`, `timezoneId`, `geolocation`, `permissions`, `httpCredentials` a `extraHTTPHeaders` umožňují spouštět testy za vysoce specifických, předem nakonfigurovaných podmínek bez nutnosti složitých kroků nastavení v samotných testech. Seznam voleb v 3.3 a 3.4 ukazuje designovou filozofii deklarativní konfigurace oproti imperativnímu nastavení v testech. Nastavením těchto voleb v `use` se testy stávají čistšími, více zaměřenými na ověřovací logiku a snadněji přizpůsobitelnými různým scénářům (např. testování různých uživatelských rolí pomocí `storageState`, různých regionů pomocí `locale`/`timezoneId`).

### 3.5 Přehled běžných voleb `use`

Následující tabulka shrnuje některé z nejčastěji používaných voleb v bloku `use`:

| Volba               | Typ                                               | Výchozí hodnota                | Stručný účel                                   | Běžné hodnoty/Příklad                     |
| ------------------- | ------------------------------------------------- | ------------------------------ | ---------------------------------------------- | ----------------------------------------- |
| `baseURL`           | string                                            | `undefined`                    | Základní URL pro navigaci a požadavky.         | `'http://localhost:3000'`                 |
| `browserName`       | `"chromium"` \| `"firefox"` \| `"webkit"`         | `'chromium'`                   | Jádro prohlížeče.                              | `'firefox'`, `'webkit'`                   |
| `headless`          | boolean                                           | `true`                         | Spustit prohlížeč bez UI.                      | `false` (pro lokální ladění)              |
| `viewport`          | `{ width: number, height: number }` \| `null`     | `{ width: 1280, height: 720 }` | Velikost okna prohlížeče.                      | `{ width: 1920, height: 1080 }`, `null`   |
| `screenshot`        | `"on"` \| `"off"` \| `"only-on-failure"`          | `'off'`                        | Kdy pořizovat snímky obrazovky.                | `'only-on-failure'`                       |
| `trace`             | `"on"` \| `"off"` \| `"retain-on-failure"` \| ... | `'off'`                        | Kdy nahrávat trasování testu.                  | `'retain-on-failure'`                     |
| `video`             | `"on"` \| `"off"` \| `"retain-on-failure"` \| ... | `'off'`                        | Kdy nahrávat video testu.                      | `'retain-on-failure'`                     |
| `locale`            | string                                            | `'en-US'`                      | Locale prohlížeče (jazyk, region).             | `'cs-CZ'`, `'de-DE'`                      |
| `timezoneId`        | string                                            | `undefined`                    | Časové pásmo prohlížeče.                       | `'Europe/Prague'`, `'America/New_York'`   |
| `geolocation`       | `{ latitude: number, longitude: number,...}`      | `undefined`                    | Emulace geolokace.                             | `{ latitude: 50.07, longitude: 14.43 }`   |
| `permissions`       | Array<string>                                     | `[]`                           | Udělení oprávnění prohlížeče.                  | `['geolocation', 'notifications']`        |
| `ignoreHTTPSErrors` | boolean                                           | `false`                        | Ignorovat HTTPS chyby.                         | `true` (opatrně)                          |
| `actionTimeout`     | number                                            | `0` (bez limitu)               | Výchozí časový limit pro akce (ms).            | `10000` (10s)                             |
| `storageState`      | string \| object                                  | `undefined`                    | Načíst stav úložiště (cookies, local storage). | `'auth/state.json'`, `{ cookies: [...] }` |
| `userAgent`         | string                                            | `undefined`                    | Vlastní user agent řetězec.                    | `'Mozilla/5.0...'`                        |
| `extraHTTPHeaders`  | object                                            | `undefined`                    | Vlastní HTTP hlavičky pro všechny požadavky.   | `{ 'Authorization': 'Bearer...' }`        |

Tato tabulka slouží jako praktický přehled pro nastavení prostředí testů pomocí bloku `use`.

## 4. Pokročilé řízení spouštění

Kromě základních nastavení nabízí Playwright i pokročilejší možnosti pro filtrování testů a detailní správu časových limitů.

### 4.1 Filtrování testů

Playwright umožňuje filtrovat spouštěné testy na základě jejich názvů pomocí regulárních výrazů.

- `grep`: Regulární výraz nebo pole regulárních výrazů. Spustí pouze testy (a skupiny `describe`), jejichž název odpovídá alespoň jednomu ze vzorů.⁵
  - Příklad: `grep: /@smoke/` (spustí testy označené tagem `@smoke` v názvu)
- `grepInvert`: Regulární výraz nebo pole regulárních výrazů. Vyloučí testy (a skupiny `describe`), jejichž název odpovídá alespoň jednomu ze vzorů. Je to opak `grep`.⁵
  - Příklad: `grepInvert: /@wip|@broken/` (přeskočí testy označené `@wip` nebo `@broken`)

Volby `grep` a `grepInvert` umožňují výkonnou správu testovací sady prostřednictvím konvencí značkování (tagování) v názvech testů (např. `@smoke`, `@regression`, `@ID-123`). To umožňuje flexibilní spouštění specifických podmnožin testů bez nutnosti modifikovat kód. Kombinace těchto voleb s konzistentní strategií tagování v popisech testů a skupin `describe` umožňuje vývojářům snadno vybírat podmnožiny pro různé účely (např. rychlé smoke testy v CI, plné regresní běhy v noci, vyloučení rozpracovaných testů). Toto filtrování řízené konfigurací je flexibilnější než komentování kódu nebo používání `test.skip`.⁵

### 4.2 Hlubší pohled na časové limity (Timeouts)

Správné nastavení časových limitů je klíčové pro stabilitu a efektivitu testů. Playwright rozlišuje několik typů timeoutů:

- `timeout` (TestConfig): Maximální doba pro jeden celý test (včetně `beforeEach`/`afterEach` a fixtur). Výchozí 30s.¹
- `globalTimeout` (TestConfig): Maximální doba pro celý testovací běh. Výchozí `0` (bez limitu).⁵
- `expect.timeout` (ExpectConfig): Maximální doba čekání pro asynchronní `expect` matchery (např. `toBeVisible`). Výchozí 5s.²
- `actionTimeout` (TestOptions): Výchozí maximální doba pro jednotlivé akce (`click`, `fill` atd.). Výchozí `0` (bez limitu).⁴
- `navigationTimeout` (Page): Maximální doba pro navigační akce (`goto`, `waitForNavigation`). Nastavuje se přes `page.setDefaultNavigationTimeout()` nebo jako parametr metody. Výchozí 30s.
- `webServer.timeout` (WebServerConfig): Maximální doba čekání na spuštění lokálního serveru. Výchozí 60s.⁹

Je důležité chápat hierarchii a možné interakce. Například krátký `timeout` testu (např. 10s) může být překročen dlouho běžící akcí (např. čekání na element), i když `actionTimeout` není explicitně nastaven (protože akce přispívají k celkovému času testu). `expect.timeout` je oddělený a umožňuje asercím čekat na splnění podmínky nezávisle na `actionTimeout` nebo celkovém `timeout`u testu. Nastavení vhodných hodnot závisí na složitosti aplikace, rychlosti testovacího prostředí a povaze jednotlivých akcí a asercí.

## 5. Využití projektů pro testování s více konfiguracemi

Pole `projects` v konfiguračním souboru je základním mechanismem pro spouštění stejné sady testů s různými konfiguracemi.¹ Každý objekt v tomto poli definuje pojmenovaný projekt s vlastní specifickou sadou voleb v bloku `use`.

### 5.1 Definování `projects`

Pole `projects` obsahuje objekty, kde každý má alespoň vlastnost `name` (unikátní identifikátor projektu) a `use` (objekt s `TestOptions` specifickými pro tento projekt).

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  projects: [
    {
      name: "chromium-desktop",
      use: { browserName: "chromium", viewport: { width: 1280, height: 720 } },
    },
    {
      name: "firefox-mobile",
      use: { browserName: "firefox", ...devices["Pixel 5"] },
    },
    //... další projekty
  ],
});
```

### 5.2 Případy použití a příklady

- **Cross-Browser Testing**: Kanonický příklad definování projektů pro `'chromium'`, `'firefox'` a `'webkit'` pro zajištění kompatibility napříč prohlížeči.¹
  ```typescript
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ];
  ```
- **Testování různých prostředí (Staging/Production)**: Použití projektů pro nastavení různých `baseURL`, `storageState` (pro různé uživatele/role) nebo `extraHTTPHeaders` pro různá prostředí. Lze kombinovat s proměnnými prostředí.⁸

  ```typescript
  // playwright.config.ts
  import { defineConfig } from "@playwright/test";
  import dotenv from "dotenv";
  import path from "path";

  // Načtení proměnných prostředí podle cílového prostředí
  dotenv.config({
    path: path.resolve(
      __dirname,
      `.env.${process.env.TARGET_ENV || "staging"}`
    ),
  });

  export default defineConfig({
    projects: [
      {
        name: "Staging Tests",
        use: {
          baseURL: process.env.STAGING_URL,
          storageState: "auth/staging-user.json",
          extraHTTPHeaders: { "X-Environment": "staging" },
        },
      },
      {
        name: "Production Smoke Tests",
        use: {
          baseURL: process.env.PROD_URL,
          storageState: "auth/prod-viewer.json",
          extraHTTPHeaders: { "X-Environment": "production" },
        },
      },
    ],
  });
  ```

- **Emulace zařízení**: Definování projektů pro různá zařízení pomocí předdefinovaných `devices` z `@playwright/test` nebo manuálním nastavením `viewport`, `userAgent`, `isMobile`, `hasTouch`, `deviceScaleFactor`.¹

  ```typescript
  import { defineConfig, devices } from "@playwright/test";

  export default defineConfig({
    projects: [
      { name: "Desktop Chrome", use: { ...devices["Desktop Chrome"] } },
      { name: "iPhone 13", use: { ...devices["iPhone 13"] } },
      { name: "iPad Pro 11", use: { ...devices["iPad Pro 11 landscape"] } },
    ],
  });
  ```

- **Parametrizace vlastních voleb**: Projekty mohou definovat vlastní volby v bloku `use`, které jsou pak přístupné v testech prostřednictvím vlastních fixtur. To umožňuje parametrizovat testy nad rámec standardních `TestOptions`.⁸ Příklad s volbou `person` v referenci 8 toto ilustruje.

Projekty jsou více než jen nastavení prohlížeče; definují odlišné kontexty spuštění. Každý projekt může mít unikátní kombinaci prohlížeče, viewportu, proměnných prostředí, základní URL, stavu úložiště, hlaviček atd., což umožňuje spouštět stejný testovací kód proti zásadně odlišným scénářům. Šíře příkladů pokrývajících prohlížeče, zařízení, prostředí a vlastní parametry ¹ ukazuje, že `projects` jsou primárním mechanismem pro maticové testování. Jeden testovací soubor může být proveden vícekrát, jednou pro každý projekt, přičemž dědí specifickou konfiguraci `use` daného projektu. To zabraňuje duplikaci kódu a udržuje konfiguraci centralizovanou.

## 6. Strategie globálního nastavení a úklidu (Global Setup and Teardown)

Často je potřeba provést určitou logiku jednou před spuštěním všech testů (např. inicializace databáze, globální přihlášení, spuštění pomocných služeb) a jednou po skončení všech testů (např. úklid databáze, odhlášení, zastavení služeb).¹ Playwright nabízí dvě strategie.

### 6.1 Možnost 1: Soubory `globalSetup` a `globalTeardown`

- **Konfigurace**: V hlavním konfiguračním souboru se specifikují cesty k souborům pomocí voleb `globalSetup` a `globalTeardown`. Doporučuje se použít `require.resolve()` pro zajištění správného nalezení cesty.¹
  ```typescript
  // playwright.config.ts
  import { defineConfig } from "@playwright/test";
  export default defineConfig({
    globalSetup: require.resolve("./global-setup.ts"),
    globalTeardown: require.resolve("./global-teardown.ts"),
    //...
  });
  ```
- **Signatura funkce**: Každý z těchto souborů musí exportovat jednu (asynchronní) funkci, která přijímá jako argument objekt `FullConfig` obsahující kompletní rozřešenou konfiguraci testovacího běhu.⁷

  ```typescript
  // global-setup.ts
  import { FullConfig, chromium } from "@playwright/test";

  async function globalSetup(config: FullConfig) {
    console.log("Spouštím globální setup...");
    // Získání konfigurace z prvního projektu (nebo podle potřeby)
    const { storageState, baseURL } = config.projects[0].use;

    // Příklad: Přihlášení a uložení stavu
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(baseURL!);
    //... kroky přihlášení...
    await page.fill('input[name="username"]', "admin");
    await page.fill('input[name="password"]', "password");
    await page.click('button[type="submit"]');
    // Uložení stavu do souboru definovaného v konfiguraci
    await page.context().storageState({ path: storageState as string });
    await browser.close();
    console.log(`Globální setup dokončen. Stav uložen do ${storageState}`);
  }

  export default globalSetup;
  ```

- **Omezení**: Tento přístup má nevýhody: setup/teardown kód nemá přístup k Playwright fixturám, není viditelný v HTML reportu jako samostatný krok, nepodporuje nahrávání trasování a správa prohlížeče je plně manuální.⁷

### 6.2 Možnost 2: Závislosti projektů (Doporučeno)

- **Konfigurace**: Definují se speciální projekty v poli `projects` pro setup a teardown. Pomocí `testMatch` se určí soubory obsahující setup/teardown logiku. Ostatní projekty pak deklarují závislost na setup projektu pomocí vlastnosti `dependencies` a setup projekt může volitelně specifikovat teardown projekt pomocí vlastnosti `teardown`.⁷

  ```typescript
  // playwright.config.ts
  import { defineConfig, devices } from "@playwright/test";

  export const STORAGE_STATE = "playwright/.auth/user.json";

  export default defineConfig({
    projects: [
      // Setup projekt
      { name: "setup", testMatch: /global\.setup\.ts/ },
      // Teardown projekt (volitelný)
      // { name: 'teardown', testMatch: /global\.teardown\.ts/, teardown: '...' },

      // Běžné testovací projekty
      {
        name: "chromium",
        use: {
          ...devices["Desktop Chrome"],
          // Použij uložený stav z setup projektu
          storageState: STORAGE_STATE,
        },
        dependencies: ["setup"], // Závisí na dokončení projektu 'setup'
      },
      {
        name: "firefox",
        use: {
          ...devices["Desktop Firefox"],
          storageState: STORAGE_STATE,
        },
        dependencies: ["setup"],
      },
      //... další projekty závislé na 'setup'
    ],
    // ... další konfigurace
  });
  ```

- **Implementace**: Setup a teardown logika se píše jako běžné testy (`test(...)`) uvnitř souborů specifikovaných v `testMatch` setup/teardown projektů.⁷

  ```typescript
  // tests/global.setup.ts
  import { test as setup, expect } from "@playwright/test";
  import { STORAGE_STATE } from "../playwright.config"; // Předpokládá export konstanty

  setup("authenticate", async ({ page }) => {
    // Provedení přihlašovacích kroků
    await page.goto("/login");
    await page.fill('input[name="username"]', process.env.TEST_USER!);
    await page.fill('input[name="password"]', process.env.TEST_PASSWORD!);
    await page.click('button[type="submit"]');
    // Ověření úspěšného přihlášení
    await expect(page.locator("h1")).toHaveText("Dashboard");

    // Uložení stavu autentikace do souboru
    await page.context().storageState({ path: STORAGE_STATE });
    console.log(
      `Setup: Autentikace dokončena a stav uložen do ${STORAGE_STATE}.`
    );
  });
  ```

- **Výhody**: Tento přístup je doporučený, protože plně integruje setup/teardown do ekosystému Playwright. Získává viditelnost v reportech, podporu trasování, přístup k fixturám, automatickou správu prohlížeče a aplikaci standardních konfiguračních voleb (např. `headless`).⁷

### 6.3 Porovnání a doporučení

Pro většinu případů použití je přístup se závislostmi projektů výrazně lepší volbou díky jeho těsnější integraci s Playwright runnerem a jeho funkcemi.⁷ Metoda s `globalSetup`/`globalTeardown` soubory může být zvážena pro velmi jednoduché scénáře nebo při práci se starším kódem. Doporučený přístup se závislostmi projektů zachází se setupem a teardownem ne jako s externími skripty, ale jako s integrálními součástmi testovací sady, které těží ze stejných funkcí (reportování, trasování, fixtury) jako běžné testy. Spouštěním setup/teardown logiky jako testů v rámci dedikovaných projektů Playwright využívá svou existující infrastrukturu runneru, což poskytuje lepší viditelnost a možnosti ladění ve srovnání s izolovaným spouštěním funkcí `globalSetup`/`globalTeardown`.

## 7. Integrace s vývojovými servery (`webServer`)

Volba `webServer` umožňuje automaticky spustit lokální vývojový server (nebo více serverů) před zahájením testů. Je to ideální pro lokální vývoj a pro CI scénáře, kde není k dispozici nasazené testovací prostředí.¹

### 7.1 Účel

Hlavním účelem `webServer` je zajistit, že testovaná aplikace běží a je dostupná, než se spustí samotné testy. Eliminuje potřebu manuálně spouštět server a zajišťuje konzistentní testovací prostředí.⁹

### 7.2 Konfigurační volby

- `command`: Příkaz shellu pro spuštění serveru (např. `npm run dev`, `yarn start`).⁹
  - Příklad: `command: 'npm run start'`
- `url` nebo `port`: URL adresa nebo port, na kterém Playwright očekává, že server bude naslouchat a bude připraven přijímat spojení (očekává HTTP status 2xx, 3xx nebo 40x).¹
  - Příklad: `url: 'http://localhost:3000'`
  - Příklad: `port: 3000`
- `reuseExistingServer`: Logická hodnota (`boolean`), která řídí, zda Playwright má použít již běžící server na dané `url`/`port`. Pokud `true`, připojí se k existujícímu, jinak spustí nový. Pokud `false`, vyhodí chybu, pokud server již běží. Často se nastavuje na `!process.env.CI` pro rychlejší lokální vývoj.¹
  - Příklad: `reuseExistingServer: !process.env.CI`
- `timeout`: Maximální čas (v ms), po který Playwright čeká na spuštění serveru a jeho dostupnost na `url`/`port`. Výchozí `60000` ms (60 sekund).⁹
  - Příklad: `timeout: 180 * 1000 // 3 minuty`
- `stdout`, `stderr`: Určuje, jak se nakládá se standardním výstupem (`stdout`) a chybovým výstupem (`stderr`) serverového procesu (`'pipe'` pro přesměrování do výstupu Playwright, `'ignore'` pro ignorování). Výchozí je `stdout: 'ignore'`, `stderr: 'pipe'`.⁹
  - Příklad: `stdout: 'pipe'`
- `env`: Objekt pro nastavení proměnných prostředí specificky pro spouštěný serverový proces.⁹
  - Příklad: `env: { PORT: '3001' }`
- `cwd`: Nastavuje aktuální pracovní adresář pro spouštěný serverový proces. Výchozí je adresář konfiguračního souboru.⁹
  - Příklad: `cwd: './frontend'`
- `ignoreHTTPSErrors`: Logická hodnota (`boolean`) pro ignorování HTTPS chyb při kontrole dostupnosti `url` (např. pro servery s vlastními certifikáty). Výchozí `false`.⁹
- `name`: Vlastní název pro webový server, který se objeví v logovacích zprávách. Výchozí `""`.⁹
- `gracefulShutdown`: Konfiguruje způsob ukončení serverového procesu. Umožňuje poslat signály jako `SIGTERM` nebo `SIGINT` před `SIGKILL` pro korektní ukončení.⁹

### 7.3 Zpracování více serverů

Playwright umožňuje konfigurovat a spouštět více serverů současně poskytnutím pole `webServer` konfigurací. Každý prvek pole je objekt s konfigurací pro jeden server. To je užitečné, pokud aplikace vyžaduje běžící frontend i backend.⁹

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: [
    {
      command: "cd backend && npm run start",
      port: 3001,
      name: "BackendAPI",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "cd frontend && npm run dev",
      url: "http://localhost:3000",
      name: "FrontendApp",
      reuseExistingServer: !process.env.CI,
    },
  ],
  use: {
    baseURL: "http://localhost:3000", // Cílová URL pro testy
  },
});
```

### 7.4 Vztah k `baseURL`

Často je `webServer.url` shodná nebo souvisí s `use.baseURL`, což zjednodušuje konfiguraci navigace v testech.⁹

Funkce `webServer` výrazně zjednodušuje pracovní postup testování tím, že automatizuje nezbytný krok spuštění aplikačního serveru a zajišťuje, že testy běží pouze tehdy, když je aplikace připravena. Přímo řeší běžný problém koordinace spouštění serveru a testů, zejména v CI/CD pipeline, kde manuální zásah není možný. Volby jako `reuseExistingServer` dále optimalizují pracovní postupy lokálního vývoje.⁹

## 8. Konfigurace asercí (`expect`)

Blok `expect` v konfiguračním souboru umožňuje přizpůsobit chování vestavěné aserční knihovny Playwright (`expect`).²

### 8.1 Časový limit asercí

- `timeout`: Maximální čas (v ms), po který budou asynchronní `expect` matchery (jako `expect(locator).toBeVisible()`, `expect(page).toHaveURL()`) čekat na splnění podmínky, než selžou. Výchozí hodnota je `5000` ms (5 sekund). Je důležité odlišit tento timeout od celkového `timeout`u testu a `actionTimeout`u.²
  - Příklad: `expect: { timeout: 10000 } // 10 sekund`

### 8.2 Konfigurace snapshot testování

Tato sekce umožňuje jemně doladit chování snapshotových asercí.

- `toHaveScreenshot`: Obsahuje volby pro vizuální porovnávání snímků obrazovky. Klíčové volby zahrnují:
  - `maxDiffPixels`: Povolený absolutní počet rozdílných pixelů.
  - `maxDiffPixelRatio`: Povolený poměr rozdílných pixelů k celkovému počtu (0 až 1).
  - `threshold`: Prahová hodnota pro přijatelný vnímaný barevný rozdíl mezi pixely (0 = striktní, 1 = benevolentní, výchozí `0.2` pro `pixelmatch`).
  - `animations`: `"allow"` nebo `"disabled"` (výchozí) pro zacházení s CSS animacemi/přechody.
  - `caret`: `"hide"` (výchozí) nebo `"initial"` pro zobrazení kurzoru.
  - `scale`: `"css"` (výchozí) nebo `"device"` pro škálování snímku.
  - .²
  - Příklad: `expect: { toHaveScreenshot: { threshold: 0.1, maxDiffPixels: 50 } }`
- `toMatchSnapshot`: Obsahuje volby pro porovnávání textových nebo DOM snapshotů (např. `threshold`, `maxDiffPixelRatio`).²
- `toMatchAriaSnapshot`: Obsahuje volby pro porovnávání snapshotů ARIA stromu.⁵
- Cesty k souborům snapshotů jsou ovlivněny globální volbou `snapshotPathTemplate`.

Konfigurace `expect` umožňuje ladit robustnost a citlivost asercí, zejména pro asynchronní podmínky a vizuální/DOM porovnání. Existence `expect.timeout` ² odděleně od timeoutu testu uznává, že čekání na splnění podmínek může vyžadovat jiné načasování než celkové provádění testu. Podobně volby v `toHaveScreenshot` a `toMatchSnapshot` ⁵ poskytují kontrolu nad přísností porovnávání snapshotů, což umožňuje týmům vyvážit přesnost s tolerancí k drobným rozdílům ve vykreslování nebo prostředí.

## 9. Reportování testů (`reporter`)

Reportéry jsou zásadní pro pochopení výsledků testů, identifikaci selhání a analýzu trendů.¹⁷ Playwright nabízí několik vestavěných reportérů a možnost vytvářet vlastní nebo používat reportéry třetích stran. Konfigurace se provádí buď přes příkazovou řádku (`--reporter`) nebo, což je flexibilnější, v konfiguračním souboru pomocí vlastnosti `reporter`.¹²

### 9.1 Vestavěné reportéry

Playwright poskytuje sadu vestavěných reportérů pro různé účely ¹²:

- `list`: Výchozí reportér při lokálním spuštění (pokud není `CI` proměnná prostředí nastavena). Vypisuje každý test na samostatný řádek během běhu a shrnuje selhání na konci. Detailní. Volba: `printSteps: boolean`.
- `line`: Stručnější než `list`. Používá jeden řádek k zobrazení posledního dokončeného testu a vypisuje selhání inline. Vhodný pro velké sady testů lokálně, kde ukazuje postup bez zahlcení výstupu.
- `dot`: Výchozí reportér v CI prostředí (pokud `process.env.CI` je `true`). Velmi minimalistický, vypisuje tečku (`.`) pro každý úspěšný test, `F` pro selhání atd. Vhodný pro CI logy.
- `html`: Generuje interaktivní HTML report do složky (výchozí `playwright-report`). Obsahuje detaily o každém testu, včetně kroků, chyb, artefaktů (screenshoty, videa, trace). Standardně se otevírá automaticky při selhání. Volby: `outputFolder`, `open` (`'always'`, `'never'`, `'on-failure'`), `host`, `port`, `attachmentsBaseURL`. Env proměnné: `PLAYWRIGHT_HTML_*`.
- `json`: Produkuje JSON soubor s kompletními informacemi o testovacím běhu. Vhodný pro strojové zpracování nebo integraci s jinými nástroji. Volba: `outputFile`. Env proměnné: `PLAYWRIGHT_JSON_*`.
- `junit`: Generuje XML report ve formátu JUnit, široce podporovaném CI/CD systémy a nástroji pro správu testů. Volby: `outputFile`, `stripANSIControlSequences`, `includeProjectInTestName`, `suiteId`, `suiteName`. Env proměnné: `PLAYWRIGHT_JUNIT_*`.
- `blob`: Vytváří ZIP archiv (`.zip`) obsahující všechny detaily běhu, včetně artefaktů. Primárně slouží k agregaci výsledků z paralelně běžících shardů (částí testovací sady). Volby: `outputDir`, `fileName`, `outputFile`. Env proměnné: `PLAYWRIGHT_BLOB_*`.
- `github`: Vytváří anotace přímo v GitHub Actions logu pro selhané testy (používá se automaticky v GitHub Actions).
- `null`: Nevytváří žádný výstup.

### 9.2 Konfigurace více reportérů

Je možné použít více reportérů současně zadáním pole v konfiguraci. Každý prvek pole může být buď název reportéru (řetězec) nebo pole `[název, optionsObjekt]`.¹²

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  reporter: [
    ["list"], // Zobrazí seznam v konzoli
    ["html", { open: "on-failure", outputFolder: "test-report" }], // Generuje HTML report
    ["json", { outputFile: "results.json" }], // Generuje JSON soubor
  ],
  // ...
});
```

### 9.3 Reportéry v CI

Často je žádoucí mít jiný reportér pro lokální běh a jiný pro CI. Toho lze dosáhnout pomocí ternárního operátoru a proměnné prostředí `process.env.CI`.¹²

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  reporter: process.env.CI ? "dot" : "list",
  // ...
});

// Nebo pro více reportérů v CI:
// reporter: process.env.CI
//   ? [['dot'], ['junit', { outputFile: 'results.xml' }]]
//   : [['list'], ['html']],
```

### 9.4 Vlastní reportéry

Playwright umožňuje vytvářet vlastní reportéry implementací třídy, která splňuje `Reporter` rozhraní z `@playwright/test/reporter`. To poskytuje maximální flexibilitu pro generování reportů ve specifických formátech nebo pro integraci s vlastními systémy.¹¹ Implementují se metody jako `onBegin`, `onTestBegin`, `onStepBegin`, `onStepEnd`, `onTestEnd`, `onEnd`, `onError`, `onStdOut`, `onStdErr`, `printsToStdio` a `onExit`.

### 9.5 Reportéry třetích stran

Existuje ekosystém reportérů třetích stran, které se integrují s populárními nástroji pro správu testů a vizualizaci, jako jsou `Allure` (¹²), `Artillery Cloud` (¹⁹), `Zebrunner` (¹⁴), `ReportPortal`, `TestRail` atd. Obvykle vyžadují instalaci dodatečného balíčku a specifickou konfiguraci v poli `reporter`.

Reportovací systém Playwright je navržen tak, aby byl přizpůsobitelný různým potřebám konzumace výsledků – interaktivní ladění (HTML), CI logy (dot, line), strojové zpracování (JSON), CI dashboardy (JUnit) a agregace reportů (blob). Rozmanitost vestavěných reportérů ¹³, schopnost používat více reportérů ¹³, specifické konfigurace pro CI ¹² a API pro vlastní reportéry ¹¹ demonstrují tuto flexibilitu. Uživatelé si mohou vybrat nebo kombinovat reportéry, aby získali správnou úroveň detailů a formát pro lokální vývoj, CI pipeline nebo integraci s externími nástroji.

### 9.6 Přehled vestavěných reportérů

| Reportér | Popis / Použití                                | Klíčové volby / Env proměnné                                                                                         |
| -------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `list`   | Výchozí lokálně, detailní výpis testů.         | `printSteps` / `PLAYWRIGHT_LIST_PRINT_STEPS`                                                                         |
| `line`   | Stručný postup, vhodný pro velké sady lokálně. | -                                                                                                                    |
| `dot`    | Výchozí v CI, minimalistický výstup.           | -                                                                                                                    |
| `html`   | Interaktivní HTML report pro prohlížeč.        | `outputFolder`, `open`, `host`, `port`, `attachmentsBaseURL` / `PLAYWRIGHT_HTML_*`                                   |
| `json`   | Strojově čitelný JSON soubor.                  | `outputFile` / `PLAYWRIGHT_JSON_*`                                                                                   |
| `junit`  | Standardní XML formát pro CI/nástroje.         | `outputFile`, `stripANSIControlSequences`, `includeProjectInTestName`, `suiteId`, `suiteName` / `PLAYWRIGHT_JUNIT_*` |
| `blob`   | ZIP archiv pro slučování výsledků shardů.      | `outputDir`, `fileName`, `outputFile` / `PLAYWRIGHT_BLOB_*`                                                          |
| `github` | Anotace v GitHub Actions (automaticky).        | -                                                                                                                    |
| `null`   | Žádný výstup.                                  | -                                                                                                                    |

Tato tabulka poskytuje přehled pro výběr vhodného reportéru(ů) pro daný kontext.

## 10. Pochopení rozsahů platnosti a přepisování konfigurace

Playwright umožňuje definovat konfigurační volby na různých úrovních, což poskytuje velkou flexibilitu. Nastavení definovaná na specifičtější úrovni mají přednost a přepisují nastavení z obecnějších úrovní.¹

### 10.1 Hierarchie přepisování

Pořadí precedence (od nejnižší po nejvyšší) je následující:

1.  **Globální `use`** (v kořeni `defineConfig`): Výchozí hodnoty pro všechny projekty a testy.
2.  **Projektové `use`** (uvnitř objektu projektu v poli `projects`): Přepisuje globální `use` pro testy běžící v rámci daného projektu.
3.  **Souborové `test.use()`** (na nejvyšší úrovni testovacího souboru): Přepisuje globální a projektové `use` pro všechny testy v daném souboru.
4.  **Testové `test.use()`** (uvnitř `test(...)` funkce): Přepisuje všechny předchozí úrovně pouze pro daný konkrétní test. Toto je nejméně časté a mělo by se používat uvážlivě.

### 10.2 Praktické příklady

Představme si přepisování volby `locale`:

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  use: {
    locale: "en-US", // Globální výchozí locale
    timezoneId: "America/New_York", // Globální timezone
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: { browserName: "chromium" }, // Použije globální locale a timezone
    },
    {
      name: "German Firefox",
      use: {
        browserName: "firefox",
        locale: "de-DE", // Přepisuje globální locale pro tento projekt
        // timezoneId zůstává globální ('America/New_York')
      },
    },
  ],
});
```

```typescript
// tests/specific-locale.spec.ts
import { test, expect } from "@playwright/test";

// Toto platí pro všechny testy v tomto souboru
test.use({
  locale: "fr-FR", // Přepisuje globální i projektové locale na francouzštinu
  timezoneId: "Europe/Paris", // Přepisuje globální timezone
});

test("Test s francouzským locale", async ({ page }) => {
  // Bude použito 'fr-FR' a 'Europe/Paris'
  // Tento test poběží v 'Desktop Chrome' s locale 'fr-FR' a timezone 'Europe/Paris'
  // a v 'German Firefox' s locale 'fr-FR' (protože soubor přepisuje projekt) a timezone 'Europe/Paris'
  //... test logic...
});

test("Další test s francouzským locale", async ({ page }) => {
  // Stále platí 'fr-FR' a 'Europe/Paris' z test.use() na úrovni souboru
  //... test logic...
});
```

```typescript
// tests/single-override.spec.ts
import { test, expect } from "@playwright/test";

// Použije locale a timezone z projektu nebo globální konfigurace,
// pokud není přepsáno na úrovni souboru (zde není).

test("Test s výchozím locale projektu", async ({ page }) => {
  // V projektu 'Desktop Chrome' bude 'en-US' / 'America/New_York'
  // V projektu 'German Firefox' bude 'de-DE' / 'America/New_York'
  //... test logic...
});

test("Test s přepsaným locale jen pro tento test", async ({ page }) => {
  // Toto platí POUZE pro tento test
  test.use({ locale: "ja-JP" });

  // V projektu 'Desktop Chrome' bude 'ja-JP' / 'America/New_York'
  // V projektu 'German Firefox' bude 'ja-JP' / 'America/New_York'
  //... test logic...
});
```

Tento vrstvený mechanismus přepisování poskytuje obrovskou flexibilitu. Umožňuje nastavit základní konfigurace globálně a zároveň řešit výjimky a specifické požadavky na úrovni projektu, souboru nebo dokonce jednotlivého testu bez nadměrné duplikace kódu. Umožňuje definovat společná nastavení jednou a specializovat je pouze tam, kde je to nutné, což vede k udržitelnějším konfiguracím pro komplexní testovací sady.¹

## 11. Externí zdroje konfigurace

Ačkoli `playwright.config.ts/.js` je centrálním bodem, konfiguraci lze ovlivnit i z externích zdrojů, zejména pro správu citlivých údajů a nastavení specifických pro prostředí.

### 11.1 Proměnné prostředí

Nejběžnějším způsobem je čtení proměnných prostředí přímo v konfiguračním souboru pomocí `process.env`. To je ideální pro nastavení URL, API klíčů, počtu opakování v CI, přepínačů funkcí atd..¹

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    extraHTTPHeaders: {
      "X-API-Key": process.env.API_KEY || "default-key",
    },
  },
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: "npm run start",
    url: process.env.BASE_URL || "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### 11.2 Soubory `.env`

Pro lokální vývoj a lepší správu proměnných prostředí (zejména citlivých údajů) je doporučeno používat soubory `.env` a knihovnu jako `dotenv`. Ta načte proměnné ze souboru `.env` v kořenovém adresáři a zpřístupní je přes `process.env`.⁸

```bash
# Instalace dotenv
npm install --save-dev dotenv
# nebo
yarn add --dev dotenv
```

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Načtení .env souboru (např. .env.development nebo .env.staging)
// Hledá .env soubor v kořenovém adresáři projektu
dotenv.config({
  path: path.resolve(
    __dirname,
    `.env.${process.env.NODE_ENV || "development"}`
  ),
});
// Nebo jen dotenv.config() pro načtení `.env`

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      "X-API-Key": process.env.API_KEY, // Očekává se, že API_KEY je v .env souboru
    },
    //... další volby čtoucí process.env...
  },
  // ...
});
```

```ini
# .env.development
BASE_URL=http://localhost:3000
API_KEY=local-dev-key-123
NODE_ENV=development
TEST_USER=dev_user
TEST_PASSWORD=dev_pass
```

### 11.3 Jiné zdroje (Stručná zmínka)

Jelikož konfigurační soubor je standardní JavaScript/TypeScript modul, teoreticky je možné načítat konfiguraci i z jiných zdrojů, jako jsou JSON soubory, YAML soubory nebo dokonce databáze. Příklad v referenci 8 ukazuje načítání testovacích dat z CSV souboru. Nicméně, proměnné prostředí (přímo nebo přes `.env`) jsou zdaleka nejběžnějším a nejdoporučovanějším přístupem pro externí konfiguraci.

Používání proměnných prostředí (přímo nebo prostřednictvím `.env`) umožňuje oddělit citlivá data (API klíče, hesla) a nastavení specifická pro prostředí (URL) od konfiguračního souboru spravovaného verzovacím systémem. To zlepšuje bezpečnost a flexibilitu. Snippety v 11.1 ukazují použití `process.env` pro CI příznaky, URL a potenciálně tajné klíče. Snippet v 11.2 explicitně navrhuje `dotenv`. Tato praxe je v souladu se standardními principy vývoje softwaru pro správu konfigurace a tajných klíčů, čímž se testovací sady stávají přenositelnějšími a bezpečnějšími.

## 12. Závěr

Konfigurační systém Playwright, soustředěný kolem souboru `playwright.config.ts/.js`, je mimořádně výkonný a flexibilní nástroj pro řízení všech aspektů automatizovaného testování. Od základního definování struktury testů a strategie spouštění, přes detailní nastavení testovacího prostředí pomocí bloku `use`, až po pokročilé funkce jako jsou `projects` pro multi-konfigurační testování, integrace s `webServer`y, globální setup/teardown a přizpůsobitelné reportování (`reporter`), Playwright poskytuje komplexní sadu nástrojů pro efektivní a udržovatelné testování.

Klíčem k efektivnímu využití je pochopení jednotlivých konfiguračních voleb, jejich účelu a vzájemných interakcí. Důležité je zejména rozumět hierarchii přepisování (globální < projekt < soubor < test), která umožňuje vytvářet vrstvené a dobře spravovatelné konfigurace. Využití `projects` pro definování různých kontextů spuštění (prohlížeče, zařízení, prostředí) a externích zdrojů konfigurace (proměnné prostředí, `.env`) pro oddělení citlivých dat a nastavení specifických pro prostředí jsou základními stavebními kameny robustních testovacích sad.

**Připomenutí osvědčených postupů:**

- Preferujte závislosti projektů pro globální setup/teardown.
- Používejte TypeScript a `defineConfig` pro typovou bezpečnost a lepší vývojářský zážitek.
- Spravujte citlivé údaje a nastavení prostředí pomocí proměnných prostředí a `.env` souborů.
- Vybírejte reportéry podle kontextu (lokální vývoj vs. CI, debugging vs. integrace).
- Nastavujte časové limity uvážlivě s ohledem na komplexnost aplikace a stabilitu prostředí.
- Využívejte tagování a `grep`/`grepInvert` pro flexibilní filtrování testů.

Protože se Playwright rychle vyvíjí, je vždy dobré sledovat oficiální dokumentaci Playwright (¹) pro nejnovější informace o dostupných volbách, jejich výchozích hodnotách a doporučených postupech. Zvládnutí konfigurace Playwright je zásadním krokem k vybudování efektivního, spolehlivého a škálovatelného automatizovaného testovacího řešení.
