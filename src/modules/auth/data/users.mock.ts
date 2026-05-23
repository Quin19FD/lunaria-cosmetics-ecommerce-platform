export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const USERS_MOCK: StoredUser[] = [
  {
    id: "user_01",
    name: "Minh Anh",
    email: "minhanh@lunaria.beauty",
    password: "123456",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&q=80",
  },
  {
    id: "user_02",
    name: "Admin Lunaria",
    email: "admin@lunaria.beauty",
    password: "admin123",
  },
];
