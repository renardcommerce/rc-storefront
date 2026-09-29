// Content voor klantenservice- en juridische pagina's (route: /[countryCode]/content/[slug]).
// CONCEPT — Renard controleert vóór livegang. Bedrijfsgegevens staan alleen in COMPANY.

export const COMPANY = {
  brand: "RC Choice",
  legalName: "Renard Commerce",
  email: "account@renardcommerce.com", // klantenservice-mailadres (B4)
  address: "Zuideinde 10 A, 8428 HE Fochteloo", // bezoek-/correspondentieadres (B4)
  returnAddress: "", // retouradres (B4)
  kvk: "80198961", // KvK-nummer (B4)
  vat: "NL003405536B18", // btw-nummer (B4)
}

const fill = (v: string) => (v ? v : "wordt binnenkort aangevuld")

export type ContentBlock =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }

export type ContentPage = {
  title: string
  description: string
  blocks: ContentBlock[]
}

const companyBlock: ContentBlock = {
  type: "ul",
  items: [
    `${COMPANY.brand} is een merk van ${COMPANY.legalName}`,
    `E-mail: ${fill(COMPANY.email)}`,
    `Adres: ${fill(COMPANY.address)}`,
    `KvK-nummer: ${fill(COMPANY.kvk)}`,
    `Btw-nummer: ${fill(COMPANY.vat)}`,
  ],
}

