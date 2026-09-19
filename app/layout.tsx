import "./globals.css";

export const metadata = {
  title: "Daily Shot — Learn to see",
  description: "A five-minute daily photography practice built around master photographs.",
  manifest: "/daily-shot/manifest.webmanifest",
  icons: { icon: "/daily-shot/icon.svg", apple: "/daily-shot/icon.svg" },
  themeColor: "#f4f1e9",
  appleWebApp: { capable: true, title: "Daily Shot", statusBarStyle: "default" as const },
  other: { "mobile-web-app-capable": "yes" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en">
    <head>
      <link rel="preconnect" href="https://tile.loc.gov" />
      <link rel="preconnect" href="https://upload.wikimedia.org" />
      <link rel="dns-prefetch" href="//thumb.wikimedia.org" />
    </head>
    <body>{children}<script src="/daily-shot/register-sw.js" defer /></body>
  </html>;
}
