"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getFirstElementExercise(array) {
    return __awaiter(this, void 0, void 0, function* () {
        if (array.length > 0) {
            return array[0];
        }
        else {
            return undefined;
        }
    });
}
function testGetFirstElement() {
    return __awaiter(this, void 0, void 0, function* () {
        const numbers = [212, 2, 3, 4, 5];
        const animals = ["gepart", "cat", "rabbit"];
        const firstNumber = yield getFirstElementExercise(numbers);
        console.log(`First number: ${firstNumber}`); // Expected output: 1
        const firstAnimal = yield getFirstElementExercise(animals);
        console.log(`First animal: ${firstAnimal}`); // Expected output: "dog"
        const emptyArray = [];
        const firstEmpty = yield getFirstElementExercise(emptyArray);
        console.log(`First element of empty array: ${firstEmpty}`); // Expected output: undefined
    });
}
testGetFirstElement();
