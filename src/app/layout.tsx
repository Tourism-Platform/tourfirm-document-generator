import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Document Generation Service",
  description: "Isolated PDF document generation service",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
