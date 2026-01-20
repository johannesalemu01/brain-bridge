"use client";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  language: "en" | "am";
  avatar?: string;
  grade?: string;
}

export const getToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem("bb_token") : null;

export const getUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("bb_user");
  return raw ? JSON.parse(raw) : null;
};

export const saveAuth = (token: string, user: AuthUser) => {
  localStorage.setItem("bb_token", token);
  localStorage.setItem("bb_user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("bb_token");
  localStorage.removeItem("bb_user");
};

export const isLoggedIn = (): boolean => !!getToken();
