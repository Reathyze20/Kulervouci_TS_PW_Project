Výborně! Máme implementovaný základní Page Object Model, což je obrovský krok k udržitelnému frameworku. Nyní se podíváme, jak tento (a jakýkoli jiný) kód psát ještě lépe, aby byl flexibilnější, srozumitelnější a snáze rozšiřitelný v budoucnu. K tomu nám pomohou **SOLID principy**.

SOLID je akronym pro pět základních principů objektově orientovaného návrhu, které formuloval Robert C. Martin ("Uncle Bob"). Jejich cílem je pomoci vývojářům vytvářet software, který je:

- **Srozumitelný (Understandable):** Snadno pochopitelný pro ostatní (i pro vaše budoucí já).
- **Flexibilní (Flexible):** Snadno upravitelný a rozšiřitelný o nové funkce.
- **Udržovatelný (Maintainable):** Snadno opravitelný a modifikovatelný bez rozbití existující funkčnosti.

Dnes se zaměříme na první dva principy: **S** a **O**.

**Den 11: SOLID Principy - SRP a OCP**

**Teorie Dne:**

1.  **S - Single Responsibility Principle (SRP) - Princip jediné odpovědnosti**

    - **Definice:** Třída by měla mít pouze **jeden důvod ke změně**. Měla by mít jednu, jasně definovanou zodpovědnost nebo "práci".
    - **Proč je to důležité?** Když třída dělá příliš mnoho věcí, stává se komplexní a křehkou. Změna v jedné oblasti funkčnosti může nechtěně ovlivnit jinou, zdánlivě nesouvisející oblast. Takové třídy je těžké pochopit, testovat a upravovat.
    - **Analogie:** Představte si švýcarský nůž se spoustou nástrojů. Je univerzální, ale pokud se zlomí jeden nástroj (např. vývrtka), musíte potenciálně opravit/vyměnit celý nůž. Navíc, pokud potřebujete jen šroubovák, je často lepší mít dedikovaný šroubovák, který dělá jen jednu věc, ale dělá ji dobře a jednoduše.
    - **V kontextu Test Automation Frameworku:**
      - **Příklad porušení SRP:** Třída `LoginPage` by kromě lokalizace prvků a akcí na přihlašovací stránce obsahovala i metody pro:
        - Generování náhodných uživatelských jmen a hesel.
        - Přímé volání API pro kontrolu stavu uživatele.
        - Formátování testovacích reportů.
        - Logování do specifického souboru.
          Tato třída má _mnoho_ důvodů ke změně: změna UI přihlašovací stránky, změna pravidel pro generování dat, změna API endpointu, změna formátu reportu, změna logovacího mechanismu.
      - **Příklad dodržení SRP:**
        - `LoginPage`: Stará se _pouze_ o interakci s login stránkou (lokátory, akce jako `fillUsername`, `clickLogin`, `getErrorMessage`).
        - `UserDataGenerator`: Třída nebo sada funkcí pro generování testovacích dat (uživatelů, hesel).
        - `ApiClient`: Třída pro komunikaci s backend API.
        - `Logger`: Třída nebo modul pro logování.
        - `BasePage`: Obsahuje _společnou_ logiku pro _všechny_ stránky (např. instance `page`, základní navigace, obecné čekací metody).
    - **Jak aplikovat:** Při psaní třídy se ptejte: "Jaká je primární zodpovědnost této třídy? Kolik důvodů ke změně má?" Pokud najdete více nesouvisejících důvodů, zvažte rozdělení třídy na menší, více zaměřené třídy nebo moduly (utility, helpers).

2.  **O - Open/Closed Principle (OCP) - Princip otevřenosti/uzavřenosti**
    - **Definice:** Softwarové entity (třídy, moduly, funkce) by měly být **otevřené pro rozšíření**, ale **uzavřené pro modifikaci**.
    - **Proč je to důležité?** Chceme mít možnost přidávat novou funkcionalitu (rozšiřovat systém) bez nutnosti měnit existující, otestovaný a fungující kód. Každá změna existujícího kódu s sebou nese riziko zanesení chyby (regrese).
    - **Analogie:** Elektrická zásuvka ve zdi. Je "uzavřená" pro modifikaci – nerozebíráte ji pokaždé, když chcete připojit nové zařízení. Ale je "otevřená" pro rozšíření – můžete do ní zapojit lampu, nabíječku, televizi (nové funkcionality), aniž byste měnili samotnou zásuvku.
    - **V kontextu Test Automation Frameworku:**
      - **Příklad dodržení OCP (pomocí dědičnosti):** Naše struktura s `BasePage` a odvozenými `LoginPage`, `HomePage` je dobrým příkladem. Když potřebujeme přidat novou stránku (např. `RegistrationPage`), vytvoříme novou třídu `class RegistrationPage extends BasePage { ... }`. **Rozšiřujeme** systém o novou stránku, ale **nemodifikujeme** existující kód `BasePage`, `LoginPage` nebo `HomePage`. `BasePage` je uzavřená pro modifikaci (její základní funkčnost neměníme), ale otevřená pro rozšíření (můžeme z ní dědit).
      - **Příklad dodržení OCP (pomocí abstrakce/strategie):** Představte si, že potřebujete podporovat různé způsoby čekání na prvek (čekání na viditelnost, čekání na připojení k DOM, čekání na klikatelnost). Místo velkého `if/else` nebo `switch` v `BasePage` podle typu čekání (což by vyžadovalo modifikaci `BasePage` pro každý nový typ čekání - porušení OCP), byste mohli definovat rozhraní `IWaitStrategy` a mít různé třídy implementující toto rozhraní (`VisibilityWaitStrategy`, `ClickableWaitStrategy`). `BasePage` by pak přijala nebo použila instanci `IWaitStrategy`, čímž by byla otevřená pro nové strategie čekání bez nutnosti modifikace jejího kódu. (Toto využívá návrhové vzory jako Strategy nebo Factory, ke kterým se dostaneme).
      - **Příklad porušení OCP:** Pokud by metoda v `BasePage` měla velký `switch` podle typu stránky (což je anti-pattern samo o sobě): `switch (pageType) { case 'login': /* do login specific */; break; case 'home': /* do home specific */; break; }`. Přidání nové stránky `RegistrationPage` by vyžadovalo **modifikaci** této metody v `BasePage` přidáním nového `case`.
    - **Jak aplikovat:** Používejte abstrakci (abstraktní třídy, rozhraní), dědičnost a polymorfismus. Návrhové vzory jako Strategy, Factory, Decorator často pomáhají dosáhnout OCP. Vyhýbejte se velkým podmínkovým blokům (if/else, switch), které rozhodují na základě "typu".

