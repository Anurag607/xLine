"use client"

import '../../styles/globals.css'
import './chats.css'

import { ContextProvider } from '../../context/index'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body><ContextProvider>{children}</ContextProvider></body>
    </html>
  )
}
