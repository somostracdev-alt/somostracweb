import type { Metadata } from "next";
import { Anton, Poppins } from "next/font/google";

import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const poppins = Poppins({
  weight: ["200", "300", "400", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "TRAC",
    template: "%s – TRAC",
  },
  description:
    "TRAC es un partner de performance comercial para concesionarias de agro y pesados.",
  icons: { icon: "/brand/favicon.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${anton.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full bg-black font-sans text-base font-extralight text-white">{children}</body>
    </html>
  );
}
