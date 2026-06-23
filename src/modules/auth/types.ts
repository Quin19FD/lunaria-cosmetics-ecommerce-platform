export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export type AuthResult<T = User> =
  | { success: true; data: T }
  | { success: false; error: string };
