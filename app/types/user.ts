export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: "admin" | "user" | "moderator";
}

export interface UserToken {
    token: string;
    expiresAt: string;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export type UserAction =
  | { type: "loading" }
  | { type: "loaded"; user: User }
  | { type: "login_success"; user: User }
  | { type: "logout" }
  | { type: "update"; updates: Partial<User> }
  | { type: "error"; message: string };