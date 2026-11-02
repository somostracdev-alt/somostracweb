import type { Metadata } from "next";
import { Anton, Poppins } from "next/font/google";

import { getLocale } from "@/lib/locale-server";
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

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: {
      default: "TRAC",
      template: "%s – TRAC",
    },
    description:
      locale === "en"
        ? "Sales systems for ag and heavy-equipment dealerships."
        : "Sistema comercial para concesionarias de agro y maquinaria pesada.",
    icons: { icon: "/brand/favicon.png" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html lang={locale === "en" ? "en" : "es-AR"} className={`${anton.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-base font-light text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("trac-theme")==="light")document.documentElement.setAttribute("data-theme","light")}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
