import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/lib/context/user-context";

export const metadata: Metadata = {
  title: "Launchpad - AI-Powered Landing Page Builder",
  description: "Create high-converting landing pages with AI. Design, customize, and deploy in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
