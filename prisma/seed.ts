import { PrismaClient, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUsers() {
  const customerPw = await bcrypt.hash("123456", 10);
  const adminPw = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "demo@lunaria.beauty" },
    update: {},
    create: {
      name: "Minh Anh",
      email: "demo@lunaria.beauty",
      password: customerPw,
      role: "CUSTOMER",
    },
  });
  await prisma.user.upsert({
    where: { email: "admin@lunaria.beauty" },
    update: { role: "SUPER_ADMIN" },
    create: {
      name: "Admin Lunaria",
      email: "admin@lunaria.beauty",
      password: adminPw,
      role: "SUPER_ADMIN",
    },
  });
  for (const [name, email] of [
    ["Thu Hà", "thuha@example.com"],
    ["Quốc Bảo", "baoq@example.com"],
    ["Lan Phương", "lanphuong@example.com"],
  ] as const) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, password: customerPw, role: "CUSTOMER" },
    });
  }
}

const CATEGORIES = [
  { name: "Chăm sóc da", slug: "cham-soc-da" },
  { name: "Trang điểm", slug: "trang-diem" },
  { name: "Chăm sóc tóc", slug: "cham-soc-toc" },
  { name: "Nước hoa", slug: "nuoc-hoa" },
  { name: "Chống nắng", slug: "chong-nang" },
];

const BRANDS = [
  { name: "Lunaria", slug: "lunaria", country: "Việt Nam" },
  { name: "Élégance", slug: "elegance", country: "Pháp" },
  { name: "Sakura", slug: "sakura", country: "Nhật Bản" },
];

interface SeedProduct {
  name: string;
  slug: string;
  categorySlug: string;
  brandSlug: string;
  isFeatured: boolean;
  badge: string | null;
  skinTypes: string[];
  description: string;
  ingredients: string;
  howToUse: string;
  variants: {
    sku: string;
    name: string;
    price: number;
    salePrice?: number;
    stock: number;
  }[];
}

function img(name: string): string {
  return `https://placehold.co/600x600/fce7f0/ef3985?text=${encodeURIComponent(name)}`;
}

