import type { Metadata } from "next";

import { ProfileForm } from "@/features/account";

export const metadata: Metadata = {
  title: "Thông tin cá nhân",
};

export default function ProfilePage() {
  return <ProfileForm />;
}
