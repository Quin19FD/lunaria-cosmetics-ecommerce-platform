import type { Metadata } from "next";

import {
  ContactForm,
  ContactHero,
  ContactInfo,
  ContactMap,
} from "@/features/contact";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ với Lunaria Beauty — chúng tôi luôn sẵn sàng hỗ trợ bạn",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Form — 3 cols */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Điền thông tin bên dưới, đội ngũ Lunaria sẽ liên hệ lại bạn sớm nhất.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Info cards — 2 cols */}
          <div className="lg:col-span-2">
            <ContactInfo />
          </div>
        </div>

        {/* Map */}
        <div className="mt-12">
          <ContactMap />
        </div>
      </div>
    </>
  );
}
