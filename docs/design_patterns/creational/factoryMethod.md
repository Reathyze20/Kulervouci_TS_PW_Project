**Základy Návrhových Vzorů (Co, Proč a Jaký Přínos)**

**1. Factory Method (Tvorbní vzor)**

- **Účel (Intent):** Definuje rozhraní pro vytváření objektu, ale nechává na podtřídách, aby rozhodly, kterou konkrétní třídu vytvoří. Umožňuje třídě delegovat instanciaci na své podtřídy.
- **Problém, který řeší:**
  - Potřebuješ vytvářet objekty, ale přesný typ objektu neznáš dopředu (může záviset na konfiguraci, vstupu uživatele, prostředí...).
  - Chceš oddělit kód, který objekty _používá_, od kódu, který je _vytváří_.
  - Chceš dát podtřídám možnost ovlivnit, jaké objekty se vytvářejí, aniž bys musel/a měnit kód, který tyto objekty používá.
- **Struktura (zjednodušeně):**
  - `Product` (Produkt): Rozhraní pro objekty, které tovární metoda vytváří.
  - `ConcreteProduct` (Konkrétní Produkt): Třídy implementující rozhraní `Product`.
  - `Creator` (Tvůrce): Deklaruje tovární metodu (`factoryMethod`), která vrací objekt typu `Product`. Může obsahovat i základní implementaci.
  - `ConcreteCreator` (Konkrétní Tvůrce): Přepisuje tovární metodu, aby vracela instanci konkrétního `ConcreteProduct`.
- **Generický Příklad (TypeScript):**

  ```typescript
  // Product interface
  interface Transport {
    deliver(): void;
  }

  // Concrete Products
  class Truck implements Transport {
    deliver(): void {
      console.log("Delivering by land in a truck.");
    }
  }
  class Ship implements Transport {
    deliver(): void {
      console.log("Delivering by sea in a ship.");
    }
  }

  // Creator (often abstract)
  abstract class Logistics {
    // The factory method
    abstract createTransport(): Transport;

    planDelivery(): void {
      // Use the transport created by the factory method
      const transport = this.createTransport();
      console.log("Planning delivery...");
      transport.deliver();
    }
  }

  // Concrete Creators
  class RoadLogistics extends Logistics {
    createTransport(): Transport {
      return new Truck();
    }
  }
  class SeaLogistics extends Logistics {
    createTransport(): Transport {
      return new Ship();
    }
  }

  // Client code
  let logistics: Logistics;
  const transportMode = "sea"; // Could come from config, etc.

  if (transportMode === "road") {
    logistics = new RoadLogistics();
  } else {
    logistics = new SeaLogistics();
  }

  logistics.planDelivery();
  ```

- **Relevance pro Playwright/TS testování:**

  - **Tvorba Page Objectů:** Máš různé verze aplikace nebo různé typy uživatelů (admin, běžný uživatel)? Factory Method může vytvářet správné Page Objecty. Např. `UserPageObjectFactory` vrací `UserDashboardPage`, zatímco `AdminPageObjectFactory` vrací `AdminDashboardPage`, oba ale implementují společné `DashboardPage` rozhraní. Test pak pracuje jen s `DashboardPage`.

    ```typescript
    abstract class PageFactory {
      abstract createLoginPage(): BaseLoginPage;
      abstract createDashboardPage(): BaseDashboardPage;
    }

    class StandardUserPageFactory extends PageFactory {
      createLoginPage(): StandardLoginPage {
        return new StandardLoginPage(page);
      }
      createDashboardPage(): StandardDashboardPage {
        return new StandardDashboardPage(page);
      }
    }
    // Test:
    const factory = getPageFactoryForUserType("standard"); // Function returns correct factory
    const loginPage = factory.createLoginPage();
    const dashboard = factory.createDashboardPage();
    ```

  - **Generování Testovacích Dat:** Potřebuješ různé sady testovacích dat (validní, nevalidní, hraniční)? Můžeš mít `TestDataFactory` s metodou `createUserData()` a podtřídy `ValidUserDataFactory`, `InvalidUserDataFactory` atd., které vrací objekty s daty.
  - **Inicializace Pomocných Tříd/Služeb:** Pokud tvůj testovací framework potřebuje různé implementace nějaké služby (např. mockovaná vs. reálná API služba), Factory Method může poskytnout správnou instanci.

- **Výhody/Nevýhody v Testování:**
  - **Výhody:** Oddělení tvorby (Page Objectů, dat) od jejich použití v testech; snadné rozšíření o nové typy (nový typ uživatele = nová továrna); testy jsou čistší, pracují s abstrakcemi.
  - **Nevýhody:** Přidává další vrstvu abstrakce a více tříd, což může být pro velmi jednoduché scénáře zbytečný "overhead".

**Co si o Factory Method myslíš? Dává ti smysl jeho účel a vidíš, kde by se ti v Playwright testech mohl hodit, třeba právě pro ty Page Objecty?**

Až budeš připraven/a, můžeme přejít na Strategy.
