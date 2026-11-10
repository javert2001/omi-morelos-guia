import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./omri-brand.css";
import "./studio.css";
import "./studio-catalog.css";
import "./studio-learning.css";
export const metadata: Metadata = {
  title: "OMRI · Guía de programación",
  description:
    "Tu camino en la programación comienza aquí. Guía en español para prepararte desde cero para la Olimpiada Morelense de Informática.",
  icons: { icon: "/brand/omri-favicon.ico" },
};
export const viewport: Viewport = { themeColor: "#3037df" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
