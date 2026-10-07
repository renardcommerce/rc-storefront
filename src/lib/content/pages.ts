// Content voor klantenservice- en juridische pagina's (route: /[countryCode]/content/[slug]).
// CONCEPT — Renard controleert vóór livegang. Bedrijfsgegevens staan alleen in COMPANY.

// Zet op false (of verwijder het label in content/[slug]/page.tsx) zodra de teksten juridisch zijn gecontroleerd.
export const SHOW_CONCEPT_LABEL = true
export const CONCEPT_LABEL = "CONCEPT – nog juridisch te controleren"

export const COMPANY = {
  brand: "RC CHOICE", // handelsnaam webshop
  legalName: "Renard Commerce",
  email: "service@renardcommerce.com",
  address: "Zuideinde 10-A, 8428 HE Fochteloo, Friesland, Nederland",
  kvk: "80198961",
  vat: "NL003405536B18",
  // Alleen tonen als gevuld (zie companyBlock en het retourformulier).
  phone: "+31 6 488 260 71",
}

// Retouradres: nog te bevestigen door Renard. De invulplek blijft zichtbaar op het retourformulier.
export const RETURN_ADDRESS = "[RETOURADRES nog te bevestigen]"

// Vul in zodra de levertijd vaststaat; verschijnt nu als invulplek in de teksten.
const LEVERTIJD = "[LEVERTIJD]"

export type ContentBlock =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "link"; text: string; href: string } // href relatief aan de landcode, bv. "/account/orders"

export type ContentPage = {
  title: string
  description: string
  blocks: ContentBlock[]
}

const companyBlock: ContentBlock = {
  type: "ul",
  items: [
    `${COMPANY.brand} is de handelsnaam van ${COMPANY.legalName}`,
    `Adres: ${COMPANY.address}`,
    `E-mail: ${COMPANY.email}`,
    `KvK-nummer: ${COMPANY.kvk}`,
    `Btw-nummer: ${COMPANY.vat}`,
    ...(COMPANY.phone ? [`Telefoon: ${COMPANY.phone}`] : []),
  ],
}

const SHIPPING_TEXT = "Verzending kost € 6,95 (incl. btw). Vanaf een bestelbedrag van € 20 is verzending gratis. Dit geldt voor bestellingen in Nederland en België."

