"use client";

import React from "react";
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
      <html lang="en" suppressHydrationWarning={true}>
        <head />
        <body>{children}</body>
      </html>
    </>
  );
}
