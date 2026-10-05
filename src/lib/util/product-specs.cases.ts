// Echte gevallen van shop.rcchoice.nl (Cowork, 05-10-2026, na PR #14).
// Beschrijvingen zijn alleen het deel dat Cowork las ("rest niet gelezen").
// `live` = wat de pagina toonde; `expected` = wat de fix moet tonen.
export type SpecCase = {
  nr: number
  handle: string
  title: string
  description?: string[]
  live: string
  expected: string[] // "Label: waarde"
}

export const SPEC_CASES: SpecCase[] = [
  {
    nr: 1,
    handle: "usb-3-0-verlengkabel-5gbps-usb-male-naar-usb-male-2-meter",
    title: "USB 3.0 Verlengkabel - 5Gbps - USB Male naar USB Male - 2 Meter",
    description: [
      "Met deze RC Choice USB 3.0 verlengkabel / aansluitkabel verbind je eenvoudig apparaten met een USB-A aansluiting.",
      "USB-A male naar USB-A male aansluiting.",
      "Dit is geen USB-C, USB-B, Micro-USB of HDMI kabel en ondersteunt geen beeldsignaal.",
      "Verkrijgbaar in 0.5 meter, 1 meter, 1.5 meter, 2 meter, 3 meter en 5 meter.",
    ],
    live: "Lengte 2 m, Aansluiting HDMI, Versie USB 3.0",
    expected: ["Lengte: 2 m", "Aansluiting: USB-A", "Versie: USB 3.0"],
  },
  {
    nr: 2,
    handle: "usb-3-0-verlengkabel-5gbps-usb-male-naar-usb-male-0-5-meter",
    title: "USB 3.0 Verlengkabel - 5Gbps - USB Male naar USB Male - 0.5 Meter",
    live: "Lengte 0,5 m, Aansluiting HDMI, Versie USB 3.0",
    // beschrijving niet gelezen: alleen titel bekend, "USB" zonder A/B/C = onzeker
    expected: ["Lengte: 0,5 m", "Versie: USB 3.0"],
  },
  {
    nr: 3,
    handle: "usb-3-0-verlengkabel-5gbps-usb-male-naar-usb-female-2-meter",
    title: "USB 3.0 Verlengkabel - 5Gbps - USB Male naar USB Female - 2 Meter",
    live: "Lengte 2 m, Aansluiting HDMI, Versie USB 3.0",
    expected: ["Lengte: 2 m", "Versie: USB 3.0"],
  },
  {
    nr: 4,
    handle: "usb-3-0-verlengkabel-5gbps-sterk-en-flexibel-nylon-kabel-1-5-meter",
    title: "USB 3.0 Verlengkabel - 5Gbps - Sterk en Flexibel Nylon Kabel - 1.5 Meter",
    description: [
      "USB 3.0 ondersteuning tot 5Gbps - geschikt voor snelle dataoverdracht wanneer beide apparaten USB 3.0 ondersteunen.",
      "USB-A male naar USB-A female - verlengt een bestaande USB-A poort voor randapparatuur.",
    ],
    live: "Lengte 1,5 m, Aansluiting HDMI, Versie USB 3.0",
    expected: ["Lengte: 1,5 m", "Aansluiting: USB-A", "Versie: USB 3.0"],
  },
  {
    nr: 5,
    handle: "usb-c-naar-hdmi-kabel-4k-60hz-3-meter-usb-c-male-naar-hdmi-male",
    title: "USB C naar HDMI Kabel - 4K 60Hz - 3 Meter - USB-C Male naar HDMI Male",
    description: [
      "USB-C Male naar HDMI Male",
      "Directe aansluiting zonder losse adapter",
      "Geeft beeld en geluid door",
      "Plug & Play: geen software nodig",
      "Geschikt voor tv, monitor en beamer",
      "Keuze uit 4K 30Hz, 4K 60Hz en 8K 60Hz varianten",
      "Nylon varianten voor extra stevigheid en flexibiliteit",
    ],
    live: "Lengte 3 m, Aansluiting HDMI, Versie USB 4",
    expected: ["Lengte: 3 m", "Aansluiting: USB-C naar HDMI"],
  },
  {
    nr: 6,
    handle: "mini-displayport-naar-hdmi-kabel-4k-60hz-1-8-meter-mini-dp-male-naar-hdmi-female",
    title: "Mini DisplayPort naar HDMI Kabel - 4K 60Hz - 1.8 Meter - Mini DP Male naar HDMI Female",
    description: [
      "Mini DisplayPort naar HDMI - voor apparaten met een Mini DP-uitgang",
      "Ondersteunt tot 4K 30Hz of 4K 60Hz, afhankelijk van de gekozen variant",
      "Plug & play: geen driver of software nodig",
      "Geschikt voor tv, monitor, beamer en tweede scherm",
    ],
    live: "Lengte 1,8 m, Aansluiting HDMI",
    expected: ["Lengte: 1,8 m", "Aansluiting: Mini DisplayPort naar HDMI"],
  },
  {
    nr: 7,
    handle: "usb-c-en-usb-a-naar-usb-b-printerkabel-usb-2-0-5-meter-sterk-en-flexibel-nylon",
    title: "USB-C en USB-A naar USB-B Printerkabel - USB 2.0 - 5 Meter - Sterk en Flexibel Nylon",
    description: [
      "2-in-1 aansluiting: USB-C én USB-A naar USB-B",
      "Geschikt voor printers, scanners en andere USB-B apparaten",
      "USB 2.0 dataoverdracht tot 480 Mbps",
      "Sterke en flexibele nylon afwerking",
      "Handig voor moderne laptops, MacBooks, pc's en USB-hubs",
      "Geen losse USB-C naar USB-A adapter nodig",
    ],
    live: "Lengte 5 m, Aansluiting USB-C, Versie USB 2.0",
    // drie verschillende uiteinden in één titel: bij twijfel weglaten
    expected: ["Lengte: 5 m", "Versie: USB 2.0"],
  },
  {
    nr: 8,
    handle: "micro-hdmi-naar-hdmi-kabel-4k-60hz-2-meter-sterk-en-flexibel-nylon",
    title: "Micro HDMI naar HDMI Kabel - 4K 60Hz - 2 Meter - Sterk en Flexibel Nylon",
    description: [
      "Ben jij op zoek naar een betrouwbare Micro HDMI naar HDMI kabel waarmee je eenvoudig beeld en geluid kunt overbrengen naar een televisie, monitor of projector?",
      "Micro HDMI Type D Male naar HDMI Type A Male",
    ],
    // live: eerste keer oude pagina (cache), herlaad: Lengte 2 m, Aansluiting Micro HDMI
    live: "Lengte 2 m, Aansluiting Micro HDMI",
    expected: ["Lengte: 2 m", "Aansluiting: Micro HDMI naar HDMI"],
  },
]
