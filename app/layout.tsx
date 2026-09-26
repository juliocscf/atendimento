import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Atendimento",
  description: "Plataforma segura de atendimento e gestão de dispositivos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
