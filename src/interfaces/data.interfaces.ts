export interface UserCredentials {
  readonly username: string;
  password: string;
}

export interface TestData {
  testName: string;
  priority?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  errors?: string;
}
