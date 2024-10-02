import { ThemeProvider } from 'next-themes';
import { FontProvider } from "@/app/components/FontContext";
import FontWrapper from '@/app/components/FontWrapper';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>ClearCash</title>
        <meta name="description" content="ClearCash - Manage your finances easily and efficiently" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ClearCash Team" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <FontProvider>
          <ThemeProvider attribute="class">
            <FontWrapper>{children}</FontWrapper>
          </ThemeProvider>
        </FontProvider>
      </body>
    </html>
  );
}