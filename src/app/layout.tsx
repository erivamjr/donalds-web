import "./globals.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { CartProvider } from "./[slug]/menu/context/cat";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Donalds Web",
  description: "Mate sua fome aqui!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
