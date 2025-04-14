const message: string = "Hello, TypeScript!";

let count: number = 0;

const isLearning: boolean = true;

function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

console.log(message);
count = +1;

console.log("Count:", count);
console.log(`Number of tries: ${count}`);
console.log(`Is learning TypeScript: ${isLearning}`);

greet("Thomas");
