"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export interface ProductTabsProps {
  description: string;
  reviewCount: number;
}

export const ProductTabs = ({ description, reviewCount }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "Mô tả" },
    { id: 1, label: "Thành phần" },
    { id: 2, label: "Hướng dấn sử dụng" },
    { id: 3, label: `Đánh giá (${reviewCount})` },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="border-b border-neutral-200">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-3 font-medium transition-colors duration-200 border-b-2 border-transparent",
                activeTab === tab.id
                  ? "text-brand-500 border-b-2 border-brand-500"
                  : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="prose prose-sm text-neutral-600 leading-relaxed">
        {activeTab === 0 && (
          <div>
            <p>{description}</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Lớp finish mịn màng, không gây khô môi nhờ chiết xuất từ dầu
                Jojoba và Vitamin E.
              </li>
              <li>
                Bám màu lên đến 8 tiếng, không để lại vết vệt hay loang lổ khi
                ăn uống.
              </li>
              <li>
                Thiết kế vỏ son sang trọng với gam màu vàng hồng đặc trưng của
                LUNARIA.
              </li>
              <li>
                Công thức nhẹ môi, tạo cảm giác thoải mái suốt cả ngày dài.
              </li>
            </ul>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <p>
              Thành phần chính: Cera Microcristallina, Ozokerite, Lanolin,
              Synthetic Fluorphlogopite, Jojoba Oil, Vitamin E, Iron Oxides
              (CI 77491, CI 77492, CI 77499), Titanium Dioxide (CI 77891).
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                <strong>Cera Microcristallina:</strong> Tạo độ bền vững cho son.
              </li>
              <li>
                <strong>Jojoba Oil:</strong> Dưỡng ẩm tự nhiên, giữ môi mềm mại
                suốt ngày.
              </li>
              <li>
                <strong>Vitamin E:</strong> Chống oxy hóa, bảo vệ môi khỏi tác
                động của tia UV.
              </li>
              <li>
                <strong>Iron Oxides:</strong> Tạo màu sắc tự nhiên, an toàn cho
                da.
              </li>
            </ul>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <p>
              Hướng dẫn sử dụng son môi LUNARIA để đạt hiệu quả tốt nhất:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Bước 1: Làm sạch và dưỡng ẩm cho môi bằng lip balm trước khi
                thoa son.
              </li>
              <li>
                Bước 2: Thoa từ từ một lớp son mỏng từ giữa môi dưới ra ngoài
                hai bên.
              </li>
              <li>
                Bước 3: Nhấc môi lên nhẹ nhàng để phân bổ đều màu sắc trên toàn
                bộ môi.
              </li>
              <li>
                Bước 4: Để khô tự nhiên trong 30 giây để son bám lâu hơn.
              </li>
              <li>
                Mẹo: Sử dụng chì kẻ môi cùng tông màu để tăng độ bền màu và
                tạo độ định nghĩa rõ nét hơn.
              </li>
            </ul>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <p className="text-neutral-500">
              {reviewCount === 0
                ? "Chưa có đánh giá nào."
                : `Hiện có ${reviewCount} đánh giá cho sản phẩm này.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
