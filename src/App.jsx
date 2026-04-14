import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Toolbar,
  AppBar,
  MenuList,
  MenuListItem,
  Separator,
  Panel,
  GroupBox,
  Fieldset,
  TextInput,
  Checkbox,
} from 'react95';

/* ================================================================== */
/*  STYLED COMPONENTS                                                  */
/* ================================================================== */

const Desktop = styled.div`
  width: 100vw;
  height: 100vh;
  background: #008080;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 16px 48px 16px;
  overflow: hidden;
  position: relative;
`;

const MainWindow = styled(Window)`
  width: 100%;
  max-width: 880px;
  height: calc(100vh - 80px);
  max-height: 860px;
  display: flex;
  flex-direction: column;
  z-index: 10;
  @media (max-width: 920px) {
    max-width: 100%;
    max-height: calc(100vh - 60px);
  }
`;

const StyledWindowHeader = styled(WindowHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  user-select: none;
  padding: 3px 4px 3px 8px;
`;

const HeaderTitle = styled.span`
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 2px;
  flex-shrink: 0;
`;

const NavToolbar = styled(Toolbar)`
  flex-shrink: 0;
  display: flex;
  gap: 1px;
  padding: 2px 3px;
  flex-wrap: wrap;
`;

const NavButton = styled(Button)`
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  ${({ $active }) => $active && 'box-shadow: inset 1px 1px 4px rgba(0,0,0,0.35);'}
  padding: 3px 10px;
  height: 24px;
  @media (max-width: 600px) {
    padding: 3px 6px;
    font-size: 10px;
  }
`;

const ScrollContent = styled(WindowContent)`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 16px;
  @media (max-width: 600px) { padding: 8px; }
`;

const CloseIcon = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: -1px;
  margin-top: -1px;
  transform: rotateZ(45deg);
  position: relative;
  &:before, &:after {
    content: '';
    position: absolute;
    background: ${({ theme }) => theme.materialText};
  }
  &:before { height: 100%; width: 3px; left: 50%; transform: translateX(-50%); }
  &:after { height: 3px; width: 100%; left: 0; top: 50%; transform: translateY(-50%); }
`;

/* ---- Home (overview dashboard) ---- */

const HomeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    & > *:first-child { order: 1; }
    & > *:last-child { order: 2; }
  }
`;

const HomeTopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
  flex-wrap: wrap;
`;

const CompanyInfo = styled.div`
  h2 {
    font-size: 20px;
    font-weight: bold;
    color: #000080;
    margin: 0 0 4px;
  }
  .tagline {
    font-size: 11px;
    font-style: italic;
    color: #555;
    margin-bottom: 6px;
  }
  .meta {
    font-size: 11px;
    color: #444;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
`;

const QuickContact = styled.div`
  text-align: right;
  font-size: 11px;
  color: #444;
  line-height: 1.6;
  .email { font-weight: bold; color: #000080; font-size: 12px; }
  @media (max-width: 640px) { text-align: left; }
`;

const HomeSection = styled(Panel)`
  padding: 10px 12px;
  h3 {
    font-size: 13px;
    font-weight: bold;
    color: #000080;
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const PricingCheckRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

const PricingCheckItem = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  cursor: default;
  padding: 2px 0;
  border-bottom: 1px dotted #dfdfdf;
  &:last-child { border-bottom: none; }
  .price { margin-left: auto; font-weight: bold; color: #000080; font-size: 11px; }
`;

const ServiceLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: none;
  border: none;
  padding: 4px 2px;
  font-family: inherit;
  font-size: 11px;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px dotted #c0c0c0;
  color: #000080;
  &:last-child { border-bottom: none; }
  &:hover { background: #000080; color: #fff; }
  .s-icon { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; }
`;

const PriceTotal = styled.div`
  text-align: right;
  padding-top: 6px;
  border-top: 2px solid #808080;
  margin-top: 4px;
  .total-label { font-size: 10px; color: #555; }
  .total-price { font-size: 18px; font-weight: bold; color: #000080; }
  .total-sub { font-size: 9px; color: #888; }
`;

/* ---- Diensten ---- */

const DienstenLayout = styled.div`
  display: flex;
  gap: 12px;
  min-height: 0;
  @media (max-width: 600px) { flex-direction: column; }
`;

const DienstenSidebar = styled.div`
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
  @media (max-width: 600px) {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2px;
  }
`;

const DienstBtn = styled(Button)`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 4px 8px;
  height: 28px;
  text-align: left;
  justify-content: flex-start;
  width: 100%;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  ${({ $active }) => $active && 'box-shadow: inset 1px 1px 4px rgba(0,0,0,0.35);'}
  .d-icon { font-size: 14px; flex-shrink: 0; width: 18px; text-align: center; }
  @media (max-width: 600px) {
    width: auto;
    flex: 0 0 auto;
  }
`;

const DienstenContent = styled(Panel)`
  flex: 1;
  padding: 12px;
  min-height: 200px;
  h3 {
    font-size: 15px;
    font-weight: bold;
    color: #000080;
    margin: 0 0 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dienst-desc {
    font-size: 12px;
    line-height: 1.6;
    margin: 0 0 10px;
    color: #333;
  }
`;

const SubItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 0;
  border-bottom: 1px dotted #c0c0c0;
  &:last-child { border-bottom: none; }
`;

const SubItemInfo = styled.div`
  flex: 1;
  .sub-name { font-size: 12px; font-weight: bold; color: #000080; }
  .sub-desc { font-size: 10px; color: #555; line-height: 1.4; margin-top: 1px; }
`;

const SubItemPrice = styled.span`
  font-size: 11px;
  font-weight: bold;
  color: #000080;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 1px;
`;

/* ---- Waarom ---- */

const ReasonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const ReasonCard = styled(GroupBox)`
  padding: 10px !important;
  h3 { font-size: 13px; font-weight: bold; color: #000080; margin: 4px 0 6px; }
  p { font-size: 12px; line-height: 1.5; margin: 0; }
`;

/* ---- Prijzen ---- */

const PriceCenter = styled.div`
  max-width: 460px; margin: 0 auto; text-align: center;
  .price-tag { font-size: 40px; font-weight: bold; color: #000080; margin: 4px 0; }
  .price-sub { font-size: 12px; color: #555; margin-bottom: 10px; }
  @media (max-width: 600px) { .price-tag { font-size: 32px; } }
`;

const FeatureList = styled.div`
  text-align: left; margin: 0 auto; max-width: 380px;
`;

const FeatureItem = styled.div`
  font-size: 12px; padding: 3px 0; display: flex; align-items: center; gap: 6px;
  border-bottom: 1px dotted #c0c0c0;
  &:last-child { border-bottom: none; }
  .ck { color: green; font-weight: bold; }
`;

/* ---- Contact ---- */

const ContactWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

/* ---- Taskbar ---- */

const TaskBarFixed = styled.div`
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000;
`;

const TBInner = styled.div`
  display: flex; align-items: center; padding: 2px 4px; height: 34px;
`;

const StartBtn = styled(Button)`
  font-weight: bold; display: flex; align-items: center; gap: 4px; flex-shrink: 0;
`;

const TBCopyright = styled.span`
  font-size: 9px;
  color: #808080;
  margin-left: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 640px) { display: none; }
`;

const ClockPanel = styled(Panel)`
  margin-left: auto; padding: 3px 14px; font-size: 12px; text-align: right;
  line-height: 1.35; flex-shrink: 0;
  div:last-child { font-size: 10px; }
`;

const StartOverlay = styled.div`
  position: absolute; bottom: 38px; left: 4px; z-index: 1001; display: flex;
`;

const SideStrip = styled.div`
  background: linear-gradient(to top, #000080, #1084d0);
  width: 26px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 10px;
  span { writing-mode: vertical-rl; transform: rotate(180deg); color: #fff; font-weight: bold; font-size: 14px; letter-spacing: 2px; }
`;

/* ================================================================== */
/*  DATA                                                               */
/* ================================================================== */

const NAV = [
  { id: 'home',     icon: '\u{1F5A5}\uFE0F', label: 'Home',       winTitle: 'Do-IT Solutions' },
  { id: 'diensten', icon: '\u{1F4C1}',         label: 'Diensten',   winTitle: 'C:\\Do-IT\\Diensten' },
  { id: 'waarom',   icon: '\u2B50',            label: 'Waarom wij', winTitle: 'Waarom Do-IT Solutions?' },
  { id: 'prijzen',  icon: '\u{1F4B0}',         label: 'Prijzen',    winTitle: 'Prijzen \u2014 Do-IT All-in-One' },
  { id: 'contact',  icon: '\u{1F4E7}',         label: 'Contact',    winTitle: 'Contact \u2014 Do-IT Solutions' },
];

const SERVICES = [
  {
    id: 'm365',
    icon: '\u{1F4E7}',
    label: 'Microsoft 365',
    short: 'Volledig M365 beheer, licenties en migraties',
    detail: 'Wij beheren uw volledige Microsoft 365 omgeving. Van licenties en gebruikersbeheer tot configuratie, migratie en dagelijkse ondersteuning. Alles zodat uw medewerkers productief kunnen werken.',
    subs: [
      { name: 'Exchange Online', desc: 'Zakelijke e-mail met 50GB mailbox, gedeelde postvakken, agenda\u2019s en contacten. Inclusief spam- en malwarefiltering.', price: '\u20AC4' },
      { name: 'SharePoint Online', desc: 'Intranet, teamsites en documentbibliotheken. Ideaal voor interne communicatie en samenwerken aan bestanden.', price: '\u20AC5' },
      { name: 'OneDrive for Business', desc: 'Persoonlijke cloudopslag (1TB) voor elke medewerker. Bestanden overal beschikbaar en automatisch gesynchroniseerd.', price: '\u20AC3' },
      { name: 'Microsoft Teams', desc: 'Chat, videovergaderen en samenwerken in \u00E9\u00E9n app. Integratie met alle Microsoft 365 apps.', price: '\u20AC4' },
      { name: 'M365 Apps', desc: 'Word, Excel, PowerPoint, Outlook \u2014 desktop- en webversies. Altijd de nieuwste versie, op maximaal 5 apparaten.', price: '\u20AC10' },
      { name: 'Exclaimer', desc: 'Professionele, centraal beheerde e-mailhandtekeningen voor de hele organisatie. Inclusief marketing banners en disclaimers.', price: '\u20AC2' },
      { name: 'Gebruikersbeheer', desc: 'On- en offboarding, licentietoewijzing, wachtwoordresets en MFA-configuratie. Wij regelen het.', price: '\u20AC3' },
    ],
  },
  {
    id: 'security',
    icon: '\u{1F512}',
    label: 'Cybersecurity',
    short: 'Microsoft Defender, e-mailbeveiliging en awareness',
    detail: 'Bescherm uw bedrijf tegen cyberdreigingen met bewezen Microsoft security-oplossingen. Wij configureren, monitoren en reageren zodat u veilig kunt werken.',
    subs: [
      { name: 'Microsoft Defender for Business', desc: 'Endpoint Detection & Response (EDR) voor al uw apparaten. Realtime bescherming tegen malware, ransomware en geavanceerde dreigingen.', price: '\u20AC8' },
      { name: 'E-mailbeveiliging', desc: 'Geavanceerde anti-phishing, anti-spam en Safe Links/Safe Attachments. Blokkeert schadelijke e-mails voordat ze uw inbox bereiken.', price: '\u20AC3' },
      { name: 'Patchbeheer', desc: 'Automatische updates voor Windows, Office en drivers. Wij testen en deployen patches zodat systemen altijd up-to-date zijn.', price: '\u20AC3' },
      { name: 'Darkweb monitoring', desc: 'Continue monitoring of inloggegevens van uw organisatie op het darkweb zijn gelekt. Direct melding bij een hit.', price: '\u20AC2' },
      { name: 'Security awareness training', desc: 'Online trainingen en gesimuleerde phishing-campagnes voor uw medewerkers. De mens is vaak de zwakste schakel.', price: '\u20AC2' },
      { name: 'Conditional Access & MFA', desc: 'Afdwingen van multi-factor authenticatie en locatie-/apparaatgebaseerde toegangsregels voor uw Microsoft 365 omgeving.', price: '\u20AC2' },
    ],
  },
  {
    id: 'cloud',
    icon: '\u2601\uFE0F',
    label: 'Cloud & Migratie',
    short: 'On-prem naar cloud, NAS, backup en continu\u00EFteit',
    detail: 'Wij helpen u veilig en soepel naar de cloud. Of het nu gaat om een migratie vanuit een lokale omgeving, het inrichten van cloudbackups of het waarborgen van bedrijfscontinu\u00EFteit. Wij doen g\u00E9\u00E9n serverbeheer \u2014 wij brengen u naar de cloud.',
    subs: [
      { name: 'On-premises naar cloud migratie', desc: 'Volledige migratie van uw lokale bestanden, e-mail en applicaties naar Microsoft 365 en Azure. Inclusief planning en begeleiding.', price: 'offerte' },
      { name: 'Cloud backup', desc: 'Automatische backup van uw Microsoft 365 data (mailboxen, SharePoint, OneDrive, Teams). Dagelijks, met snelle restores.', price: '\u20AC5' },
      { name: 'NAS & opslagoplossingen', desc: 'Inrichting en beheer van netwerkopslag (NAS) voor lokale backup, archivering of hybride cloudscenario\u2019s.', price: '\u20AC15/apparaat' },
      { name: 'Tenant continu\u00EFteit', desc: 'Bescherm uw Microsoft 365 tenant tegen uitval. Redundante configuratie en noodtoegang zodat u altijd bij uw data kunt.', price: '\u20AC3' },
      { name: 'Disaster recovery planning', desc: 'Draaiboek voor wanneer het mis gaat: herstelprocedures, prioriteiten en regelmatig testen. Zodat u snel weer operationeel bent.', price: '\u20AC4' },
    ],
  },
  {
    id: 'compliance',
    icon: '\u{1F4CB}',
    label: 'Compliance & AVG',
    short: 'AVG/GDPR, beleid en audit-ready rapportages',
    detail: 'Voldoe aan wet- en regelgeving zonder zorgen. Wij implementeren en bewaken de juiste technische en organisatorische maatregelen zodat u audit-ready bent.',
    subs: [
      { name: 'AVG/GDPR implementatie', desc: 'Technische maatregelen om te voldoen aan de privacywetgeving: dataclassificatie, retentiebeleid en verwerkersovereenkomsten.', price: '\u20AC4' },
      { name: 'Beveiligingsbeleid', desc: 'Opstellen van IT-beveiligingsbeleid, wachtwoordbeleid, acceptabel gebruik en incidentresponsplannen.', price: '\u20AC3' },
      { name: 'Data Loss Prevention (DLP)', desc: 'Voorkom dat gevoelige informatie per ongeluk buiten de organisatie wordt gedeeld via e-mail, Teams of OneDrive.', price: '\u20AC3' },
      { name: 'Audit-ready rapportages', desc: 'Maandelijkse rapportages over beveiliging, compliance-status en aanbevelingen. Klaar voor elke audit.', price: '\u20AC3' },
    ],
  },
  {
    id: 'netwerk',
    icon: '\u{1F310}',
    label: 'Netwerk & Infra',
    short: 'UniFi WiFi, firewalls, VPN en bekabeling',
    detail: 'Een betrouwbaar bedrijfsnetwerk is de ruggengraat van uw organisatie. Wij werken met UniFi enterprise-grade hardware voor WiFi en netwerken, en zorgen voor een veilige en snelle infrastructuur.',
    subs: [
      { name: 'UniFi WiFi', desc: 'Professionele WiFi-dekking met UniFi access points. Centraal beheerd via de UniFi Controller. Gasten-netwerk, VLAN\u2019s en roaming inbegrepen.', price: '\u20AC25/locatie' },
      { name: 'UniFi netwerkswitches', desc: 'Managed switches voor een gestructureerd en snel bedrijfsnetwerk. Met PoE, VLAN-segmentatie en monitoring.', price: '\u20AC20/locatie' },
      { name: 'Firewall & beveiliging', desc: 'UniFi Security Gateway of Dream Machine voor netwerkbeveiliging, IDS/IPS, en traffic management.', price: '\u20AC35/locatie' },
      { name: 'VPN-toegang', desc: 'Veilige VPN-verbinding voor thuiswerkers en vestigingen. Altijd beveiligd verbonden met het bedrijfsnetwerk.', price: '\u20AC5' },
      { name: 'VoIP-telefonie', desc: 'Internettelefonie (VoIP) met integratie in Teams of standalone. Flexibel, schaalbaar en kosteneffici\u00EBnt.', price: '\u20AC8' },
      { name: 'Bekabeling & inrichting', desc: 'Professionele netwerkkabeling (Cat6/Cat6a), patchpanelen en serverkasten. Netjes en toekomstbestendig.', price: 'offerte' },
    ],
  },
  {
    id: 'ai',
    icon: '\u{1F916}',
    label: 'AI & Automatisering',
    short: 'Power Automate, Copilot en slimme workflows',
    detail: 'Maak uw bedrijf slimmer met automatisering en AI-integraties. Bespaar tijd op repetitief werk en laat technologie het zware werk doen.',
    subs: [
      { name: 'Power Automate workflows', desc: 'Automatiseer terugkerende taken: goedkeuringsflows, notificaties, data-synchronisatie tussen apps. Geen code nodig.', price: '\u20AC5' },
      { name: 'Microsoft Copilot', desc: 'AI-assistent ge\u00EFntegreerd in Word, Excel, Outlook en Teams. Laat AI e-mails samenvatten, documenten opstellen en data analyseren.', price: '\u20AC28' },
      { name: 'Power BI rapportages', desc: 'Interactieve dashboards en rapportages vanuit uw bedrijfsdata. Inzicht in realtime, automatisch bijgewerkt.', price: '\u20AC8' },
      { name: 'Chatbots & klantinteractie', desc: 'AI-gestuurde chatbots voor uw website of Teams. Beantwoord veelgestelde vragen automatisch, 24/7.', price: 'offerte' },
      { name: 'Documentverwerking', desc: 'Automatische verwerking van facturen, formulieren en documenten met AI. Van papier naar digitaal in seconden.', price: 'offerte' },
    ],
  },
];

const PRICING_OPTIONS = [
  { id: 'apps',     label: 'M365 Apps (Word, Excel, PowerPoint, Outlook, Teams)', price: 15 },
  { id: 'endpoint', label: 'Endpoint bescherming (Defender)',                      price: 8 },
  { id: 'email',    label: 'E-mailbeveiliging & anti-phishing',                    price: 3 },
  { id: 'support',  label: 'Support & helpdesk',                                   price: 17 },
];

const WA_LINK = 'https://wa.me/31651419202';

/* ================================================================== */
/*  APP                                                                */
/* ================================================================== */

export default function App() {
  const [page, setPage] = useState('home');
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState(new Date());
  const [form, setForm] = useState({ naam: '', email: '', telefoon: '', bericht: '' });
  const [sent, setSent] = useState(false);
  const [activeDienst, setActiveDienst] = useState('m365');
  const [pricingChecks, setPricingChecks] = useState({ apps: true, endpoint: true, email: true, support: true });

  useEffect(() => { const t = setInterval(() => setClock(new Date()), 30000); return () => clearInterval(t); }, []);

  const time = clock.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  const date = clock.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const go = (id) => { setPage(id); setStartOpen(false); };
  const cur = NAV.find((n) => n.id === page);
  const chg = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const togglePrice = (id) => setPricingChecks((p) => ({ ...p, [id]: !p[id] }));
  const totalPrice = PRICING_OPTIONS.reduce((sum, o) => sum + (pricingChecks[o.id] ? o.price : 0), 0);

  const submit = () => {
    if (!form.naam || !form.email || !form.bericht) { alert('Vul a.u.b. naam, email en bericht in.'); return; }
    const subject = encodeURIComponent('Contactverzoek via website - ' + form.naam);
    const body = encodeURIComponent(
      'Naam: ' + form.naam +
      '\nE-mail: ' + form.email +
      '\nTelefoon: ' + (form.telefoon || 'niet opgegeven') +
      '\n\nBericht:\n' + form.bericht
    );
    window.location.href = 'mailto:info@doitsolutions.nl?subject=' + subject + '&body=' + body;
    setSent(true);
  };

  /* ---- page renderers ---- */

  const Home = () => (
    <div>
      <HomeTopBar>
        <CompanyInfo>
          <h2>{'\u{1F5A5}\uFE0F'} Do-IT Solutions</h2>
          <div className="tagline">Nieuwe technologie, ouderwets goed.</div>
          <div className="meta">
            <span>{'\u{1F4CD}'} Gevestigd in Denekamp</span>
            <span>{'\u{1F4C5}'} Actief sinds 2019</span>
          </div>
        </CompanyInfo>
        <QuickContact>
          <div className="email">{'\u{1F4E7}'} info@doitsolutions.nl</div>
          <div>ma-vr 08:00 {'\u2013'} 18:00</div>
        </QuickContact>
      </HomeTopBar>

      <Separator style={{ marginBottom: 12 }} />

      <HomeGrid>
        {/* Left column: services (shown first on mobile) */}
        <HomeSection variant="well" style={{ order: 1 }}>
          <h3>{'\u{1F4C1}'} Onze diensten</h3>
          {SERVICES.map((s) => (
            <ServiceLink key={s.id} onClick={() => { setActiveDienst(s.id); go('diensten'); }}>
              <span className="s-icon">{s.icon}</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 11 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: '#666', marginTop: 1 }}>{s.short}</div>
              </div>
            </ServiceLink>
          ))}
          <Button size="sm" style={{ marginTop: 8, width: '100%' }} onClick={() => go('diensten')}>{'\u{1F4C1}'} Alle diensten bekijken</Button>
        </HomeSection>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, order: 2 }}>
          {/* Waarom wij */}
          <HomeSection variant="well">
            <h3>{'\u2B50'} Waarom Do-IT?</h3>
            <div style={{ fontSize: 11, lineHeight: 1.5, color: '#444' }}>
              <div style={{ padding: '3px 0', borderBottom: '1px dotted #dfdfdf' }}>{'\u{1F527}'} Ouderwetse betrouwbaarheid {'\u2014'} IT moet gewoon werken</div>
              <div style={{ padding: '3px 0', borderBottom: '1px dotted #dfdfdf' }}>{'\u{1F91D}'} Vast aanspreekpunt dat uw bedrijf kent</div>
              <div style={{ padding: '3px 0', borderBottom: '1px dotted #dfdfdf' }}>{'\u{1F4E6}'} Alles onder {'\u00E9\u00E9'}n dak {'\u2014'} {'\u00E9\u00E9'}n partner voor al uw IT</div>
              <div style={{ padding: '3px 0', borderBottom: '1px dotted #dfdfdf' }}>{'\u{1F4B8}'} Transparant {'\u2014'} geen verrassingen op de factuur</div>
              <div style={{ padding: '3px 0' }}>{'\u{1F680}'} Proactief {'\u2014'} voorkomen is beter dan genezen</div>
            </div>
            <Button size="sm" style={{ marginTop: 8, width: '100%' }} onClick={() => go('waarom')}>{'\u2B50'} Meer over waarom wij</Button>
          </HomeSection>

          {/* Contact block */}
          <HomeSection variant="well">
            <h3>{'\u{1F4E8}'} Contact</h3>
            <p style={{ fontSize: 11, lineHeight: 1.5, margin: '0 0 8px', color: '#444' }}>
              Heeft u een vraag of wilt u vrijblijvend overleggen?
              Neem direct contact met ons op.
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Button size="sm" primary onClick={() => go('contact')}>{'\u{1F4E8}'} Stuur e-mail</Button>
              <Button size="sm" onClick={() => window.open(WA_LINK + '?text=Hallo%20Do-IT%20Solutions!%20Ik%20heb%20een%20vraag.', '_blank')}>{'\u{1F4AC}'} WhatsApp</Button>
            </div>
          </HomeSection>
        </div>
      </HomeGrid>
    </div>
  );

  const activeService = SERVICES.find((s) => s.id === activeDienst) || SERVICES[0];

  const Diensten = () => (
    <DienstenLayout>
      <DienstenSidebar>
        {SERVICES.map((s) => (
          <DienstBtn key={s.id} size="sm" $active={activeDienst === s.id} onClick={() => setActiveDienst(s.id)}>
            <span className="d-icon">{s.icon}</span> {s.label}
          </DienstBtn>
        ))}
      </DienstenSidebar>
      <DienstenContent variant="well">
        <h3>{activeService.icon} {activeService.label}</h3>
        <p className="dienst-desc">{activeService.detail}</p>
        <Separator style={{ marginBottom: 8 }} />
        {activeService.subs.map((sub) => (
          <SubItemRow key={sub.name}>
            <Checkbox checked disabled label="" style={{ marginTop: 2, marginRight: -4 }} />
            <SubItemInfo>
              <div className="sub-name">{sub.name}</div>
              <div className="sub-desc">{sub.desc}</div>
            </SubItemInfo>
            <SubItemPrice>{sub.price}{sub.price !== 'offerte' && '/mnd'}</SubItemPrice>
          </SubItemRow>
        ))}
        <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
          <Button size="sm" primary onClick={() => go('contact')}>{'\u{1F4E8}'} Offerte aanvragen</Button>
          <Button size="sm" onClick={() => window.open(WA_LINK + '?text=' + encodeURIComponent('Hallo Do-IT! Ik heb een vraag over ' + activeService.label + '.'), '_blank')}>{'\u{1F4AC}'} WhatsApp</Button>
        </div>
      </DienstenContent>
    </DienstenLayout>
  );

  const Waarom = () => (
    <div>
      <p style={{ fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
        Waarom kiezen bedrijven voor Do-IT Solutions als hun IT-partner?
      </p>
      <ReasonGrid>
        <ReasonCard label={'\u{1F527} Betrouwbaar'}>
          <h3>Ouderwetse betrouwbaarheid</h3>
          <p>IT moet gewoon werken. Geen gedoe, geen verrassingen. Met proactieve monitoring voorkomen we problemen voordat ze ontstaan.</p>
        </ReasonCard>
        <ReasonCard label={'\u{1F91D} Persoonlijk'}>
          <h3>Vast aanspreekpunt</h3>
          <p>Bij ons bent u geen ticketnummer. U krijgt een vast aanspreekpunt dat uw bedrijf door en door kent.</p>
        </ReasonCard>
        <ReasonCard label={'\u{1F4E6} Compleet'}>
          <h3>Alles onder {'\u00E9\u00E9'}n dak</h3>
          <p>Van Office 365 tot cybersecurity, van cloud migratie tot netwerkinrichting. {'\u00C9\u00E9'}n partner voor al uw IT.</p>
        </ReasonCard>
        <ReasonCard label={'\u{1F4B8} Transparant'}>
          <h3>Geen verrassingen op de factuur</h3>
          <p>{'\u00C9\u00E9'}n vast bedrag per gebruiker per maand. Geen verborgen kosten. Maandelijks opzegbaar.</p>
        </ReasonCard>
        <ReasonCard label={'\u{1F680} Proactief'}>
          <h3>Voorkomen is beter dan genezen</h3>
          <p>Wij wachten niet tot het misgaat. Continue monitoring en regelmatig onderhoud houden uw IT gezond en veilig.</p>
        </ReasonCard>
        <ReasonCard label={'\u{1F4C8} Schaalbaar'}>
          <h3>Groeit met uw bedrijf</h3>
          <p>Of u nu 5 of 500 medewerkers heeft {'\u2014'} onze dienstverlening schaalt mee. Nieuwe medewerker? Binnen een dag productief.</p>
        </ReasonCard>
      </ReasonGrid>
    </div>
  );

  const Prijzen = () => (
    <PriceCenter>
      <Panel variant="well" style={{ padding: 16 }}>
        <p style={{ fontSize: 14, fontWeight: 'bold', color: '#000080' }}>Do-IT All-in-One Pakket</p>
        <div className="price-tag">{'\u20AC'}50</div>
        <p className="price-sub">per gebruiker / per maand (excl. BTW)</p>
        <Separator />
        <FeatureList style={{ marginTop: 14 }}>
          {[
            'Microsoft 365 beheer (Outlook, Teams, SharePoint, OneDrive)',
            'Microsoft Defender for Business (EDR)',
            'Patchbeheer & automatische updates',
            'E-mailbeveiliging & anti-phishing',
            'Cloud backup & disaster recovery',
            'Helpdesk \u2014 onbeperkt tickets indienen',
            'Proactieve monitoring 24/7',
            'Maandelijkse rapportage & review',
            'AVG-compliant werken',
            'On- en offboarding van medewerkers',
          ].map((f) => (
            <FeatureItem key={f}><span className="ck">{'\u2714'}</span>{f}</FeatureItem>
          ))}
        </FeatureList>
        <Separator style={{ margin: '14px 0' }} />
        <p style={{ fontSize: 12, color: '#666' }}>
          Minimum 3 gebruikers {'\u2022'} Geen langlopend contract {'\u2022'} Maandelijks opzegbaar
        </p>
      </Panel>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 18 }}>
        <Button size="lg" primary onClick={() => go('contact')}>{'\u{1F4E8}'} Vraag een offerte aan</Button>
        <Button size="lg" onClick={() => window.open(WA_LINK + '?text=Hallo%20Do-IT!%20Ik%20wil%20graag%20een%20offerte.', '_blank')}>{'\u{1F4AC}'} WhatsApp ons</Button>
      </div>
      <p style={{ fontSize: 12, marginTop: 12, color: '#666' }}>Meer dan 50 gebruikers? Neem contact op voor maatwerk.</p>
    </PriceCenter>
  );

  const Contact = () => (
    <>
      {sent ? (
        <Panel variant="well" style={{ padding: 28, textAlign: 'center' }}>
          <p style={{ fontSize: 17 }}>{'\u2705'} <strong>Bedankt!</strong></p>
          <p style={{ fontSize: 13, marginTop: 8 }}>Uw e-mailprogramma zou moeten openen. Wij reageren zo snel mogelijk.</p>
          <Button style={{ marginTop: 14 }} onClick={() => setSent(false)}>Nieuw bericht versturen</Button>
        </Panel>
      ) : (
        <ContactWrap>
          <Fieldset label={'\u{1F4E8} Stuur ons een e-mail'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 4px' }}>
              <div><label style={{ fontSize: 12, fontWeight: 'bold' }}>Naam *</label><TextInput value={form.naam} onChange={chg('naam')} placeholder="Uw naam" fullWidth /></div>
              <div><label style={{ fontSize: 12, fontWeight: 'bold' }}>E-mail *</label><TextInput value={form.email} onChange={chg('email')} placeholder="uw@email.nl" fullWidth /></div>
              <div><label style={{ fontSize: 12, fontWeight: 'bold' }}>Telefoon</label><TextInput value={form.telefoon} onChange={chg('telefoon')} placeholder="Uw telefoonnummer" fullWidth /></div>
              <div><label style={{ fontSize: 12, fontWeight: 'bold' }}>Bericht *</label><TextInput value={form.bericht} onChange={chg('bericht')} placeholder="Waar kunnen wij u mee helpen?" multiline rows={5} fullWidth /></div>
              <Button primary onClick={submit} style={{ alignSelf: 'flex-start' }}>{'\u{1F4E8}'} Verstuur e-mail</Button>
              <p style={{ fontSize: 10, color: '#888', margin: 0 }}>Opent uw standaard e-mailprogramma met het bericht naar info@doitsolutions.nl</p>
            </div>
          </Fieldset>
          <Fieldset label={'\u{1F4AC} WhatsApp'}>
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 52 }}>{'\u{1F4AC}'}</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: '14px 0' }}>
                Liever direct chatten?<br />
                Stuur ons een WhatsApp bericht en we reageren doorgaans binnen 15 minuten!
              </p>
              <Button primary size="lg"
                onClick={() => window.open(WA_LINK + '?text=Hallo%20Do-IT%20Solutions!%20Ik%20heb%20een%20vraag.', '_blank')}>
                {'\u{1F4AC}'} Open WhatsApp
              </Button>
              <Separator style={{ margin: '16px 0' }} />
              <p style={{ fontSize: 12, color: '#555' }}>
                Bereikbaar ma-vr 08:00 {'\u2013'} 18:00<br />
                Spoedgevallen 24/7 via WhatsApp
              </p>
            </div>
          </Fieldset>
        </ContactWrap>
      )}
    </>
  );

  const pages = { home: Home, diensten: Diensten, waarom: Waarom, prijzen: Prijzen, contact: Contact };
  const PageComponent = pages[page];

  return (
    <>
      <Desktop onClick={() => startOpen && setStartOpen(false)}>
        <MainWindow>
          <StyledWindowHeader>
            <HeaderTitle>{cur.icon} {cur.winTitle}</HeaderTitle>
            <HeaderButtons>
              <Button size="sm" square disabled><span style={{ fontSize: 10 }}>{'\u25C1'}</span></Button>
              <Button size="sm" square disabled><span style={{ fontSize: 10 }}>{'\u25A1'}</span></Button>
              <Button size="sm" square><CloseIcon /></Button>
            </HeaderButtons>
          </StyledWindowHeader>

          <NavToolbar>
            {NAV.map((n) => (
              <NavButton key={n.id} size="sm" $active={page === n.id} onClick={() => go(n.id)}>
                {n.icon} {n.label}
              </NavButton>
            ))}
          </NavToolbar>

          <ScrollContent>
            <PageComponent />
          </ScrollContent>
        </MainWindow>
      </Desktop>

      <TaskBarFixed>
        <AppBar style={{ position: 'relative' }}>
          <TBInner>
            <StartBtn onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); }} active={startOpen}>
              {'\u{1FAA9}'} Start
            </StartBtn>
            <TBCopyright>
              {'\u00A9'} {new Date().getFullYear()} Do-IT Solutions {'\u2022'} Nieuwe technologie, ouderwets goed.
            </TBCopyright>
            <ClockPanel variant="well">
              <div>{time}</div>
              <div>{date}</div>
            </ClockPanel>
          </TBInner>
        </AppBar>
        {startOpen && (
          <StartOverlay onClick={(e) => e.stopPropagation()}>
            <SideStrip><span>Do-IT Solutions</span></SideStrip>
            <MenuList style={{ minWidth: 220 }}>
              {NAV.map((n) => (
                <MenuListItem key={n.id} onClick={() => go(n.id)}>
                  <span style={{ marginRight: 10 }}>{n.icon}</span> {n.label}
                </MenuListItem>
              ))}
              <Separator />
              <MenuListItem onClick={() => window.open(WA_LINK + '?text=Hallo%20Do-IT%20Solutions!', '_blank')}>
                <span style={{ marginRight: 10 }}>{'\u{1F4AC}'}</span> WhatsApp
              </MenuListItem>
            </MenuList>
          </StartOverlay>
        )}
      </TaskBarFixed>
    </>
  );
}
