"use strict";
const message = "Hello, TypeScript!";
let count = 0;
const isLearning = true;
function greet(name) {
    console.log(`Hello, ${name}!`);
}
console.log(message);
count = +1;
console.log("Count:", count);
console.log(`Number of tries: ${count}`);
console.log(`Is learning TypeScript: ${isLearning}`);
greet("Thomas");
