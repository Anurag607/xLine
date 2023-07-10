"use client";

import TopProgressBar from "@/components/TopProgressBar";
import "../../styles/globals.css";
import "nprogress/nprogress.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {window && window !== undefined ? <TopProgressBar /> : <></>}
      <section>{children}</section>
    </>
  );
}
