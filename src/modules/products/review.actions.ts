"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export interface ProductReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  authorName: string;
  createdAt: Date;
}

export async function getProductReviews(
  productId: string,
): Promise<ProductReview[]> {
  const reviews = await prisma.review.findMany({
    where: { productId, isVisible: true },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  return reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    authorName: r.user.name ?? r.user.email,
    createdAt: r.createdAt,
  }));
}

export type CreateReviewResult = { ok: true } | { ok: false; error: string };

export async function createReview(input: {
  productId: string;
  slug: string;
  rating: number;
  title?: string;
  comment?: string;
}): Promise<CreateReviewResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: "Vui lòng đăng nhập để đánh giá." };
  }

  const rating = Math.round(input.rating);
  if (rating < 1 || rating > 5) {
    return { ok: false, error: "Số sao không hợp lệ." };
  }

  await prisma.review.upsert({
    where: { productId_userId: { productId: input.productId, userId } },
    update: {
      rating,
      title: input.title?.trim() || null,
      comment: input.comment?.trim() || null,
    },
    create: {
      productId: input.productId,
      userId,
      rating,
      title: input.title?.trim() || null,
      comment: input.comment?.trim() || null,
    },
  });

  revalidatePath(`/products/${input.slug}`);
  return { ok: true };
}
