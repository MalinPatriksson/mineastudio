import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mineastudio.se"),
  title: { default: "Digitala inbjudningar för livets alla fester | Minea Studio", template: "%s | Minea Studio" },
  description: "Skapa en personlig digital inbjudan till bröllop, barnkalas, dop, babyshower, student, jubileum eller middag. Anpassa design, färger och OSA och dela som en vacker länk.",
  keywords: ["digital inbjudan", "digitala inbjudningar", "digitala inbjudningskort", "digital bröllopsinbjudan", "inbjudningskort barnkalas", "dopinbjudan", "inbjudan babyshower", "studentinbjudan", "jubileumsinbjudan", "OSA online", "inbjudningsmall"],
  authors: [{ name: "Minea Studio" }],
  creator: "Minea Studio",
  publisher: "Minea Studio",
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], shortcut: "/icon.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "/",
    siteName: "Minea Studio",
    title: "Digitala inbjudningar som känns personliga",
    description: "Formgivna digitala inbjudningskort med OSA, karta och kalender – klara att dela via länk.",
    images: [{ url: "/art/sandlofte-world.png", width: 1122, height: 1402, alt: "Beige digital bröllopsinbjudan från Minea Studio" }],
  },
  twitter: { card: "summary_large_image", title: "Digitala inbjudningar | Minea Studio", description: "Skapa och dela en personlig digital inbjudan för livets stora stunder.", images: ["/art/sandlofte-world.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "Digitala inbjudningar",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
