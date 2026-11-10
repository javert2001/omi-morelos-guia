import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "OMI Morelos · Aprende, practica, supera tus límites",
  description:
    "Tu camino en la programación comienza aquí. Guía en español para prepararte desde cero para la Olimpiada Morelense de Informática.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
