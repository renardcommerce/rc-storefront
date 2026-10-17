import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  // Iconen staan onder /assets: de middleware slaat dat pad over (geen landcode-redirect).
  // Bestandsnamen bevatten een contenthash, zodat browsers een nieuw icoon echt ophalen.
  applicationName: "RC CHOICE Shop",
  appleWebApp: { capable: true, title: "RC CHOICE Shop" },
  manifest: "/assets/rc-choice.webmanifest",
  icons: {
    icon: [
      { url: "/assets/icons/rc-choice-favicon.6c62c755.ico", sizes: "32x32" },
      { url: "/assets/icons/rc-choice-favicon.22fbd5f3.svg", type: "image/svg+xml" },
    ],
    apple: [
      {
        url: "/assets/icons/rc-choice-shop-apple-touch-icon.f3b9d8ae.png",
        sizes: "180x180",
      },
    ],
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="nl" data-mode="light">
      <body className="bg-paper text-ink">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
