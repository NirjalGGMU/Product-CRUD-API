import type { Metadata } from "next";
import "./globals.css";
import "./auth.css";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Product Manager",
  description: "Simple product CRUD app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