export const CONTENT_PAGES: Record<string, ContentPage> = {
  klantenservice: {
    title: "Klantenservice",
    description: "Antwoorden op veelgestelde vragen over bestellen, verzending en retourneren.",
    blocks: [
      { type: "p", text: "Hier vind je antwoorden op de meest gestelde vragen. Staat je vraag er niet tussen? Neem dan contact met ons op, we helpen je graag." },
      { type: "h", text: "Wat kost verzending?" },
      { type: "p", text: "Verzending binnen Nederland is altijd gratis, zonder minimaal bestelbedrag." },
      { type: "h", text: "Wanneer wordt mijn bestelling verzonden?" },
      { type: "p", text: "We verwerken bestellingen zo snel mogelijk. Zodra je pakket onderweg is, ontvang je een e-mail met een track & trace-code." },
      { type: "h", text: "Hoe kan ik betalen?" },
      { type: "p", text: "Je betaalt veilig online via onze betaalpartner, onder andere met iDEAL. De beschikbare betaalmethoden zie je bij het afrekenen." },
      { type: "h", text: "Kan ik mijn bestelling retourneren?" },
      { type: "p", text: "Ja. Je hebt 14 dagen bedenktijd na ontvangst. Lees op de pagina Retourneren hoe je een retour aanmeldt." },
      { type: "h", text: "Welke kabel heb ik nodig?" },
      { type: "p", text: "Controleer welke aansluitingen je apparaten hebben (bijvoorbeeld HDMI, DisplayPort, USB-C of RJ45) en welke lengte je nodig hebt. Twijfel je? Stuur ons een bericht met de apparaten die je wilt verbinden." },
      { type: "h", text: "Mijn product is defect of beschadigd. Wat nu?" },
      { type: "p", text: "Neem binnen redelijke tijd contact met ons op en stuur indien mogelijk een foto mee. We zorgen samen met jou voor een passende oplossing, zoals vervanging of terugbetaling." },
    ],
  },
  contact: {
    title: "Contact",
    description: "Neem contact op met de klantenservice van RC Choice.",
    blocks: [
      { type: "p", text: "Heb je een vraag over een product of je bestelling? Stuur ons een e-mail. We reageren op werkdagen zo snel mogelijk, uiterlijk binnen twee werkdagen." },
      { type: "p", text: "Vermeld bij vragen over een bestelling altijd je bestelnummer." },
      { type: "h", text: "Gegevens" },
      companyBlock,
    ],
  },
  verzending: {
    title: "Verzending & levering",
    description: "Alles over verzendkosten, levering en track & trace.",
    blocks: [
      { type: "h", text: "Verzendkosten" },
      { type: "p", text: "Verzending binnen Nederland is gratis, ongeacht het bestelbedrag. Op dit moment leveren we alleen in Nederland." },
      { type: "h", text: "Levering" },
      { type: "p", text: "We verwerken je bestelling zo snel mogelijk na betaling. Je ontvangt een e-mail met een track & trace-code zodra je pakket onderweg is." },
      { type: "h", text: "Niet thuis?" },
      { type: "p", text: "Ben je niet thuis, dan volgt de vervoerder zijn gebruikelijke werkwijze, zoals bezorgen bij de buren, een tweede bezorgpoging of afleveren bij een afhaalpunt. Via de track & trace-link zie je de actuele status." },
      { type: "h", text: "Pakket beschadigd of niet ontvangen?" },
      { type: "p", text: "Neem contact met ons op, dan zoeken we het voor je uit." },
    ],
  },
  retourneren: {
    title: "Retourneren",
    description: "Zo werkt retourneren bij RC Choice: 14 dagen bedenktijd.",
    blocks: [
      { type: "h", text: "14 dagen bedenktijd" },
      { type: "p", text: "Je hebt het recht om je aankoop binnen 14 dagen na ontvangst zonder opgave van reden te herroepen. Na je melding heb je nog 14 dagen om het product terug te sturen." },
      { type: "h", text: "Zo meld je een retour aan" },
      { type: "ul", items: [
        "Stuur ons een e-mail met je bestelnummer en het product dat je wilt retourneren.",
        "Je ontvangt van ons de retourinstructies en het retouradres.",
        "Verpak het product zorgvuldig, bij voorkeur in de originele verpakking.",
        "Stuur het pakket binnen 14 dagen na je melding terug.",
      ] },
      { type: "h", text: "Voorwaarden" },
      { type: "ul", items: [
        "Behandel het product tijdens de bedenktijd zoals je dat in een winkel zou doen: je mag het uitpakken en bekijken om te beoordelen of je het wilt houden.",
        "Is het product meer gebruikt dan nodig of beschadigd, dan kunnen we een waardevermindering in rekening brengen.",
        "De kosten voor het terugsturen zijn voor jouw rekening, tenzij het product defect is of verkeerd is geleverd.",
      ] },
      { type: "h", text: "Terugbetaling" },
      { type: "p", text: "We betalen het aankoopbedrag binnen 14 dagen na je herroeping terug, via dezelfde betaalmethode. We mogen wachten met terugbetalen tot we het product hebben ontvangen of je hebt aangetoond dat je het hebt teruggestuurd." },
      { type: "h", text: "Defect product" },
      { type: "p", text: "Ontvang je een defect of verkeerd product? Neem contact met ons op. Je hebt altijd recht op een product dat werkt zoals je mag verwachten (wettelijke garantie)." },
    ],
  },
  "algemene-voorwaarden": {
    title: "Algemene voorwaarden",
    description: "De algemene voorwaarden van RC Choice.",
    blocks: [
      { type: "h", text: "1. Wie zijn wij" },
      companyBlock,
      { type: "h", text: "2. Toepasselijkheid" },
      { type: "p", text: "Deze voorwaarden gelden voor elk aanbod van RC Choice en voor elke overeenkomst die via deze webshop tot stand komt. Je kunt deze voorwaarden altijd opslaan of printen." },
      { type: "h", text: "3. Aanbod en prijzen" },
      { type: "p", text: "Alle prijzen zijn in euro's en inclusief 21% btw. Verzending binnen Nederland is gratis. Kennelijke vergissingen of fouten in het aanbod binden ons niet." },
      { type: "h", text: "4. De overeenkomst" },
      { type: "p", text: "De overeenkomst komt tot stand zodra je je bestelling hebt geplaatst en betaald. Je ontvangt hiervan een bevestiging per e-mail. We mogen een bestelling weigeren als daar een gegronde reden voor is, bijvoorbeeld als een product niet meer leverbaar is; je ontvangt dan je geld terug." },
      { type: "h", text: "5. Betaling" },
      { type: "p", text: "Je betaalt bij het plaatsen van je bestelling via een van de aangeboden betaalmethoden." },
      { type: "h", text: "6. Levering" },
      { type: "p", text: "We leveren op het adres dat je bij je bestelling opgeeft. We verzenden zo snel mogelijk en uiterlijk binnen 30 dagen, tenzij anders afgesproken. Kunnen we niet binnen die termijn leveren, dan laten we dat weten en mag je de bestelling kosteloos annuleren. Het risico van beschadiging of verlies gaat op jou over op het moment dat je het product ontvangt." },
      { type: "h", text: "7. Herroepingsrecht" },
      { type: "p", text: "Je kunt je aankoop binnen 14 dagen na ontvangst zonder opgave van reden herroepen. De werkwijze en voorwaarden staan op de pagina Retourneren." },
      { type: "h", text: "8. Garantie" },
      { type: "p", text: "Onze producten voldoen aan de overeenkomst en aan wat je redelijkerwijs mag verwachten. Je wettelijke rechten blijven altijd van kracht." },
      { type: "h", text: "9. Klachten" },
      { type: "p", text: "Heb je een klacht, meld die dan binnen redelijke tijd nadat je het probleem hebt ontdekt, bij voorkeur per e-mail. We reageren binnen 14 dagen." },
      { type: "h", text: "10. Toepasselijk recht" },
      { type: "p", text: "Op deze voorwaarden en alle overeenkomsten is Nederlands recht van toepassing." },
    ],
  },
  privacybeleid: {
    title: "Privacybeleid",
    description: "Hoe RC Choice omgaat met je persoonsgegevens.",
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
        "Je informeren over je bestelling (bevestiging, verzending, track & trace)",
        "Je vragen, retouren en klachten afhandelen",
        "Voldoen aan wettelijke verplichtingen, zoals de fiscale bewaarplicht",
      ] },
      { type: "h", text: "Hoe lang we gegevens bewaren" },
      { type: "p", text: "We bewaren gegevens niet langer dan nodig. Bestel- en factuurgegevens bewaren we 7 jaar vanwege de fiscale bewaarplicht. Je account kun je laten verwijderen." },
      { type: "h", text: "Met wie we gegevens delen" },
      { type: "p", text: "We delen alleen gegevens die nodig zijn met partijen die ons helpen de webshop te laten werken: onze hostingpartij (servers in de EU), betaalprovider, fulfilment- en verzendpartner en e-mailprovider. Met hen maken we afspraken over de beveiliging van je gegevens. We verkopen je gegevens nooit." },
      { type: "h", text: "Cookies" },
      { type: "p", text: "We gebruiken alleen functionele cookies die nodig zijn om de webshop te laten werken, bijvoorbeeld voor je winkelwagen en om ingelogd te blijven. We gebruiken geen tracking- of advertentiecookies." },
      { type: "h", text: "Jouw rechten" },
      { type: "p", text: "Je hebt het recht om je gegevens in te zien, te laten corrigeren of te laten verwijderen, en om bezwaar te maken tegen het gebruik ervan. Stuur hiervoor een e-mail. Ben je niet tevreden over hoe we met je gegevens omgaan, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens." },
    ],
  },
}
