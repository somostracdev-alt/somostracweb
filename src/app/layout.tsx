import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";

import { getLocale } from "@/lib/locale-server";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const inter = Inter({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
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
        ? "Marketing and sales management for ag and heavy-equipment companies."
        : "Conectamos tu marketing con tus ventas. Estrategia, campañas, leads y CRM para empresas del agro y pesados en Argentina.",
    icons: { icon: "/brand/favicon.png" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html lang={locale === "en" ? "en" : "es-AR"} className={`${anton.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-base font-normal text-foreground">
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
