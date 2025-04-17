import { LoginPage } from "../../pages/loginPage"; // Importuje třídu LoginPage z jiného souboru
import { test, Page, Browser } from "@playwright/test";

// Funkce pro provedení přihlašovacího procesu
// Co to dělá: Přihlašuje uživatele na stránku.
// Jak to dělá: Používá objekt LoginPage k navigaci na přihlašovací stránku, čeká na její načtení a provede přihlášení.
// Proč to dělá: Automatizuje proces přihlášení pro testování nebo jiné účely.
async function performLoginFlow(page: Page) {
  const loginPage = new LoginPage(page); // Používá poskytnutý objekt stránky
  await loginPage.navigate("https://example.com/login"); // Naviguje na přihlašovací stránku
  await loginPage.waitForPageToLoad(); // Čeká na načtení stránky

  try {
    await loginPage.login("username", "password"); // Provádí přihlášení s uživatelským jménem a heslem
    console.log("Login successful!"); // Loguje úspěšné přihlášení
  } catch (error) {
    console.error("Login failed:", error); // Loguje chybu při přihlášení
  }
}

// Funkce pro simulaci asynchronního úkolu
// Co to dělá: Simuluje úkol, který trvá určitý čas.
// Jak to dělá: Používá `setTimeout` k vytvoření zpoždění a poté vrací výsledek.
// Proč to dělá: Testuje asynchronní chování a paralelní zpracování.
async function fetchData(taskName: string, delay: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${taskName} completed after ${delay}ms`); // Loguje dokončení úkolu
      resolve(`${taskName} result`); // Vrací výsledek úkolu
    }, delay);
  });
}

// Funkce pro provedení paralelních úkolů
// Co to dělá: Spouští dva asynchronní úkoly paralelně a čeká na jejich dokončení.
// Jak to dělá: Používá `Promise.all` k paralelnímu spuštění úkolů a čeká na jejich výsledky.
// Proč to dělá: Zrychluje zpracování tím, že úkoly běží současně.
async function performParallelTasks() {
  try {
    console.log("Starting parallel tasks..."); // Loguje začátek paralelních úkolů

    const [result1, result2] = await Promise.all([
      fetchData("Task 1", 2000), // Simuluje první úkol s 2s zpožděním
      fetchData("Task 2", 1000), // Simuluje druhý úkol s 1s zpožděním
    ]);

    console.log("Both tasks completed:"); // Loguje dokončení obou úkolů
    console.log("Result 1:", result1); // Loguje výsledek prvního úkolu
    console.log("Result 2:", result2); // Loguje výsledek druhého úkolu
  } catch (error) {
    console.error("An error occurred during parallel tasks:", error); // Loguje chybu při paralelních úkolech
  }
}

// Spuštění funkce pro paralelní úkoly
performParallelTasks();

// Definice asynchronní funkce fetchDataWithError, která simuluje zpracování úkolu s možností chyby.
async function fetchDataWithError(
  taskName: string, // Název úkolu, který se má zpracovat.
  delay: number // Doba zpoždění v milisekundách, než se úkol dokončí.
): Promise<String> {
  // Vrací Promise, která buď vyřeší výsledek úkolu, nebo vyvolá chybu.
  return new Promise((resolve, reject) => {
    // Použití setTimeout k simulaci zpoždění zpracování úkolu.
    setTimeout(() => {
      // Kontrola, zda je název úkolu "Task 2".
      if (taskName === "Task 2") {
        // Pokud ano, vyvolá chybu pomocí reject.
        reject(new Error("Error in Task 2")); // Simulace chyby pro Task 2.
      } else {
        // Pokud ne, vypíše zprávu do konzole o dokončení úkolu.
        console.log(`${taskName} completed after ${delay}ms`);
        // Vyřeší Promise s výsledkem úkolu.
        resolve(`${taskName} result`); // Vrací výsledek úkolu.
      }
    }, delay); // Nastavení zpoždění podle parametru delay.
  });
}

async function performParallelTasksWithError() {
  try {
    const [result1, result2] = await Promise.all([
      fetchDataWithError("Task 1", 2000),
      fetchDataWithError("Task 2", 1000), // Tento úkol vyvolá chybu.
    ]);
    console.log("Task1 is completed:", result1);
    console.log("Task2 is completed:", result2);
  } catch (error) {
    console.log("Error in one of the tasks:", error);
  }
}

performParallelTasksWithError();