const PRODUCTS: SeedProduct[] = [
  {
    name: "Serum Vitamin C dưỡng sáng",
    slug: "serum-vitamin-c",
    categorySlug: "cham-soc-da",
    brandSlug: "lunaria",
    isFeatured: true,
    badge: "bestseller",
    skinTypes: ["da-thuong", "da-kho"],
    description:
      "Serum dưỡng sáng da với 15% Vitamin C tinh khiết, làm mờ thâm nám.",
    ingredients: "Ascorbic Acid 15%, Vitamin E, Ferulic Acid, Hyaluronic Acid.",
    howToUse: "Dùng buổi sáng, 3-4 giọt lên mặt sạch trước kem chống nắng.",
    variants: [
      { sku: "SVC-30", name: "30ml", price: 450000, stock: 120 },
      { sku: "SVC-50", name: "50ml", price: 650000, stock: 40 },
    ],
  },
  {
    name: "Kem dưỡng ẩm Hyaluronic",
    slug: "kem-duong-am-hyaluronic",
    categorySlug: "cham-soc-da",
    brandSlug: "elegance",
    isFeatured: true,
    badge: "hot",
    skinTypes: ["da-kho", "da-nhay-cam"],
    description:
      "Kem dưỡng ẩm sâu với Hyaluronic Acid đa phân tử, cấp nước 72 giờ.",
    ingredients: "Hyaluronic Acid, Ceramide, Glycerin, Squalane.",
    howToUse: "Thoa sáng và tối sau bước serum.",
    variants: [{ sku: "KDA-50", name: "50ml", price: 520000, stock: 8 }],
  },
  {
    name: "Nước tẩy trang dịu nhẹ",
    slug: "nuoc-tay-trang-diu-nhe",
    categorySlug: "cham-soc-da",
    brandSlug: "lunaria",
    isFeatured: false,
    badge: null,
    skinTypes: ["da-nhay-cam", "da-thuong"],
    description:
      "Nước tẩy trang Micellar làm sạch lớp trang điểm mà không gây khô.",
    ingredients: "Micellar Water, Panthenol, chiết xuất hoa cúc.",
    howToUse: "Thấm ra bông tẩy trang, lau nhẹ toàn mặt.",
    variants: [{ sku: "NTT-400", name: "400ml", price: 245000, stock: 75 }],
  },
  {
    name: "Son lì màu hồng đất",
    slug: "son-li-hong-dat",
    categorySlug: "trang-diem",
    brandSlug: "lunaria",
    isFeatured: true,
    badge: "new",
    skinTypes: [],
    description: "Son lì lâu trôi, màu hồng đất sang trọng, không khô môi.",
    ingredients: "Sáp ong, Vitamin E, dầu jojoba.",
    howToUse: "Thoa trực tiếp lên môi, có thể dặm 2 lớp.",
    variants: [
      { sku: "SON-01", name: "Hồng đất", price: 280000, stock: 200 },
      { sku: "SON-02", name: "Đỏ cam", price: 280000, stock: 150 },
    ],
  },
  {
    name: "Phấn nền kiềm dầu",
    slug: "phan-nen-kiem-dau",
    categorySlug: "trang-diem",
    brandSlug: "sakura",
    isFeatured: true,
    badge: "sale",
    skinTypes: ["da-dau"],
    description: "Phấn nền che phủ tốt, kiềm dầu suốt 12 giờ.",
    ingredients: "Silica, SPF20, chiết xuất trà xanh.",
    howToUse: "Dùng cọ hoặc mút tán đều lên mặt.",
    variants: [
      {
        sku: "PN-N1",
        name: "Tông N1",
        price: 390000,
        salePrice: 320000,
        stock: 60,
      },
      {
        sku: "PN-N2",
        name: "Tông N2",
        price: 390000,
        salePrice: 320000,
        stock: 0,
      },
    ],
  },
  {
    name: "Mascara làm dày mi",
    slug: "mascara-lam-day-mi",
    categorySlug: "trang-diem",
    brandSlug: "elegance",
    isFeatured: false,
    badge: null,
    skinTypes: [],
    description: "Mascara chống lem, làm dày và cong mi tự nhiên.",
    ingredients: "Carnauba wax, Provitamin B5.",
    howToUse: "Chải từ gốc mi lên ngọn, 1-2 lớp.",
    variants: [{ sku: "MAS-01", name: "Đen", price: 195000, stock: 110 }],
  },
  {
    name: "Dầu gội thảo dược",
    slug: "dau-goi-thao-duoc",
    categorySlug: "cham-soc-toc",
    brandSlug: "sakura",
    isFeatured: false,
    badge: null,
    skinTypes: [],
    description: "Dầu gội chiết xuất thảo dược, giảm gãy rụng, sạch gàu.",
    ingredients: "Bồ kết, hương nhu, biotin.",
    howToUse: "Massage lên tóc ướt, xả sạch.",
    variants: [
      { sku: "DG-300", name: "300ml", price: 180000, stock: 90 },
      { sku: "DG-500", name: "500ml", price: 260000, stock: 45 },
    ],
  },
  {
    name: "Dầu xả phục hồi",
    slug: "dau-xa-phuc-hoi",
    categorySlug: "cham-soc-toc",
    brandSlug: "sakura",
    isFeatured: false,
    badge: null,
    skinTypes: [],
    description: "Dầu xả phục hồi tóc hư tổn, mềm mượt tức thì.",
    ingredients: "Keratin, dầu argan, panthenol.",
    howToUse: "Thoa lên thân tóc sau khi gội, ủ 2 phút rồi xả.",
    variants: [{ sku: "DX-300", name: "300ml", price: 190000, stock: 70 }],
  },
  {
    name: "Nước hoa Hương Nhài",
    slug: "nuoc-hoa-huong-nhai",
    categorySlug: "nuoc-hoa",
    brandSlug: "elegance",
    isFeatured: true,
    badge: "bestseller",
    skinTypes: [],
    description: "Nước hoa hương nhài thanh lịch, lưu hương lâu suốt ngày dài.",
    ingredients: "Tinh dầu nhài, hương gỗ tuyết tùng, xạ hương trắng.",
    howToUse: "Xịt lên cổ tay và sau tai.",
    variants: [
      { sku: "NH-50", name: "50ml", price: 1250000, stock: 25 },
      { sku: "NH-100", name: "100ml", price: 1950000, stock: 12 },
    ],
  },
  {
    name: "Kem chống nắng SPF50+",
    slug: "kem-chong-nang-spf50",
    categorySlug: "chong-nang",
    brandSlug: "lunaria",
    isFeatured: true,
    badge: "hot",
    skinTypes: ["da-dau", "da-thuong", "da-nhay-cam"],
    description: "Kem chống nắng SPF50+ PA++++ không nhờn rít, nâng tông nhẹ.",
    ingredients: "Zinc Oxide, Niacinamide, chiết xuất rau má.",
    howToUse:
      "Thoa lượng vừa đủ 15 phút trước khi ra nắng, dặm lại sau 2-3 giờ.",
    variants: [{ sku: "KCN-50", name: "50ml", price: 320000, stock: 140 }],
  },
];

