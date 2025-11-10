import type { Metadata } from "next";
import { QueryProvider } from "./lib/providers/QueryProvider";
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
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