export const CONTENT_PAGES: Record<string, ContentPage> = {
  faq: {
    title: "Veelgestelde vragen",
    description: "Antwoorden op veelgestelde vragen over bestellen, verzending, betalen en retourneren.",
    blocks: [
      { type: "p", text: "Hier vind je antwoorden op de meest gestelde vragen. Staat je vraag er niet tussen? Neem dan contact met ons op, we helpen je graag." },
      { type: "h", text: "Wat kost verzending?" },
      { type: "p", text: SHIPPING_TEXT },
      { type: "h", text: "Naar welke landen leveren jullie?" },
      { type: "p", text: "We leveren aan consumenten in Nederland en België." },
      { type: "h", text: "Wat is de levertijd?" },
      { type: "p", text: `De levertijd is ${LEVERTIJD}. Zodra je pakket onderweg is, ontvang je bericht van ons.` },
      { type: "h", text: "Hoe kan ik betalen?" },
      { type: "p", text: "Je kunt betalen met iDEAL en andere gangbare methoden. Welke methoden beschikbaar zijn, zie je bij het afrekenen." },
      { type: "h", text: "Kan ik mijn bestelling retourneren?" },
      { type: "p", text: "Ja. Je hebt 14 dagen bedenktijd vanaf ontvangst van je bestelling. De kosten van het terugsturen zijn voor jouw rekening. Op de pagina Retourneren & herroeping lees je precies hoe het werkt." },
      { type: "h", text: "Wat als mijn product defect is?" },
      { type: "p", text: "Neem contact met ons op, het liefst met je bestelnummer en een foto. Je hebt volgens het Nederlandse recht wettelijke garantie: een product moet werken zoals je redelijkerwijs mag verwachten." },
    ],
  },
  contact: {
    title: "Contact",
    description: "Neem contact op met RC CHOICE.",
    blocks: [
      { type: "p", text: "Heb je een vraag over een product of je bestelling? Stuur ons een e-mail. Vermeld bij vragen over een bestelling altijd je bestelnummer." },
      { type: "h", text: "Gegevens" },
      companyBlock,
    ],
  },
  verzending: {
    title: "Verzending & levering",
    description: "Alles over verzendkosten en levering bij RC CHOICE.",
    blocks: [
      { type: "h", text: "Verzendkosten" },
      { type: "p", text: SHIPPING_TEXT },
      { type: "h", text: "Leveringsgebied" },
      { type: "p", text: "We leveren aan consumenten in Nederland en België." },
      { type: "h", text: "Levertijd" },
      { type: "p", text: `De levertijd is ${LEVERTIJD}.` },
      { type: "h", text: "Pakket beschadigd of niet ontvangen?" },
      { type: "p", text: `Neem contact met ons op via ${COMPANY.email}, dan zoeken we het voor je uit.` },
    ],
  },
  retourneren: {
    title: "Retourneren & herroeping",
    description: "14 dagen bedenktijd, hoe je een retour aanmeldt en het modelformulier voor herroeping.",
    blocks: [
      { type: "h", text: "14 dagen bedenktijd" },
      { type: "p", text: "Je hebt het recht om een aankoop binnen 14 dagen na ontvangst zonder opgave van reden te herroepen. De termijn begint op de dag nadat jij (of een door jou aangewezen derde) het product hebt ontvangen. Bestel je meerdere producten in één bestelling die apart worden geleverd, dan gaat de termijn in na ontvangst van het laatste product." },
      { type: "link", text: "Retour aanmelden in je account", href: "/account/orders" },
      { type: "h", text: "Zo herroep je" },
      { type: "ul", items: [
        `Laat ons binnen de bedenktijd ondubbelzinnig weten dat je de overeenkomst herroept, bijvoorbeeld per e-mail naar ${COMPANY.email} of per post naar ${COMPANY.address}. Je mag hiervoor het modelformulier hieronder gebruiken, maar dat hoeft niet.`,
        "Vermeld je bestelnummer en het product (of de producten) waarom het gaat.",
        "Stuur het product binnen 14 dagen na je herroeping terug naar het adres dat wij je in antwoord op je melding doorgeven.",
      ] },
      { type: "h", text: "Kosten van het retourneren" },
      { type: "p", text: "De kosten van het terugsturen zijn voor jouw rekening." },
      { type: "h", text: "Terugbetaling" },
      { type: "p", text: "Na je herroeping betalen we het aankoopbedrag, inclusief de kosten voor standaardverzending, binnen 14 dagen terug, via dezelfde betaalmethode als waarmee je hebt betaald. We mogen wachten met terugbetalen tot we het product hebben ontvangen of je hebt aangetoond dat je het hebt teruggestuurd, wat eerder is. Heb je gekozen voor een andere verzendwijze dan de goedkoopste standaardverzending die wij aanbieden, dan betalen we de extra kosten daarvan niet terug." },
      { type: "h", text: "Staat van het product" },
      { type: "p", text: "Je mag het product uitpakken en bekijken om te beoordelen of je het wilt houden, zoals je dat ook in een winkel zou doen. Is het product meer gebruikt of behandeld dan daarvoor nodig is, dan ben je aansprakelijk voor de waardevermindering. Stuur het product bij voorkeur terug in de originele verpakking." },
      { type: "h", text: "Defect product" },
      { type: "p", text: "Ontvang je een defect of verkeerd product? Neem contact met ons op. Je hebt volgens het Nederlandse recht altijd recht op een product dat werkt zoals je redelijkerwijs mag verwachten (wettelijke garantie)." },
      { type: "h", text: "Modelformulier voor herroeping" },
      { type: "p", text: "Wil je de overeenkomst herroepen, vul dan dit formulier in en stuur het terug. Je hoeft dit formulier niet te gebruiken." },
      { type: "ul", items: [
        `Aan: ${COMPANY.legalName}, ${COMPANY.address}, ${COMPANY.email}`,
        "Ik/wij (*) deel/delen u hierbij mede dat ik/wij (*) onze overeenkomst betreffende de verkoop van de volgende producten herroep/herroepen (*): [product(en)]",
        "Besteld op (*) / ontvangen op (*): [datum]",
        "Bestelnummer: [bestelnummer]",
        "Naam consument(en): [naam]",
        "Adres consument(en): [adres]",
        "Handtekening van consument(en) (alleen wanneer dit formulier op papier wordt ingediend): [handtekening]",
        "Datum: [datum]",
      ] },
      { type: "p", text: "(*) Doorhalen wat niet van toepassing is." },
    ],
  },
  "algemene-voorwaarden": {
    title: "Algemene voorwaarden",
    description: "De algemene voorwaarden van RC CHOICE.",
    blocks: [
      { type: "h", text: "1. Wie zijn wij" },
      companyBlock,
      { type: "h", text: "2. Toepasselijkheid" },
      { type: "p", text: "Deze voorwaarden gelden voor elk aanbod van RC CHOICE en voor elke overeenkomst die via deze webshop met consumenten tot stand komt. Je kunt deze voorwaarden altijd opslaan of printen." },
      { type: "h", text: "3. Aanbod en prijzen" },
      { type: "p", text: "Alle prijzen zijn in euro's en inclusief btw. Kennelijke vergissingen of fouten in het aanbod binden ons niet." },
      { type: "h", text: "4. Verzendkosten" },
      { type: "p", text: SHIPPING_TEXT },
      { type: "h", text: "5. De overeenkomst" },
      { type: "p", text: "De overeenkomst komt tot stand zodra je je bestelling hebt geplaatst. Je ontvangt hiervan een bevestiging per e-mail. We mogen een bestelling weigeren als daar een gegronde reden voor is, bijvoorbeeld als een product niet meer leverbaar is; reeds betaalde bedragen betalen we dan terug." },
      { type: "h", text: "6. Betaling" },
      { type: "p", text: "Je betaalt bij het plaatsen van je bestelling met iDEAL of een andere gangbare betaalmethode die bij het afrekenen wordt aangeboden." },
      { type: "h", text: "7. Levering" },
      { type: "p", text: `We leveren aan consumenten in Nederland en België, op het adres dat je bij je bestelling opgeeft. De levertijd is ${LEVERTIJD}. Kunnen we niet binnen de afgesproken of wettelijke termijn leveren, dan laten we dat weten. Het risico van beschadiging of verlies gaat op jou over op het moment dat je het product ontvangt.` },
      { type: "h", text: "8. Herroepingsrecht" },
      { type: "p", text: "Je kunt je aankoop binnen 14 dagen na ontvangst zonder opgave van reden herroepen. De kosten van het terugsturen zijn voor jouw rekening. De werkwijze en het modelformulier staan op de pagina Retourneren & herroeping." },
      { type: "h", text: "9. Garantie" },
      { type: "p", text: "Onze producten voldoen aan de overeenkomst en aan wat je redelijkerwijs mag verwachten. Je wettelijke garantie volgens het Nederlandse recht blijft altijd van kracht." },
      { type: "h", text: "10. Klachten" },
      { type: "p", text: `Heb je een klacht, meld die dan zo snel mogelijk nadat je het probleem hebt ontdekt, bij voorkeur per e-mail naar ${COMPANY.email}.` },
      { type: "h", text: "11. Toepasselijk recht" },
      { type: "p", text: "Op deze voorwaarden en alle overeenkomsten is Nederlands recht van toepassing. Dwingende consumentenbescherming in het land waar je woont blijft van kracht." },
    ],
  },
  privacybeleid: {
    title: "Privacybeleid",
    description: "Hoe RC CHOICE omgaat met je persoonsgegevens.",
    blocks: [
      { type: "p", text: "We gaan zorgvuldig om met je persoonsgegevens en houden ons aan de Algemene verordening gegevensbescherming (AVG)." },
      { type: "h", text: "Verwerkingsverantwoordelijke" },
      companyBlock,
      { type: "h", text: "Welke gegevens we verwerken" },
      { type: "ul", items: [
        "Naam, adres, e-mailadres en telefoonnummer",
        "Bestelgegevens: producten, bedragen en betaalstatus",
        "Accountgegevens als je een account aanmaakt",
        "Berichten die je ons stuurt",
      ] },
      { type: "h", text: "Waarvoor we je gegevens gebruiken" },
      { type: "ul", items: [
        "Je bestelling verwerken, verzenden en betalingen afhandelen",
        "Je informeren over je bestelling",
        "Je vragen, retouren en klachten afhandelen",
        "Voldoen aan wettelijke verplichtingen, zoals de fiscale bewaarplicht",
      ] },
      { type: "h", text: "Hoe lang we gegevens bewaren" },
      { type: "p", text: "We bewaren gegevens niet langer dan nodig. Bestel- en factuurgegevens bewaren we 7 jaar vanwege de fiscale bewaarplicht." },
      { type: "h", text: "Met wie we gegevens delen" },
      { type: "p", text: "We delen alleen gegevens die nodig zijn met partijen die ons helpen de webshop te laten werken, zoals onze betaalprovider, verzendpartners en hosting- en e-mailprovider. We verkopen je gegevens niet." },
      { type: "h", text: "Cookies" },
      { type: "p", text: "We gebruiken cookies die nodig zijn om de webshop te laten werken, bijvoorbeeld voor je winkelwagen en om ingelogd te blijven." },
      { type: "h", text: "Jouw rechten" },
      { type: "p", text: `Je hebt het recht om je gegevens in te zien, te laten corrigeren of te laten verwijderen, en om bezwaar te maken tegen het gebruik ervan. Stuur hiervoor een e-mail naar ${COMPANY.email}. Ben je niet tevreden over hoe we met je gegevens omgaan, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.` },
    ],
  },
}
