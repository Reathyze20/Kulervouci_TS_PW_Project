// Pole `data` obsahuje seznam čísel, která budou prohledávána.
let data: number[] = [
  12, 4, 6, 8, 20, 43, 49, 51, 23, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
];

// Proměnná `found` slouží k označení, zda bylo nalezeno číslo větší než 50.
let found = false;

// Smyčka `for` iteruje přes všechna čísla v poli `data`.
for (let i = 0; i < data.length; i++) {
  // Kontrola, zda je aktuální číslo větší než 50.
  if (data[i] > 50) {
    // Pokud ano, vypíše se zpráva s nalezeným číslem.
    console.log(`Číslo ${data[i]} je větší než 50`);
    // Nastaví se `found` na `true`, protože číslo bylo nalezeno.
    found = true;
    // Smyčka se ukončí pomocí `break`.
    break;
  }
}

// Pokud nebylo nalezeno žádné číslo větší než 50, vypíše se odpovídající zpráva.
if (!found) {
  console.log("Žádné číslo větší než 50 nebylo nalezeno.");
}

// Nastavení proměnné `index` na 0 pro iteraci přes pole pomocí `while` smyčky.
let index = 0;

// Smyčka `while` pokračuje, dokud je hodnota `index` menší než délka pole `data`.
while (index < data.length) {
  // Kontrola, zda je aktuální číslo větší než 50.
  if (data[index] > 50) {
    // Pokud ano, vypíše se zpráva s nalezeným číslem.
    console.log(`Číslo ${data[index]} je větší než 50`);
    // Nastaví se `found` na `true`, protože číslo bylo nalezeno.
    found = true;
    // Smyčka se ukončí pomocí `break`.
    break;
  }
  // Zvýšení hodnoty `index` pro další iteraci.
  index++;
}

// Pokud nebylo nalezeno žádné číslo větší než 50, vypíše se odpovídající zpráva.
if (!found) {
  console.log("Žádné číslo větší než 50 nebylo nalezeno.");
}

// Objekt `testConfig` obsahuje konfiguraci pro testování, jako je prohlížeč, URL, počet pokusů a režim.
const testConfig = {
  browser: "chrome", // Prohlížeč, který se použije pro testování.
  baseUrl: "http://localhost:3000", // Základní URL aplikace.
  retries: 3, // Počet pokusů při selhání testu.
  headless: true, // Režim bez grafického rozhraní.
};

// Smyčka `for-in` iteruje přes všechny klíče objektu `testConfig`.
for (const key in testConfig) {
  // Vypíše konfiguraci pro každý klíč a jeho hodnotu.
  console.log(
    `Konfigurace ${key}: ${testConfig[key as keyof typeof testConfig]}`
  );
}

// Objekt `loginTestData` obsahuje testovací data pro přihlášení.
const loginTestData = {
  username: "admin", // Uživatelské jméno pro přihlášení.
  password: "password", // Heslo pro přihlášení.
  expectedMessage: "Uspěšné přihlášení", // Očekávaná zpráva po úspěšném přihlášení.
};

// Funkce `displayLoginData` vypisuje testovací data pro přihlášení.
function displayLoginData(data: {
  username: string; // Uživatelské jméno.
  password: string; // Heslo.
  expectedMessage: string; // Očekávaná zpráva.
}) {
  // Vypíše hlavičku pro testovací data.
  console.log(`---- Testovaci data pro prihlaseni ----`);
  // Vypíše uživatelské jméno.
  console.log(`Uživatelské jméno: ${data.username}`);
  // Vypíše heslo.
  console.log(`Heslo: ${data.password}`);
  // Vypíše očekávanou zprávu.
  console.log(`Očekávaná zpráva: ${data.expectedMessage}`);
  // Vypíše oddělovač.
  console.log("---------------------------------------");
}

// Zavolání funkce `displayLoginData` s testovacími daty.
displayLoginData(loginTestData);
