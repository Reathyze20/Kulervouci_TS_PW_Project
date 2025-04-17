import { ApiResponse } from "../../interfaces/data.interfaces";

async function getFirstElementExercise<T>(array: T[]): Promise<T | undefined> {
  if (array.length > 0) {
    return array[0];
  } else {
    return undefined;
  }
}

async function testGetFirstElement() {
  const numbers = [212, 2, 3, 4, 5];
  const animals = ["gepart", "cat", "rabbit"];

  const firstNumber = await getFirstElementExercise(numbers);
  console.log(`First number: ${firstNumber}`); // Expected output: 212

  const firstAnimal = await getFirstElementExercise(animals);
  console.log(`First animal: ${firstAnimal}`); // Expected output: "gepart"

  const emptyArray: number[] = [];
  const firstEmpty = await getFirstElementExercise(emptyArray);
  console.log(`First element of empty array: ${firstEmpty}`); // Expected output: undefined
}

testGetFirstElement();

const userRepsponse: ApiResponse<{ id: number; name: string }> = {
  data: { id: 1, name: "John Doe" },
  status: 200,
  statusText: "OK",
};

const productsReponse: ApiResponse<{
  id: number;
  name: string;
  price: number;
}> = {
  data: { id: 1, name: "Product A", price: 99.99 },
  status: 200,
  statusText: "OK",
};
