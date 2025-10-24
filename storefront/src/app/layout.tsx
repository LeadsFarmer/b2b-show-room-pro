import { getBaseURL } from "@/lib/util/env"
import { Toaster } from "@medusajs/ui"
import { Analytics } from "@vercel/analytics/next"
import { GeistSans } from "geist/font/sans"
import { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "ShowRoomPro - Plateforme B2B E-commerce",
    template: "%s | ShowRoomPro"
  },
  description: "ShowRoomPro, votre solution B2B pour la gestion de commandes professionnelles. Gestion de compagnies, devis, approbations et bien plus.",
  keywords: ["B2B", "E-commerce", "ShowRoomPro", "Plateforme professionnelle", "Commandes", "Devis"],
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-mode="light" className={GeistSans.variable}>
      <body>
        <main className="relative">{props.children}</main>
        <Toaster className="z-[99999]" position="bottom-left" />
        <Analytics />
      </body>
    </html>
  )
}
