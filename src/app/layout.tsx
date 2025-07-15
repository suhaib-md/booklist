import type { Metadata } from "next";
import { BookProvider } from "@/contexts/BookProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Earthy Reads",
  description: "A personal book tracking website to manage your reading list.",
};

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} font-body antialiased`}>
        <AuthProvider>
          <BookProvider>
            {children}
            <Toaster />
          </BookProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