**Praxe Dne:**

1.  **Zreviduj Kód:** Vrať se ke kódu, který jsi vytvořil/a včera a dříve (`BasePage`, `LoginPage`, `HomePage`, případně další soubory - rozhraní, utility, hlavní skript).
2.  **Analýza SRP:**
    - Projdi každou třídu (`BasePage`, `LoginPage`, `HomePage`). Má každá z nich skutečně jen jednu hlavní zodpovědnost?
    - Zamysli se nad `LoginPage`: Je zodpovědná _pouze_ za interakci s prvky a akcemi na přihlašovací stránce? Nebo dělá i něco navíc (např. kdyby tam bylo složité formátování dat před vyplněním, které by se dalo použít i jinde)?
    - Zamysli se nad `BasePage`: Jaké jsou její zodpovědnosti? Jsou to věci _společné_ pro všechny stránky (držení `page` instance, základní navigace, možná obecné čekací metody)? Pokud by obsahovala logiku specifickou jen pro jeden typ stránky, bylo by to porušení SRP.
    - _Cíl:_ Identifikuj potenciální místa, kde by SRP mohlo být porušeno. Zatím nemusíš kód přepisovat, stačí si ta místa uvědomit a poznamenat.
3.  **Analýza OCP:**
    - Jak snadné je přidat novou stránku (např. `ProductDetailsPage`) do tvého frameworku? Musíš kvůli tomu měnit `BasePage` nebo jiné existující Page Objecty? (Pokud jen vytvoříš novou třídu `ProductDetailsPage extends BasePage`, pak je to v pořádku z hlediska OCP).
    - Představ si, že bys chtěl/a přidat novou _společnou_ akci pro více stránek (např. `acceptCookies()`). Jak bys to udělal/a? Přidáním metody do `BasePage`? Je to rozšíření nebo modifikace? (Přidání nové metody do `BasePage` je technicky modifikace, ale pokud je to opravdu _obecná_ akce relevantní pro _všechny_ nebo _většinu_ stránek, je to často přijatelný kompromis. Pokud by to ale byla akce jen pro _některé_ stránky, bylo by lepší použít jiný přístup, např. kompozici nebo rozhraní).
    - _Cíl:_ Uvědomit si, jak současná struktura (hlavně díky dědičnosti z `BasePage`) podporuje rozšiřování bez nutnosti zásadních změn v existujícím kódu.
4.  **(Volitelné):** Pokud jsi našel/la jasné porušení SRP (např. nějakou pomocnou funkci uvnitř Page Objectu, která by se dala zobecnit a použít jinde), zkus ji **extrahovat** do samostatného souboru/modulu (např. `src/utils/helpers.ts`) a importovat ji tam, kde je potřeba.

**Cíl Dne:**

- **Porozumět** principům Single Responsibility Principle (SRP) a Open/Closed Principle (OCP).
- **Vědět**, proč jsou tyto principy důležité pro tvorbu kvalitního kódu.
- **Být schopen identifikovat** potenciální porušení SRP a OCP v kódu testovacího frameworku (zejména v Page Objectech a BasePage).
- **Začít přemýšlet** o návrhu kódu tak, aby tyto principy dodržoval.

SOLID principy nejsou dogma, které se musí slepě dodržovat za každou cenu, ale jsou to velmi užitečné vodítka, která vedou k lepšímu a udržitelnějšímu kódu. Dnes jsme probrali první dva, zítra se podíváme na zbývající tři (LSP, ISP, DIP).

Jak ti šla analýza kódu z pohledu SRP a OCP? Našel/la jsi nějaká zajímavá místa k zamyšlení?
