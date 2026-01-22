
export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // For simulation only
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export enum Page {
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  DASHBOARD = 'DASHBOARD',
  COURSES = 'COURSES'
}
