// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vinnydao.dev"),
  title: "Vinny Dao | Full-Stack Developer",
  description: "Full-stack developer based in Brisbane. I study Information Technology at QUT and build full-stack web apps in JavaScript and Python.",
  icons: {
    icon: "/Vinny.D.jpg",
    apple: "/Vinny.D.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body
        className={`${geistSans.className} bg-zinc-950 text-zinc-100 antialiased`}
      >
        <div className="min-h-screen flex">
          {/* Sidebar - handles both desktop and mobile */}
          <Sidebar />
          
          {/* Main content area */}
          <div className="flex-1 md:ml-[260px] ml-10px">
            <main className="min-h-screen">
              {children}
            </main>
            {/* Footer added to layout */}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}