"use client";

import "../styles/globals.css";
import "nprogress/nprogress.css";
import TopProgressBar from "@/components/TopProgressBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopProgressBar />
      <html>
        <head />
        <body>{children}</body>
      </html>
    </>
  );
}
