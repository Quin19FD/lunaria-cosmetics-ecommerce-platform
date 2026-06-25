import type { Prisma } from "@prisma/client";

import { Badge, Button, Select } from "@/components/ui";
import {
  DataTable,
  DeleteButton,
  FilterBar,
  PageHeader,
  Pagination,
  type Column,
} from "@/features/admin";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

import { deleteReview, toggleReview } from "./actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

type ReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVisible: boolean;
  createdAt: Date;
  product: { name: string };
  user: { name: string | null; email: string };
};

function ratingVariant(rating: number): "success" | "warning" | "danger" {
  if (rating >= 4) return "success";
  if (rating === 3) return "warning";
  return "danger";
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    visibility?: string;
    rating?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const visibility = sp.visibility ?? "";
  const rating = sp.rating ?? "";
  const hasActiveFilters = !!(visibility || rating);

  const where: Prisma.ReviewWhereInput = {};
  if (visibility === "visible") where.isVisible = true;
  else if (visibility === "hidden") where.isVisible = false;
  const ratingNum = Number(rating);
  if (rating && ratingNum >= 1 && ratingNum <= 5) where.rating = ratingNum;

  const [rows, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        product: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.review.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns: Column<ReviewRow>[] = [
    {
      header: "Sản phẩm",
      cell: (review) => (
        <span className="font-medium text-neutral-900">
          {review.product.name}
        </span>
      ),
    },
    {
      header: "Khách",
      cell: (review) => review.user.name ?? review.user.email,
    },
    {
      header: "Điểm",
      align: "center",
      cell: (review) => (
        <Badge variant={ratingVariant(review.rating)}>{review.rating}/5</Badge>
      ),
    },
    {
      header: "Nội dung",
      cell: (review) => (
        <div className="max-w-xs">
          {review.title && (
            <p className="font-medium text-neutral-900">{review.title}</p>
          )}
          {review.comment && (
            <p className="line-clamp-2 text-xs text-neutral-500">
              {review.comment}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Trạng thái",
      cell: (review) =>
        review.isVisible ? (
          <Badge variant="success">Hiển thị</Badge>
        ) : (
          <Badge variant="neutral">Đã ẩn</Badge>
        ),
    },
    {
      header: "Ngày",
      cell: (review) => formatDate(review.createdAt),
    },
    {
      header: "Thao tác",
      align: "right",
      cell: (review) => (
        <div className="flex items-center justify-end gap-2">
          <form action={toggleReview.bind(null, review.id)}>
            <Button type="submit" variant="outline" size="sm">
              {review.isVisible ? "Ẩn" : "Hiện"}
            </Button>
          </form>
          <DeleteButton action={deleteReview.bind(null, review.id)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Đánh giá" />
      <FilterBar basePath="/admin/reviews" hasActiveFilters={hasActiveFilters}>
        <Select
          name="visibility"
          label="Trạng thái"
          defaultValue={visibility}
          className="h-9 w-44"
        >
          <option value="">Tất cả</option>
          <option value="visible">Hiển thị</option>
          <option value="hidden">Đã ẩn</option>
        </Select>
        <Select
          name="rating"
          label="Số sao"
          defaultValue={rating}
          className="h-9 w-36"
        >
          <option value="">Tất cả</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </Select>
      </FilterBar>
      <DataTable
        columns={columns}
        rows={rows}
        getKey={(review) => review.id}
        empty="Chưa có đánh giá nào."
      />
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
