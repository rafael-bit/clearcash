import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react'
import Loading from "./loading";
import { ModalProvider } from '@/components/ModalProvider'
import { LanguageProvider } from '@/components/LanguageProvider'

const dmsans = DM_Sans({
  variable: "--font-dmsans-mono",
  subsets: ["latin"],
});

async function DelayedContent({ children }: { children: React.ReactNode }) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return children;
}

export const metadata: Metadata = {
  title: {
    template: "ClearCash - %s",
    default: "ClearCash"
  },
  description: "ClearCash - Manage your finances easily and efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmsans.variable} antialiased`}
      >
        <LanguageProvider>
          <ModalProvider>
            <Suspense fallback={<Loading />}>
              <DelayedContent>
                {children}
              </DelayedContent>
            </Suspense>
          </ModalProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
