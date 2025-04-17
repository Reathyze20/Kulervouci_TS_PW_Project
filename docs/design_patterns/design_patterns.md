1.  **Co jsou návrhové vzory?**

    - Představ si je jako **osvědčená, opakovaně použitelná řešení** pro běžně se vyskytující problémy v softwarovém designu.
    - Nejsou to konkrétní kusy kódu (jako knihovna), ale spíše **šablony, koncepty nebo "recepty"**, jak strukturovat kód, aby byl flexibilnější, srozumitelnější a udržovatelnější.
    - Jsou výsledkem zkušeností mnoha vývojářů, kteří narazili na podobné problémy a našli elegantní způsoby, jak je vyřešit. Klíčová je kniha "Design Patterns: Elements of Reusable Object-Oriented Software" od tzv. "Gang of Four" (GoF), která definovala 23 základních vzorů.

2.  **Proč jsou důležité? (Přínosy)**

    - **Znovu použitelnost (Reusability):** Vzory často vedou ke kódu, který je snazší znovu použít v jiných částech projektu nebo i v jiných projektech.
    - **Udržovatelnost (Maintainability):** Kód strukturovaný podle známých vzorů je obvykle snazší pochopit, upravovat a rozšiřovat. Když narazíš na problém, je méně pravděpodobné, že "rozbiješ" něco jiného.
    - **Flexibilita a Rozšiřitelnost (Flexibility & Extensibility):** Vzory pomáhají vytvářet systémy, které se snáze přizpůsobují změnám požadavků. Například přidání nové funkce nemusí znamenat přepsání poloviny kódu.
    - **Komunikace (Communication):** Poskytují **společný slovník** pro vývojáře. Když řekneš kolegovi: "Tady použijeme Factory Method," oba víte, o čem je řeč, aniž byste museli detailně popisovat strukturu. To je _obrovský_ přínos.

3.  **Základní Kategorie Vzorů (GoF)**
    - **Tvorbní (Creational):** Zabývají se **procesem vytváření objektů**. Pomáhají skrýt logiku vytváření objektů a umožňují systému být nezávislý na tom, jak jsou jeho objekty vytvářeny, skládány a reprezentovány. (Příklady: Factory Method, Abstract Factory, Builder, Singleton, Prototype)
    - **Strukturální (Structural):** Zabývají se **skládáním tříd a objektů do větších struktur**. Pomáhají zajistit, aby změny ve struktuře neměly dopad na celek. (Příklady: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy)
    - **Behaviorální (Behavioral):** Zabývají se **algoritmy a přidělováním zodpovědností mezi objekty**. Popisují vzorce komunikace mezi objekty a jak jsou zodpovědnosti rozděleny. (Příklady: Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor)

_Poznámka:_ Často zmiňovaný **Page Object Model (POM)** není GoF vzor, ale spíše **aplikační vzor** specifický pro UI automatizaci. Nicméně, POM _velmi často využívá_ principy a konkrétní GoF vzory (např. Factory Method nebo Builder pro tvorbu Page Objectů, Strategy pro různé akce na stránce atd.).
