import "./globals.css";

export const metadata = {
  title: "Daily Shot",
  description: "Learn photography, one image at a time.",
  manifest: "/daily-shot/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Daily Shot", statusBarStyle: "black-translucent" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}<script src="/daily-shot/register-sw.js" defer /></body></html>;
}