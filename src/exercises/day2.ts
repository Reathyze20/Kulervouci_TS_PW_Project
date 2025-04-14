const calculateRectangleArea = (lenght: number, width: number): number => {
  if (lenght <= 0 || width <= 0) {
    throw new Error("Délka a šířka musí být kladné číslo.");
  }
  return lenght * width;
};
console.log(`Obsah obdelniku je: ${calculateRectangleArea(5, 100)}`); // Obsah obdelniku je 500

const isEven = (num: number): boolean => {
  if (num % 2 === 0) {
    return true;
  } else {
    return false;
  }
};

console.log(`Je číslo 4 sudé? ${isEven(4)}`); // Je číslo 4 sudé? true
console.log(`Je číslo 5 sudé? ${isEven(5)}`); // Je číslo 5 sudé? false

let testResults: number[] = [85, 92, 72, 95, 88, 60];

let passingResults: number[] = testResults.filter((result) => result >= 75);

console.log(`Polozky ktere jsou vetsi nez 75: ${passingResults}`); // Polozky ktere prosly: 85, 92,  95, 88

let resultAsStrings: string[] = testResults.map(
  (result) => "Vysledek: " + result.toString()
);

console.log(`Polozky ktere prosly: ${resultAsStrings}`);

testResults.forEach((result) => {
  console.log(`Výsledek: ${result}`);
});

type LoginResult = [boolean, string];

function tryLogin(user: string, pass: string): LoginResult {
  if (user === "admin" && pass === "password") {
    return [true, "Uspěšné přihlášení"];
  }
  return [false, "Neplatné uživatelské jméno nebo heslo"];
}

console.log(tryLogin("admin", "password")); // [true, "Uspěšné přihlášení"]
console.log(tryLogin("adminka", "password2")); // [false, "Neplatné uživatelské jméno nebo heslo"]
