import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FiND",
  description: "Monitoring"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var storedTheme = localStorage.getItem('find-theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (error) {}
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
