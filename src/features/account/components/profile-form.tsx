"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { updateProfile } from "@/modules/account/actions";

export function ProfileForm() {
  const mounted = useMounted();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize form from user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(false);

    const result = await updateProfile({
      name: formData.name,
      phone: formData.phone || undefined,
    });

    setIsLoading(false);

    if (result.ok) {
      setSuccessMessage(true);
      router.refresh();
      setTimeout(() => setSuccessMessage(false), 2000);
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleAvatarChange = () => {
    // Placeholder for avatar change logic
    console.log("Change avatar");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-xl font-bold text-neutral-900">
            Thông tin cá nhân
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Quản lý thông tin hồ sơ của bạn
          </p>
        </div>

        {/* Avatar Section */}
        <div className="mb-8 flex items-center gap-6">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? ""}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-neutral-400">
                  {user?.name?.charAt(0).toUpperCase() || "?"}
                </span>
              )}
            </div>
            <button
              onClick={handleAvatarChange}
              className={cn(
                "bg-brand-500 hover:bg-brand-600 absolute right-0 bottom-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white transition-all",
              )}
              aria-label="Change avatar"
              type="button"
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">{user?.name}</p>
            <p className="text-sm text-neutral-600">{user?.email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Họ và tên"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên"
            />

            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled
              placeholder="Email của bạn"
            />

            <Input
              label="Số điện thoại"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              ✓ Thông tin đã được cập nhật thành công!
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading} variant="default">
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
