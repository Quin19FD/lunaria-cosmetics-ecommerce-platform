import { ImageResponse } from "next/og";

// Default social preview for pages without their own image. ASCII-only text:
// the built-in font has no Vietnamese diacritics.
export const alt = "Lunaria Cosmetics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 96,
        background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
        color: "#1c1917",
      }}
    >
      <div style={{ fontSize: 36, color: "#ec4899", letterSpacing: 6 }}>
        ★ LUNARIA
      </div>
      <div style={{ fontSize: 88, fontWeight: 700, marginTop: 24 }}>
        Lunaria Cosmetics
      </div>
      <div style={{ fontSize: 40, marginTop: 24, color: "#57534e" }}>
        Skincare and makeup store
      </div>
    </div>,
    size,
  );
}
