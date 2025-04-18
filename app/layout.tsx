import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";

export const metadata: Metadata = {
  title: "TryMe",
  description: "Dare to Style. Born to Stand Out",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Banner></Banner>
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
