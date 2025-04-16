import type { Metadata } from "next";

import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
