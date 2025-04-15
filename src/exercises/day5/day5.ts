export interface UserCredentials {
  readonly username: string;
  password: string;
}

export interface TestData {
  testName: string;
  priority?: number;
}

let credentials: UserCredentials = {
  username: "admin",
  password: "password123",
};

// let invalidCredentials: UserCredentials = {
//   username: "admin",
//   password: "password123",
//   rememberMe: true, // Chyba: 'rememberMe' není definováno v UserCredentials
// };

let testData: TestData = {
  testName: "Login Test",
  priority: 1,
};

// let invalidTestData: TestData = {
//   testName: "Login Test",
//   priority: "high", // Chyba: 'priority' musí být číslo nebo undefined
// };

export interface ILoginPageActions {
  fillUsername(username: string): void;
  fillPassword(password: string): void;
  clickLoginButton(): void;
}
