function identity<T>(arg: T): T {
  console.log(`Typ argumentu je: ${typeof arg}`);
  return arg;
}

let outputString = identity<string>("Hello, world!");

console.log(outputString.toUpperCase());

let outputNumber = identity<number>(123);

console.log(outputNumber + 222);

function getFirstElement<T>(pole: T[]): T | undefined {
  if (pole.length > 0) {
    console.log(pole[0]);
    return pole[0];
  }

  return undefined;
}

let cisla = [1, 2, 3, 4, 5];

let prvniCislo = getFirstElement(cisla);

let zvirata = ["pes", "kočka", "králík"];

let prvniZviratko = getFirstElement(zvirata);
