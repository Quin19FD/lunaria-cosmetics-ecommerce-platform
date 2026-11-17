"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function toggleReview(id: string) {
  await requireAdmin();
  const review = await prisma.review.findUnique({
    where: { id },
    select: { isVisible: true },
  });
  if (!review) return;
  await prisma.review.update({
    where: { id },
    data: { isVisible: !review.isVisible },
  });
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
}
