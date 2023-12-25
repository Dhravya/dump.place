import NavigationMenuComp from "@/components/NavigationMenu";
import "@/styles/global.css";
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Dump.place",
  description: "A minimal place to dump your thoughts.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`dark font-sans ${inter.variable}`}>
        <div className="loader" />
        <HydrationOverlay>
          <NavigationMenuComp />
          {children}
        </HydrationOverlay>
      </body>
    </html>
  );
}
