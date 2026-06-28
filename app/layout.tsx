import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "러비의 사진관 · LoveCam",
  description: "AI 인생네컷 — 캐릭터/연예인과 함께 사진을 찍어보세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* center a phone-width frame so the web build mirrors the mobile screenshots */}
        <div className="mx-auto min-h-screen w-full max-w-[480px] bg-lovepink-50 shadow-card">
          {children}
        </div>
      </body>
    </html>
  );
}
