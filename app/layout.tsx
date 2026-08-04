import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { AppToaster } from "@/components/AppToaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DEFAULT_THEME } from "@/lib/themes";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Concert Cost Tracker",
  description:
    "Track concert spending, fun ratings, and how much value you get from every show.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${outfit.variable} ${syne.variable} h-full`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('concert-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-base-200 text-base-content antialiased">
        <ThemeProvider>
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
