/*
 * BLOG POSTS
 *
 * Nieuwe post toevoegen? Kopieer het onderstaande template en vul in:
 *
 *   {
 *     slug: 'url-vriendelijke-naam',
 *     title: 'Titel van je post',
 *     date: '2026-04-15',
 *     author: 'Do-IT Solutions',
 *     summary: 'Korte samenvatting voor de overzichtspagina.',
 *     content: `
 *       Je tekst hier in Markdown formaat.
 *
 *       ## Kopjes werken
 *       - Lijstjes ook
 *       - **Vet** en *cursief* werken
 *
 *       Gewoon tekst typen en alinea's scheiden met een lege regel.
 *     `,
 *   },
 *
 * Posts worden gesorteerd op datum (nieuwste bovenaan).
 */

const posts = [
  {
    slug: 'waarom-mfa-onmisbaar-is',
    title: 'Waarom Multi-Factor Authenticatie onmisbaar is voor uw bedrijf',
    date: '2026-04-14',
    author: 'Do-IT Solutions',
    summary: 'MFA is de belangrijkste beveiligingsmaatregel die u vandaag nog kunt activeren. Wij leggen uit waarom en hoe.',
    content: `
## Wat is MFA?

Multi-Factor Authenticatie (MFA) voegt een extra beveiligingslaag toe aan uw accounts. Naast uw wachtwoord moet u zich op een tweede manier identificeren — bijvoorbeeld met een code op uw telefoon of een vingerafdruk.

## Waarom is het zo belangrijk?

Wachtwoorden alleen zijn niet meer genoeg. Enkele feiten:

- **80%** van alle hacks komt door gestolen of zwakke wachtwoorden
- Aanvallers kunnen wachtwoorden kopen op het darkweb voor een paar euro
- Phishing-aanvallen worden steeds geavanceerder en moeilijker te herkennen
- Zonder MFA heeft een hacker met uw wachtwoord direct toegang tot alles

## Hoe werkt het in de praktijk?

Bij Microsoft 365 kunt u MFA eenvoudig inschakelen via de **Microsoft Authenticator** app:

1. U logt in met uw wachtwoord zoals gewoonlijk
2. U krijgt een melding op uw telefoon
3. U keurt de aanmelding goed met een tik of vingerafdruk
4. Klaar — u bent veilig ingelogd

Het kost u letterlijk 3 seconden extra per dag, maar het blokkeert **99,9%** van alle account-aanvallen.

## Conditional Access: de slimme variant

Bij Do-IT Solutions configureren we niet alleen MFA, maar ook **Conditional Access** beleid. Dit betekent:

- Op bekende apparaten en locaties hoeft u minder vaak te verifi\u00EBren
- Verdachte aanmeldingen (bijv. vanuit een ander land) worden automatisch geblokkeerd
- U kunt beleid per groep instellen — de directie krijgt strengere regels dan de receptie

## Wat kost het?

MFA via Microsoft 365 is **gratis inbegrepen** in uw licentie. Er is geen reden om het niet te activeren. Conditional Access vereist een Azure AD Premium licentie, maar die zit in veel M365 Business Premium pakketten.

## Hulp nodig?

Wij activeren en configureren MFA voor uw hele organisatie, inclusief training voor uw medewerkers. Neem contact op voor een vrijblijvend gesprek.
    `,
  },
  {
    slug: 'van-lokale-server-naar-cloud',
    title: 'Van lokale server naar de cloud: waar begin je?',
    date: '2026-04-10',
    author: 'Do-IT Solutions',
    summary: 'Uw oude server piept en kraakt. Tijd voor de cloud? Wij leggen het migratieproces stap voor stap uit.',
    content: `
## De situatie

Veel MKB-bedrijven werken nog met een lokale server. Vaak een NAS of een Windows Server die al een paar jaar meedraait. De back-ups zijn twijfelachtig, de hardware wordt oud, en niemand weet precies hoe alles is ingericht.

Herkenbaar? Dan is het tijd om serieus naar de cloud te kijken.

## Waarom cloud?

- **Geen hardware zorgen meer** — Microsoft beheert de servers, updates en beveiliging
- **Overal werken** — uw bestanden en e-mail zijn overal beschikbaar
- **Automatische back-ups** — geen tapes of externe schijven meer nodig
- **Schaalbaarheid** — nieuwe medewerker? Binnen een uur productief
- **Kostenbesparing** — geen grote investeringen vooraf, voorspelbare maandkosten

## Hoe pakken wij een migratie aan?

### Stap 1: Inventarisatie

Wij brengen uw huidige omgeving in kaart:
- Welke bestanden staan waar?
- Hoe is de e-mail ingericht?
- Welke applicaties draaien lokaal?
- Zijn er line-of-business apps die niet naar de cloud kunnen?

### Stap 2: Plan van aanpak

Op basis van de inventarisatie maken wij een migratieplan:
- Wat gaat naar **SharePoint** (gedeelde bestanden)?
- Wat gaat naar **OneDrive** (persoonlijke bestanden)?
- Wordt e-mail gemigreerd naar **Exchange Online**?
- Is er een **hybride** oplossing nodig?

### Stap 3: Migratie

De daadwerkelijke migratie doen wij buiten kantooruren zodat uw medewerkers er zo min mogelijk last van hebben. We migreren in fases — eerst een testgroep, dan de rest.

### Stap 4: Training en nazorg

Na de migratie trainen wij uw medewerkers in het werken met de nieuwe omgeving. En natuurlijk blijven wij beschikbaar voor vragen.

## En de lokale server?

Die kan uit! Tenzij u specifieke applicaties heeft die lokaal moeten draaien. In dat geval bekijken we een hybride oplossing.

**Let op:** Wij doen g\u00E9\u00E9n serverbeheer. Onze kracht zit in de cloud. Als uw huidige server onderhoud nodig heeft, helpen wij u zo snel mogelijk naar de cloud zodat dat probleem verdwijnt.

## Wat kost een migratie?

Dat hangt af van de grootte en complexiteit van uw omgeving. Neem contact op voor een vrijblijvende inventarisatie — dan weet u precies waar u aan toe bent.
    `,
  },
  {
    slug: 'unifi-wifi-bedrijf',
    title: '5 redenen waarom UniFi de beste keuze is voor uw bedrijfs-WiFi',
    date: '2026-04-05',
    author: 'Do-IT Solutions',
    summary: 'Consumer-routers in een bedrijfsomgeving? Dat kan beter. Waarom wij kiezen voor UniFi netwerkapparatuur.',
    content: `
## Het probleem met consumer WiFi

Veel kleine bedrijven werken met een WiFi-router van de internetprovider of een consumer access point van de mediamarkt. Dat werkt prima thuis, maar in een bedrijfsomgeving loopt u al snel tegen problemen aan:

- Slechte dekking in bepaalde ruimtes
- Verbindingen die wegvallen bij veel gebruikers
- Geen gescheiden netwerk voor gasten
- Geen inzicht in wat er op het netwerk gebeurt
- Geen centrale beheermogelijkheden

## Waarom UniFi?

Wij werken uitsluitend met **Ubiquiti UniFi** netwerkapparatuur. Hier is waarom:

### 1. Enterprise-kwaliteit, betaalbare prijs

UniFi biedt dezelfde functionaliteit als Cisco of Aruba, maar dan voor een fractie van de prijs. Een professioneel WiFi-netwerk voor een klein kantoor begint al rond de \u20AC500.

### 2. Centraal beheer

Alle access points, switches en firewalls worden beheerd vanuit \u00E9\u00E9n dashboard — de UniFi Controller. Wij monitoren uw netwerk op afstand en kunnen problemen vaak oplossen zonder langs te komen.

### 3. Naadloos roaming

Met meerdere UniFi access points loopt u door het pand zonder dat uw verbinding wegvalt. Uw laptop of telefoon schakelt automatisch over naar het dichtstbijzijnde access point.

### 4. VLAN-segmentatie

Wij scheiden uw netwerk in zones:
- **Bedrijfsnetwerk** — voor uw medewerkers en apparaten
- **Gastennetwerk** — voor bezoekers, volledig gescheiden
- **IoT-netwerk** — voor printers, camera's en andere apparaten

Zo kan een bezoeker wel internetten, maar niet bij uw bedrijfsbestanden.

### 5. Inzicht en rapportage

De UniFi Controller laat precies zien:
- Hoeveel apparaten er verbonden zijn
- Welke apparaten de meeste bandbreedte gebruiken
- Of er verdachte activiteit is op het netwerk
- Hoe de WiFi-dekking eruit ziet per ruimte

## Wat leveren wij?

Bij Do-IT Solutions verzorgen wij het complete traject:

- **Site survey** — wij meten uw pand op voor optimale access point plaatsing
- **Installatie** — professionele montage en bekabeling
- **Configuratie** — VLAN's, gastennetwerk, firewall-regels
- **Monitoring** — wij houden uw netwerk 24/7 in de gaten
- **Support** — problemen? Wij lossen het op

## Interesse?

Neem contact op voor een vrijblijvende inventarisatie van uw huidige netwerksituatie. Wij komen graag langs voor een site survey.
    `,
  },
];

export default posts.sort((a, b) => new Date(b.date) - new Date(a.date));
