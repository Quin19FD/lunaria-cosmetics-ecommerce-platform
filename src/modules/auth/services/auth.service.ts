import { USERS_MOCK } from "../data/users.mock";
import type { AuthResult, LoginPayload, RegisterPayload, User } from "../types";

// In-memory registry so new registrations survive within a session.
// Resets on page reload — replace with API call when backend is ready.
const users = [...USERS_MOCK];
let nextId = users.length + 1;

function toUser(stored: (typeof users)[number]): User {
  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    avatar: stored.avatar,
  };
}

// Simulate async network delay
function delay(ms = 600): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    await delay();

    if (!payload.email || !payload.password) {
      return { success: false, error: "Vui lòng nhập email và mật khẩu" };
    }

    const found = users.find(
      (u) =>
        u.email.toLowerCase() === payload.email.toLowerCase() &&
        u.password === payload.password,
    );

    if (!found) {
      return { success: false, error: "Email hoặc mật khẩu không đúng" };
    }

    return { success: true, data: toUser(found) };
  },

  async register(payload: RegisterPayload): Promise<AuthResult> {
    await delay();

    if (!payload.name.trim()) {
      return { success: false, error: "Vui lòng nhập họ tên" };
    }
    if (!payload.email.trim()) {
      return { success: false, error: "Vui lòng nhập email" };
    }
    if (payload.password.length < 6) {
      return { success: false, error: "Mật khẩu tối thiểu 6 ký tự" };
    }

    const exists = users.some(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase(),
    );
    if (exists) {
      return { success: false, error: "Email đã được sử dụng" };
    }

    const newUser = {
      id: `user_${String(++nextId).padStart(2, "0")}`,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    };
    users.push(newUser);

    return { success: true, data: toUser(newUser) };
  },
};
