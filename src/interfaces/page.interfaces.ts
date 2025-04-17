import { ILoginPageActions } from "../exercises/day5/day5";
import { TestData, UserCredentials } from "./data.interfaces";
// Definice rozhraní pro akce na přihlašovací stránce

// Definice třídy LoginPage, která implementuje rozhraní ILoginPageActions
export class LoginPage implements ILoginPageActions {
  /**
   * Metoda pro vyplnění pole uživatelského jména na přihlašovací stránce.
   *
   * @param username - Uživatelské jméno, které má být zadáno do vstupního pole.
   */
  fillUsername(username: string): void {
    // Vypíše do konzole zprávu s vyplněným uživatelským jménem
    console.log(`Vyplněno uživatelské jméno: ${username}`);
  }

  /**
   * Metoda pro vyplnění pole hesla na přihlašovací stránce.
   *
   * @param password - Heslo, které má být zadáno do vstupního pole.
   */
  fillPassword(password: string): void {
    // Vypíše do konzole zprávu s vyplněným heslem
    console.log(`Vyplněno heslo: ${password}`);
  }

  /**
   * Metoda pro simulaci kliknutí na tlačítko přihlášení.
   */
  clickLoginButton(): void {
    // Vypíše do konzole zprávu o kliknutí na tlačítko přihlášení
    console.log("Kliknuto na tlačítko Přihlásit se");
  }
}

// Vytvoření instance třídy LoginPage
let loginPage = new LoginPage();

// Zavolání metody fillUsername pro vyplnění uživatelského jména
loginPage.fillUsername("admin");

// Zavolání metody fillPassword pro vyplnění hesla
loginPage.fillPassword("password123");

// Zavolání metody clickLoginButton pro simulaci kliknutí na tlačítko přihlášení
loginPage.clickLoginButton();

/**
 * Funkce pro zpracování testovacích dat.
 *
 * @param testData - Objekt obsahující informace o testu.
 */
function processTestData(testData: TestData): void {
  // Vypíše do konzole název testu
  console.log(`Název testu: ${testData.testName}`);

  // Zkontroluje, zda je nastavena priorita testu
  if (testData.priority !== undefined) {
    // Pokud je priorita nastavena, vypíše ji do konzole
    console.log(`Priorita: ${testData.priority}`);
  } else {
    // Pokud priorita není nastavena, vypíše odpovídající zprávu
    console.log("Priorita není nastavena.");
  }
}

// Zavolání funkce processTestData s testovacími daty obsahujícími prioritu
processTestData({ testName: "Login Test", priority: 1 });

// Zavolání funkce processTestData s testovacími daty bez priority
processTestData({ testName: "Logout Test" }); // Priorita bude undefined

function processUserCredentials(userCredentials: UserCredentials): void {
  // userCredentials.username = "karel"; // Chyba: 'username' je readonly
  userCredentials.password = "newpassword"; // Toto je povoleno

  if (userCredentials.password.length < 8) {
    console.log("Heslo musí mít alespoň 8 znaků.");
  }
}
