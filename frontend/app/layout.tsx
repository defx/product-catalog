import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moneybox Product Catalog",
  description: "Explore all Moneybox products and accounts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
