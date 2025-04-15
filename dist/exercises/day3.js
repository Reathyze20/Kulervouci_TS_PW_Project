"use strict";
let data = [
    12, 4, 6, 8, 20, 43, 49, 51, 23, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
];
let found = false;
for (let i = 0; i < data.length; i++) {
    if (data[i] > 50) {
        console.log(`Číslo ${data[i]} je větší než 50`);
        found = true;
        break;
    }
}
if (!found) {
    console.log("Žádné číslo větší než 50 nebylo nalezeno.");
}
// Tento kód hledá číslo větší než 50 v poli `data` pomocí `while` smyčky.
// Nejprve se nastaví proměnná `index` na 0, která bude sloužit jako čítač pro iteraci přes pole.
let index = 0;
// Smyčka `while` pokračuje, dokud je hodnota `index` menší než délka pole `data`.
while (index < data.length) {
    // Uvnitř smyčky se kontroluje, zda je aktuální číslo v poli větší než 50.
    if (data[index] > 50) {
        // Pokud ano, vypíše se zpráva s nalezeným číslem, nastaví se proměnná `found` na `true` a smyčka se ukončí pomocí `break`.
        console.log(`Číslo ${data[index]} je větší než 50`);
        found = true;
        break;
    }
    // Zvýšení čítače `index` pro další iteraci.
    index++;
}
// Pokud se smyčka dokončí bez nalezení čísla většího než 50, vypíše se zpráva, že žádné takové číslo nebylo nalezeno.
if (!found) {
    console.log("Žádné číslo větší než 50 nebylo nalezeno.");
}
const testConfig = {
    browser: "chrome",
    baseUrl: "http://localhost:3000",
    retries: 3,
    headless: true,
};
for (const key in testConfig) {
    console.log(`Konfigurace ${key}: ${testConfig[key]}`);
}
const loginTestData = {
    username: "admin",
    password: "password",
    expectedMessage: "Uspěšné přihlášení",
};
function displayLoginData(data) {
    console.log(`---- Testovaci data pro prihlaseni ----`);
    console.log(`Uživatelské jméno: ${data.username}`);
    console.log(`Heslo: ${data.password}`);
    console.log(`Očekávaná zpráva: ${data.expectedMessage}`);
    console.log("--------------------------------------");
}
displayLoginData(loginTestData);
