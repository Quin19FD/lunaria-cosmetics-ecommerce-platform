-- CreateEnum
CREATE TYPE "PromoColor" AS ENUM ('pink', 'purple', 'amber', 'emerald');

-- CreateTable
CREATE TABLE "promotions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "color" "PromoColor" NOT NULL DEFAULT 'pink',
    "productSlugs" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "highlightWord" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT[],
    "ctaLabel" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "cardImage" TEXT NOT NULL,
    "productSlugs" TEXT[],
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promotions_code_key" ON "promotions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_key" ON "collections"("slug");
