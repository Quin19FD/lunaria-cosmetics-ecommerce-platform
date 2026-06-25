"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  ward: string | null;
  district: string;
  city: string;
  isDefault: boolean;
}

export type AddressResult = { ok: true } | { ok: false; error: string };

export interface AddressInput {
  fullName: string;
  phone: string;
  street: string;
  ward?: string;
  district: string;
  city: string;
  isDefault?: boolean;
}

function validateInput(input: AddressInput): string | null {
  if (!input.fullName?.trim()) return "Vui lòng nhập họ tên người nhận.";
  if (!input.phone?.trim()) return "Vui lòng nhập số điện thoại.";
  if (!input.street?.trim()) return "Vui lòng nhập địa chỉ.";
  if (!input.district?.trim()) return "Vui lòng nhập quận/huyện.";
  if (!input.city?.trim()) return "Vui lòng nhập tỉnh/thành phố.";
  return null;
}

function normalizeInput(input: AddressInput) {
  return {
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    street: input.street.trim(),
    ward: input.ward?.trim() || null,
    district: input.district.trim(),
    city: input.city.trim(),
  };
}

export async function listAddresses(): Promise<UserAddress[]> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      fullName: true,
      phone: true,
      street: true,
      ward: true,
      district: true,
      city: true,
      isDefault: true,
    },
  });
}

export async function createAddress(
  input: AddressInput,
): Promise<AddressResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Phiên đăng nhập đã hết hạn." };

  const error = validateInput(input);
  if (error) return { ok: false, error };

  const data = normalizeInput(input);
  const existingCount = await prisma.address.count({ where: { userId } });
  const makeDefault = Boolean(input.isDefault) || existingCount === 0;

  if (makeDefault) {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      }),
      prisma.address.create({ data: { ...data, userId, isDefault: true } }),
    ]);
  } else {
    await prisma.address.create({
      data: { ...data, userId, isDefault: false },
    });
  }

  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function updateAddress(
  id: string,
  input: AddressInput,
): Promise<AddressResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Phiên đăng nhập đã hết hạn." };

  const existing = await prisma.address.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Không tìm thấy địa chỉ." };

  const error = validateInput(input);
  if (error) return { ok: false, error };

  const data = normalizeInput(input);

  if (input.isDefault) {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id },
        data: { ...data, isDefault: true },
      }),
    ]);
  } else {
    await prisma.address.update({
      where: { id },
      data: { ...data, isDefault: false },
    });
  }

  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function deleteAddress(id: string): Promise<AddressResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Phiên đăng nhập đã hết hạn." };

  const existing = await prisma.address.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Không tìm thấy địa chỉ." };

  try {
    await prisma.address.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        ok: false,
        error: "Địa chỉ đang gắn với đơn hàng, không thể xóa.",
      };
    }
    throw error;
  }

  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function setDefaultAddress(id: string): Promise<AddressResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Phiên đăng nhập đã hết hạn." };

  const existing = await prisma.address.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Không tìm thấy địa chỉ." };

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    }),
    prisma.address.update({ where: { id }, data: { isDefault: true } }),
  ]);

  revalidatePath("/account/addresses");
  return { ok: true };
}