async function seedCatalog() {
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }
  for (const b of BRANDS) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }
  for (const p of PRODUCTS) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: p.categorySlug },
    });
    const brand = await prisma.brand.findUniqueOrThrow({
      where: { slug: p.brandSlug },
    });
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        ingredients: p.ingredients,
        howToUse: p.howToUse,
        isFeatured: p.isFeatured,
        badge: p.badge,
        skinTypes: p.skinTypes,
        categoryId: category.id,
        brandId: brand.id,
        variants: { create: p.variants },
        images: {
          create: [
            { url: img(p.name), alt: p.name, position: 0 },
            { url: img(`${p.name} 2`), alt: p.name, position: 1 },
            { url: img(`${p.name} 3`), alt: p.name, position: 2 },
          ],
        },
      },
    });
  }
}

const REVIEW_TEXTS = [
  {
    rating: 5,
    title: "Rất hài lòng",
    comment: "Sản phẩm tốt, giao hàng nhanh, sẽ mua lại.",
  },
  {
    rating: 5,
    title: "Tuyệt vời",
    comment: "Dùng hợp da, hiệu quả thấy rõ sau 2 tuần.",
  },
  { rating: 4, title: "Khá ổn", comment: "Chất lượng tốt so với giá tiền." },
  { rating: 4, title: "Ổn áp", comment: "Đóng gói cẩn thận, hương dễ chịu." },
];

async function seedReviews() {
  const products = await prisma.product.findMany({ select: { id: true } });
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: { id: true },
  });
  if (customers.length === 0) return;

  for (let pi = 0; pi < products.length; pi++) {
    // 0–4 reviews per product, deterministic spread
    const count = pi % 5;
    for (let ri = 0; ri < count && ri < customers.length; ri++) {
      const tpl = REVIEW_TEXTS[(pi + ri) % REVIEW_TEXTS.length];
      await prisma.review.create({
        data: {
          productId: products[pi].id,
          userId: customers[ri].id,
          rating: tpl.rating,
          title: tpl.title,
          comment: tpl.comment,
          isVisible: true,
        },
      });
    }
  }
}

async function seedOrders() {
  const customer = await prisma.user.findUniqueOrThrow({
    where: { email: "demo@lunaria.beauty" },
  });
  const variants = await prisma.productVariant.findMany({ take: 5 });
  if (variants.length === 0) return;

  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: "Minh Anh",
      phone: "0901234567",
      street: "123 Lê Lợi",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
      isDefault: true,
    },
  });

  const statuses: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ];

  for (let i = 0; i < statuses.length; i++) {
    const v = variants[i % variants.length];
    const quantity = (i % 3) + 1;
    const subtotal = v.price * quantity;
    const shippingCost = 30000;
    await prisma.order.create({
      data: {
        userId: customer.id,
        addressId: address.id,
        status: statuses[i],
        subtotal,
        shippingCost,
        total: subtotal + shippingCost,
        items: { create: { variantId: v.id, quantity, unitPrice: v.price } },
      },
    });
  }
}

async function resetTransactional() {
  // Deterministic dev seed: clear catalog + transactional data, keep users.
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
}

async function main() {
  console.log("🌱 Seeding database...");
  await seedUsers();
  await resetTransactional();
  await seedCatalog();
  await seedReviews();
  await seedOrders();
  console.log("   • admin: admin@lunaria.beauty / admin123");
  console.log("   • customer: demo@lunaria.beauty / 123456");
  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
