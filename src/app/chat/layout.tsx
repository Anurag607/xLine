"use client";

import React from "react";
import "../../styles/globals.css";

export default function ChatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section>{children}</section>
    </>
  );
}
