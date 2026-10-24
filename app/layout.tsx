import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalLoadingProvider } from "@/component/GlobalLoading";
import ScrollToTop from "@/component/ScrollToTop";
import SocialContactButtons from "@/component/SocialContactButtons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  formatDetection: {
    telephone: false,
    email: false,
  },
  title: "MB Solar | Năng lượng sạch cho tương lai",
  description: "Giải pháp năng lượng mặt trời toàn diện từ MB Solar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GlobalLoadingProvider>
          {children}
          <SocialContactButtons />
          <ScrollToTop />
        </GlobalLoadingProvider>
      </body>
    </html>
  );
}
