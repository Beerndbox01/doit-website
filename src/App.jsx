import { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { marked } from 'marked';
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
import posts from './posts';

import original from 'react95/dist/themes/original';
import rose from 'react95/dist/themes/rose';
import rainyDay from 'react95/dist/themes/rainyDay';
import tokyoDark from 'react95/dist/themes/tokyoDark';
import vaporTeal from 'react95/dist/themes/vaporTeal';
import hotdogStand from 'react95/dist/themes/hotdogStand';
import matrix from 'react95/dist/themes/matrix';
import lilac from 'react95/dist/themes/lilac';

const THEMES = [
  { theme: original,    name: 'Klassiek',      desktop: '#008080', accent: '#000080' },
  { theme: rose,        name: 'Roze',          desktop: '#8B4564', accent: '#8B2252' },
  { theme: rainyDay,    name: 'Regendag',      desktop: '#4a5568', accent: '#2d3748' },
  { theme: tokyoDark,   name: 'Tokyo Dark',    desktop: '#1a1a2e', accent: '#e94560' },
  { theme: vaporTeal,   name: 'Vapor Teal',    desktop: '#006666', accent: '#008B8B' },
  { theme: hotdogStand, name: 'Hotdog Stand',  desktop: '#ff0000', accent: '#ffff00' },
  { theme: matrix,      name: 'Matrix',        desktop: '#0a0a0a', accent: '#00ff00' },
  { theme: lilac,       name: 'Lila',          desktop: '#554466', accent: '#663399' },
];

/* ================================================================== */
/*  STYLED COMPONENTS                                                  */
/* ================================================================== */

const Desktop = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ $bg }) => $bg || '#008080'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px 48px 16px;
  overflow: hidden;
  position: relative;
  transition: background 0.4s ease;
  @media (max-width: 600px) {
    padding: 6px 6px 42px 6px;
  }
`;

/* ---- Error Dialog ---- */

const ErrorOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ErrorWindow = styled(Window)`
  width: 420px;
  max-width: 90vw;
  box-shadow: 4px 4px 10px rgba(0,0,0,0.5);
`;

const ErrorHeader = styled(WindowHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 4px 3px 8px;
  background: #000080;
`;

const ErrorBody = styled(WindowContent)`
  display: flex;
  gap: 14px;
  padding: 16px;
  align-items: flex-start;
`;

const ErrorIcon = styled.span`
  font-size: 36px;
  flex-shrink: 0;
  line-height: 1;
`;

const ErrorText = styled.div`
  font-size: 12px;
  line-height: 1.6;
  color: #000;
`;

const ErrorLink = styled.span`
  color: #000080;
  text-decoration: underline;
  cursor: pointer;
  font-weight: bold;
  &:hover { color: #0000ff; }
`;

const ErrorActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 0 16px 14px;
`;

const MainWindow = styled(Window)`
  width: 100%;
  max-width: 880px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 10;
  overflow: hidden;
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
  padding: 4px 6px;
  flex-wrap: wrap;
  border-bottom: 2px groove #e0e0e0;
  background: ${({ theme }) => theme.material};
  box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #808080;
  margin: 2px 3px;
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
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 12px 16px;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  min-height: 0;
  @media (max-width: 600px) { padding: 8px 10px; }
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

const PartnersBar = styled.div`
  margin-top: auto;
  padding: 14px 16px 8px;
  text-align: center;
  .partners-title {
    font-size: 10px;
    color: #808080;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const PartnersRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  img {
    height: 26px;
    object-fit: contain;
    opacity: 0.6;
    filter: grayscale(30%);
    transition: opacity 0.3s, filter 0.3s;
    &:hover { opacity: 1; filter: grayscale(0%); }
  }
  @media (max-width: 600px) {
    display: none;
  }
`;

/* Mobile marquee for partners */
const marqueeScroll = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const PartnersMarquee = styled.div`
  display: none;
  @media (max-width: 600px) {
    display: block;
    overflow: hidden;
    width: 100%;
    position: relative;
  }
`;

const MarqueeTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  animation: ${marqueeScroll} 12s linear infinite;
  width: max-content;
  img {
    height: 22px;
    object-fit: contain;
    opacity: 0.7;
    flex-shrink: 0;
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

/* ---- Prijzen Calculator (limehawk-inspired two-column) ---- */

const PrijzenLayout = styled.div`
  display: flex;
  gap: 12px;
  min-height: 0;
  @media (max-width: 700px) { flex-direction: column; }
`;

const PrijzenLeft = styled(Fieldset)`
  flex: 1;
  min-width: 0;
  padding: 10px !important;
`;

const PrijzenRight = styled(Fieldset)`
  flex: 1;
  min-width: 0;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
`;

const UserCountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
  .user-label { font-size: 12px; font-weight: bold; margin-right: 6px; }
`;

const UserInput = styled.input`
  width: 42px;
  height: 22px;
  text-align: center;
  font-family: inherit;
  font-size: 13px;
  font-weight: bold;
  border: 2px inset #c0c0c0;
  background: #fff;
  color: #000;
  &:focus { outline: 1px dotted #000; }
`;

const CompareTable = styled.div`
  border: 2px inset #c0c0c0;
  background: #fff;
  margin-bottom: 10px;
`;

const CompareRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 5px 8px;
  border-bottom: 1px solid #e0e0e0;
  &:last-child { border-bottom: none; }
  .cmp-label { color: #000; }
  .cmp-value { font-weight: bold; text-align: right; }
`;

const SavingsBox = styled.div`
  border: 2px inset #c0c0c0;
  background: #fff;
  padding: 6px 8px;
  margin-bottom: 10px;
`;

const SavingsRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 2px 0;
  .sav-label { color: #000; }
  .sav-value { font-weight: bold; }
  .sav-green { font-weight: bold; color: green; }
`;

const ProgressBar = styled.div`
  height: 18px;
  border: 2px inset #c0c0c0;
  background: #fff;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(to right, #000080, #316ac5);
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  transition: width 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  min-width: ${({ $pct }) => ($pct > 8 ? '0' : '40')}px;
`;

const BaseRateNote = styled.div`
  font-size: 11px;
  color: #555;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CheckItem = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 2px 0;
  cursor: default;
`;

/* Options tabs (right panel) */

const TabRow = styled.div`
  display: flex;
  gap: 0;
  padding: 6px 8px 0;
  background: ${({ theme }) => theme.material};
`;

const Tab = styled.button`
  font-family: inherit;
  font-size: 11px;
  padding: 3px 12px;
  border: 2px outset #dfdfdf;
  border-bottom: ${({ $active }) => ($active ? 'none' : '2px outset #dfdfdf')};
  background: ${({ $active, theme }) => ($active ? theme.material : '#d4d0c8')};
  cursor: pointer;
  position: relative;
  top: 2px;
  z-index: ${({ $active }) => ($active ? 2 : 1)};
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  margin-right: -1px;
  &:hover { background: ${({ theme }) => theme.material}; }
`;

const TabContent = styled.div`
  border: 2px inset #c0c0c0;
  background: #fff;
  flex: 1;
  overflow-y: auto;
  padding: 8px 10px;
  margin: 0 8px 8px;
`;

const OptCategory = styled.div`
  margin-bottom: 10px;
  &:last-child { margin-bottom: 0; }
  .opt-cat-title { font-size: 12px; font-weight: bold; margin-bottom: 4px; }
`;

const OptRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  padding: 3px 8px;
  border: 1px solid #e0e0e0;
  margin-bottom: 2px;
  background: #fafafa;
  .opt-name { color: #000; }
  .opt-price { font-weight: bold; text-align: right; white-space: nowrap; }
`;

const FaqItem = styled.div`
  padding: 8px 0;
  border-bottom: 1px dotted #c0c0c0;
  &:last-child { border-bottom: none; }
  .faq-q { font-size: 12px; font-weight: bold; color: #000080; margin-bottom: 4px; cursor: pointer; }
  .faq-q:hover { text-decoration: underline; }
  .faq-a { font-size: 11px; color: #444; line-height: 1.5; }
`;

/* ---- Blog (Notepad thema) ---- */

const NotepadWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 300px;
`;

const NotepadMenuBar = styled.div`
  display: flex;
  gap: 0;
  padding: 2px 4px;
  font-size: 11px;
  border-bottom: 1px solid #c0c0c0;
  background: #ece9d8;
  flex-shrink: 0;
`;

const NotepadMenuItem = styled.span`
  padding: 2px 8px;
  cursor: default;
  &:hover { background: #316ac5; color: #fff; }
`;

const NotepadBody = styled.div`
  flex: 1;
  background: #fff;
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.7;
  color: #000;
  overflow-y: auto;

  h2 { font-size: 15px; font-weight: bold; color: #000080; margin: 16px 0 6px; }
  h3 { font-size: 13px; font-weight: bold; color: #000080; margin: 12px 0 4px; }
  p { margin: 0 0 8px; }
  ul, ol { margin: 4px 0 8px 20px; padding: 0; }
  li { margin-bottom: 2px; }
  strong { font-weight: bold; }
  em { font-style: italic; }
  code { background: #f0f0f0; padding: 1px 4px; font-family: 'Courier New', monospace; font-size: 12px; }
`;

const NotepadStatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2px 8px;
  font-size: 10px;
  color: #555;
  border-top: 1px solid #c0c0c0;
  background: #ece9d8;
  flex-shrink: 0;
`;

const BlogListItem = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  background: ${({ $alt }) => ($alt ? '#f5f5f0' : '#fff')};
  border: none;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  color: #000;
  &:hover { background: #316ac5; color: #fff; }
  &:hover .blog-date { color: #ccc; }
  &:hover .blog-summary { color: #ddd; }
  .blog-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
  .blog-title { font-weight: bold; font-size: 13px; }
  .blog-date { font-size: 10px; color: #888; margin-top: 2px; }
  .blog-summary { font-size: 11px; color: #555; margin-top: 2px; line-height: 1.4; }
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
  { id: 'prijzen',  icon: '\u{1F4B0}',         label: 'Prijzen',    winTitle: 'Prijscalculator \u2014 Do-IT Solutions' },
  { id: 'blog',     icon: '\u{1F4DD}',         label: 'Blog',       winTitle: 'Kladblok \u2014 Do-IT Blog' },
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
      { name: 'Exchange Online', desc: 'Zakelijke e-mail met 50GB mailbox, gedeelde postvakken, agenda\u2019s en contacten. Inclusief spam- en malwarefiltering.' },
      { name: 'SharePoint Online', desc: 'Intranet, teamsites en documentbibliotheken. Ideaal voor interne communicatie en samenwerken aan bestanden.' },
      { name: 'OneDrive for Business', desc: 'Persoonlijke cloudopslag (1TB) voor elke medewerker. Bestanden overal beschikbaar en automatisch gesynchroniseerd.' },
      { name: 'Microsoft Teams', desc: 'Chat, videovergaderen en samenwerken in \u00E9\u00E9n app. Integratie met alle Microsoft 365 apps.' },
      { name: 'M365 Apps', desc: 'Word, Excel, PowerPoint, Outlook \u2014 desktop- en webversies. Altijd de nieuwste versie, op maximaal 5 apparaten.' },
      { name: 'Exclaimer', desc: 'Professionele, centraal beheerde e-mailhandtekeningen voor de hele organisatie. Inclusief marketing banners en disclaimers.' },
      { name: 'Gebruikersbeheer', desc: 'On- en offboarding, licentietoewijzing, wachtwoordresets en MFA-configuratie. Wij regelen het.' },
    ],
  },
  {
    id: 'security',
    icon: '\u{1F512}',
    label: 'Security',
    short: 'Microsoft Defender, e-mailbeveiliging en awareness',
    detail: 'Bescherm uw bedrijf tegen cyberdreigingen met bewezen Microsoft security-oplossingen. Wij configureren, monitoren en reageren zodat u veilig kunt werken.',
    subs: [
      { name: 'Microsoft Defender for Business', desc: 'Endpoint Detection & Response (EDR) voor al uw apparaten. Realtime bescherming tegen malware, ransomware en geavanceerde dreigingen.' },
      { name: 'E-mailbeveiliging', desc: 'Geavanceerde anti-phishing, anti-spam en Safe Links/Safe Attachments. Blokkeert schadelijke e-mails voordat ze uw inbox bereiken.' },
      { name: 'Patchbeheer', desc: 'Automatische updates voor Windows, Office en drivers. Wij testen en deployen patches zodat systemen altijd up-to-date zijn.' },
      { name: 'Darkweb monitoring', desc: 'Continue monitoring of inloggegevens van uw organisatie op het darkweb zijn gelekt. Direct melding bij een hit.' },
      { name: 'Security awareness training', desc: 'Online trainingen en gesimuleerde phishing-campagnes voor uw medewerkers. De mens is vaak de zwakste schakel.' },
      { name: 'Conditional Access & MFA', desc: 'Afdwingen van multi-factor authenticatie en locatie-/apparaatgebaseerde toegangsregels voor uw Microsoft 365 omgeving.' },
    ],
  },
  {
    id: 'cloud',
    icon: '\u2601\uFE0F',
    label: 'Cloud & Migratie',
    short: 'On-prem naar cloud, NAS, backup en continu\u00EFteit',
    detail: 'Wij helpen u veilig en soepel naar de cloud. Of het nu gaat om een migratie vanuit een lokale omgeving, het inrichten van cloudbackups of het waarborgen van bedrijfscontinu\u00EFteit. Wij doen g\u00E9\u00E9n serverbeheer \u2014 wij brengen u naar de cloud.',
    subs: [
      { name: 'On-premises naar cloud migratie', desc: 'Volledige migratie van uw lokale bestanden, e-mail en applicaties naar Microsoft 365 en Azure. Inclusief planning en begeleiding.' },
      { name: 'Cloud backup', desc: 'Automatische backup van uw Microsoft 365 data (mailboxen, SharePoint, OneDrive, Teams). Dagelijks, met snelle restores.' },
      { name: 'NAS & opslagoplossingen', desc: 'Inrichting en beheer van netwerkopslag (NAS) voor lokale backup, archivering of hybride cloudscenario\u2019s.' },
      { name: 'Tenant continu\u00EFteit', desc: 'Bescherm uw Microsoft 365 tenant tegen uitval. Redundante configuratie en noodtoegang zodat u altijd bij uw data kunt.' },
      { name: 'Disaster recovery planning', desc: 'Draaiboek voor wanneer het mis gaat: herstelprocedures, prioriteiten en regelmatig testen. Zodat u snel weer operationeel bent.' },
    ],
  },
  {
    id: 'compliance',
    icon: '\u{1F4CB}',
    label: 'Compliance & AVG',
    short: 'AVG/GDPR, beleid en audit-ready rapportages',
    detail: 'Voldoe aan wet- en regelgeving zonder zorgen. Wij implementeren en bewaken de juiste technische en organisatorische maatregelen zodat u audit-ready bent.',
    subs: [
      { name: 'AVG/GDPR implementatie', desc: 'Technische maatregelen om te voldoen aan de privacywetgeving: dataclassificatie, retentiebeleid en verwerkersovereenkomsten.' },
      { name: 'Beveiligingsbeleid', desc: 'Opstellen van IT-beveiligingsbeleid, wachtwoordbeleid, acceptabel gebruik en incidentresponsplannen.' },
      { name: 'Data Loss Prevention (DLP)', desc: 'Voorkom dat gevoelige informatie per ongeluk buiten de organisatie wordt gedeeld via e-mail, Teams of OneDrive.' },
      { name: 'Audit-ready rapportages', desc: 'Maandelijkse rapportages over beveiliging, compliance-status en aanbevelingen. Klaar voor elke audit.' },
    ],
  },
  {
    id: 'netwerk',
    icon: '\u{1F310}',
    label: 'Netwerk & Infra',
    short: 'UniFi WiFi, firewalls, VPN en bekabeling',
    detail: 'Een betrouwbaar bedrijfsnetwerk is de ruggengraat van uw organisatie. Wij werken met UniFi enterprise-grade hardware voor WiFi en netwerken, en zorgen voor een veilige en snelle infrastructuur.',
    subs: [
      { name: 'UniFi WiFi', desc: 'Professionele WiFi-dekking met UniFi access points. Centraal beheerd via de UniFi Controller. Gasten-netwerk, VLAN\u2019s en roaming inbegrepen.' },
      { name: 'UniFi netwerkswitches', desc: 'Managed switches voor een gestructureerd en snel bedrijfsnetwerk. Met PoE, VLAN-segmentatie en monitoring.' },
      { name: 'Firewall & beveiliging', desc: 'UniFi Security Gateway of Dream Machine voor netwerkbeveiliging, IDS/IPS, en traffic management.' },
      { name: 'VPN-toegang', desc: 'Veilige VPN-verbinding voor thuiswerkers en vestigingen. Altijd beveiligd verbonden met het bedrijfsnetwerk.' },
      { name: 'Bekabeling & inrichting', desc: 'Professionele netwerkkabeling (Cat6/Cat6a), patchpanelen en serverkasten. Netjes en toekomstbestendig.' },
    ],
  },
  {
    id: 'ai',
    icon: '\u{1F916}',
    label: 'AI & Automatisering',
    short: 'Power Automate, Copilot en slimme workflows',
    detail: 'Maak uw bedrijf slimmer met automatisering en AI-integraties. Bespaar tijd op repetitief werk en laat technologie het zware werk doen.',
    subs: [
      { name: 'Power Automate workflows', desc: 'Automatiseer terugkerende taken: goedkeuringsflows, notificaties, data-synchronisatie tussen apps. Geen code nodig.' },
      { name: 'Microsoft Copilot', desc: 'AI-assistent ge\u00EFntegreerd in Word, Excel, Outlook en Teams. Laat AI e-mails samenvatten, documenten opstellen en data analyseren.' },
      { name: 'Chatbots & klantinteractie', desc: 'AI-gestuurde chatbots voor uw website of Teams. Beantwoord veelgestelde vragen automatisch, 24/7.' },
      { name: 'Documentverwerking', desc: 'Automatische verwerking van facturen, formulieren en documenten met AI. Van papier naar digitaal in seconden.' },
    ],
  },
];

/* Calculator pricing tiers — each builds on the previous (cumulative) */
const CALC_OPTIONS = [
  { id: 'mailbox',    name: 'Exchange Mailbox',       desc: '50GB postvak, gedeelde agenda\u2019s, contacten en postvakken',   tier: 'Microsoft 365 Exchange Online Plan 1',    price: 5.50 },
  { id: 'apps',       name: 'Office Apps',             desc: 'Word, Excel, PowerPoint, Outlook, Teams \u2014 desktop + web',    tier: 'Upgrade naar Microsoft 365 Business Standard', price: 7.50 },
  { id: 'security',   name: 'Beveiliging',             desc: 'Defender EDR, anti-phishing, Conditional Access, Intune MDM',     tier: 'Upgrade naar Microsoft 365 Business Premium',  price: 9.50 },
  { id: 'rmm',        name: 'RMM & Monitoring',        desc: 'Remote monitoring, patchbeheer, proactief onderhoud 24/7',        tier: 'Do-IT beheerplatform',                         price: 5.00 },
  { id: 'support',    name: 'Support & Helpdesk',      desc: 'Onbeperkt tickets, on/offboarding, direct contact met een technicus', tier: 'Do-IT managed support',                    price: 12.50 },
];

const INTERNAL_IT_COST = 4500; // Gemiddelde kosten interne ICT'er per maand (incl. werkgeverslasten)

const ADDON_CATEGORIES = [
  {
    title: 'Software',
    items: [
      { name: 'Security Awareness Training', price: '+\u20AC2,50/gebruiker/mnd' },
      { name: 'Microsoft Copilot', price: '+\u20AC30/gebruiker/mnd' },
      { name: 'Exclaimer Signatures', price: '+\u20AC1,50/gebruiker/mnd' },
    ],
  },
  {
    title: 'Hardware as a Service',
    items: [
      { name: 'Managed Firewall (UniFi)', price: '\u20AC75/mnd' },
      { name: 'Netwerk Switch', price: '\u20AC35/mnd' },
      { name: 'WiFi Access Point', price: '\u20AC15/mnd' },
      { name: 'Backup NAS', price: '\u20AC65/mnd' },
    ],
  },
  {
    title: 'Cloud & Backup',
    items: [
      { name: 'Cloud Backup (M365)', price: '\u20AC2/gebruiker/mnd' },
      { name: 'Disaster Recovery Plan', price: 'vanaf \u20AC150/mnd' },
      { name: 'Extra OneDrive opslag (1TB)', price: '+\u20AC5/gebruiker/mnd' },
    ],
  },
  {
    title: 'Compliance & Advies',
    items: [
      { name: 'AVG/GDPR Audit', price: '\u20AC500 eenmalig' },
      { name: 'Darkweb Monitoring', price: '+\u20AC3/gebruiker/mnd' },
      { name: 'Beveiligingsrapportage', price: '\u20AC75/mnd' },
    ],
  },
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
  const [activePost, setActivePost] = useState(null);
  const [calcChecks, setCalcChecks] = useState({ mailbox: true, apps: true, security: true, rmm: true, support: true });
  const [userCount, setUserCount] = useState(5);
  const [billingYearly, setBillingYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [optionsTab, setOptionsTab] = useState('addons');
  const [themeIndex, setThemeIndex] = useState(0);
  const [showError, setShowError] = useState(false);

  const currentTheme = THEMES[themeIndex];
  const cycleTheme = () => setThemeIndex((i) => (i + 1) % THEMES.length);
  const cycleThemeBack = () => setThemeIndex((i) => (i - 1 + THEMES.length) % THEMES.length);

  useEffect(() => { const t = setInterval(() => setClock(new Date()), 30000); return () => clearInterval(t); }, []);

  const time = clock.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  const date = clock.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const go = (id) => { setPage(id); setStartOpen(false); };
  const cur = NAV.find((n) => n.id === page);
  const chg = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const toggleCalc = (id) => setCalcChecks((p) => ({ ...p, [id]: !p[id] }));

  const pricePerUser = CALC_OPTIONS.reduce((sum, o) => sum + (calcChecks[o.id] ? o.price : 0), 0);
  const monthlyPrice = pricePerUser * Math.min(userCount, 50);
  const yearlyDiscount = 0.10;
  const effectiveMonthly = billingYearly ? monthlyPrice * (1 - yearlyDiscount) : monthlyPrice;

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

  const PARTNER_LOGOS = [
    { src: import.meta.env.BASE_URL + 'partners-microsoft.png', alt: 'Microsoft' },
    { src: import.meta.env.BASE_URL + 'partners-fortinet.png', alt: 'Fortinet' },
    { src: import.meta.env.BASE_URL + 'partners-ubiquiti.png', alt: 'Ubiquiti' },
    { src: import.meta.env.BASE_URL + 'partners-dropsuite.png', alt: 'Dropsuite' },
  ];

  const Home = () => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, order: 2 }}>
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

      <PartnersBar>
        <div className="partners-title">Samenwerking met</div>
        <PartnersRow>
          {PARTNER_LOGOS.map((p) => <img key={p.alt} src={p.src} alt={p.alt} />)}
        </PartnersRow>
        <PartnersMarquee>
          <MarqueeTrack>
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => <img key={i} src={p.src} alt={p.alt} />)}
          </MarqueeTrack>
        </PartnersMarquee>
      </PartnersBar>
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
          </SubItemRow>
        ))}
        <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
          <Button size="sm" primary onClick={() => go('contact')}>{'\u{1F4E8}'} Offerte aanvragen</Button>
          <Button size="sm" onClick={() => go('prijzen')}>{'\u{1F4B0}'} Prijscalculator</Button>
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

  const Prijzen = () => {
    const savings = Math.max(0, INTERNAL_IT_COST - effectiveMonthly);
    const savingsPct = INTERNAL_IT_COST > 0 ? Math.round((savings / INTERNAL_IT_COST) * 100) : 0;

    return (
      <div>
        <PrijzenLayout>
          {/* ---- LEFT: Value Calculator ---- */}
          <PrijzenLeft label="Value Calculator">
            <UserCountRow>
              <span className="user-label">Users:</span>
              <Button size="sm" square style={{ minWidth: 22, minHeight: 22 }} onClick={() => setUserCount(Math.max(1, userCount - 1))} disabled={userCount <= 1}>&lt;</Button>
              <UserInput type="number" min="1" max="50" value={userCount} onChange={(e) => { const v = Math.max(1, Math.min(50, Number(e.target.value) || 1)); setUserCount(v); }} />
              <Button size="sm" square style={{ minWidth: 22, minHeight: 22 }} onClick={() => setUserCount(Math.min(50, userCount + 1))} disabled={userCount >= 50}>&gt;</Button>
            </UserCountRow>

            {/* Comparison table */}
            <CompareTable>
              <CompareRow>
                <span className="cmp-label">Interne ICT{'\u2019'}er inhuren</span>
                <span className="cmp-value">{'\u20AC'}{INTERNAL_IT_COST.toLocaleString('nl-NL')}/mnd</span>
              </CompareRow>
              <CompareRow>
                <span className="cmp-label">Do-IT Solutions</span>
                <span className="cmp-value">{'\u20AC'}{effectiveMonthly.toFixed(0)}/mnd</span>
              </CompareRow>
            </CompareTable>

            {/* Savings box */}
            <SavingsBox>
              <SavingsRow>
                <span className="sav-label">U bespaart</span>
                <span className="sav-green">{'\u20AC'}{savings.toFixed(0)}/mnd</span>
              </SavingsRow>
              <SavingsRow>
                <span className="sav-label">Jaarlijkse besparing</span>
                <span className="sav-green">{'\u20AC'}{(savings * 12).toLocaleString('nl-NL', { maximumFractionDigits: 0 })}/jr</span>
              </SavingsRow>
              <SavingsRow>
                <span className="sav-label">vs inhuren</span>
                <span className="sav-green">{savingsPct}% minder</span>
              </SavingsRow>
            </SavingsBox>

            {/* Progress bar */}
            <ProgressBar>
              <ProgressFill $pct={savingsPct}>{savingsPct}%</ProgressFill>
            </ProgressBar>

            {/* Base rate info */}
            <BaseRateNote>
              Basisprijs {'\u2014'} {'\u20AC'}{pricePerUser.toFixed(2)}/gebruiker/mnd<br />
              {billingYearly && <span style={{ color: 'green', fontWeight: 'bold' }}>Jaarlijks betalen: 10% korting!<br /></span>}
              {userCount} gebruiker{userCount !== 1 ? 's' : ''} {'\u00D7'} {'\u20AC'}{pricePerUser.toFixed(2)} = <strong>{'\u20AC'}{effectiveMonthly.toFixed(2)}/mnd</strong>
            </BaseRateNote>

            {/* Included checkboxes */}
            <CheckList>
              {CALC_OPTIONS.map((o) => (
                <CheckItem key={o.id}>
                  <Checkbox
                    checked={calcChecks[o.id]}
                    onChange={() => toggleCalc(o.id)}
                    label=""
                    style={{ marginRight: -6 }}
                  />
                  <span>{o.name}</span>
                </CheckItem>
              ))}
              <div style={{ marginTop: 6 }}>
                <CheckItem>
                  <Checkbox checked={billingYearly} onChange={() => setBillingYearly(!billingYearly)} label="" style={{ marginRight: -6 }} />
                  <span>Jaarlijks betalen (-10%)</span>
                </CheckItem>
              </div>
            </CheckList>
          </PrijzenLeft>

          {/* ---- RIGHT: Options ---- */}
          <PrijzenRight label="Opties">
            <TabRow>
              <Tab $active={optionsTab === 'addons'} onClick={() => setOptionsTab('addons')}>Add-ons</Tab>
              <Tab $active={optionsTab === 'faq'} onClick={() => setOptionsTab('faq')}>FAQ</Tab>
              <Tab $active={optionsTab === 'start'} onClick={() => setOptionsTab('start')}>Offerte</Tab>
            </TabRow>
            <TabContent>
              {optionsTab === 'addons' && ADDON_CATEGORIES.map((cat) => (
                <OptCategory key={cat.title}>
                  <div className="opt-cat-title">{cat.title}</div>
                  {cat.items.map((item) => (
                    <OptRow key={item.name}>
                      <span className="opt-name">{item.name}</span>
                      <span className="opt-price">{item.price}</span>
                    </OptRow>
                  ))}
                </OptCategory>
              ))}

              {optionsTab === 'faq' && (
                <>
                  <FaqItem>
                    <div className="faq-q" onClick={() => setOpenFaq(openFaq === 'contract' ? null : 'contract')}>{openFaq === 'contract' ? '\u25BC' : '\u25B6'} Langlopend contract?</div>
                    {openFaq === 'contract' && <div className="faq-a">Nee! <strong>Maandelijks opzegbaar</strong>. Jaarlijks betalen = 10% korting.</div>}
                  </FaqItem>
                  <FaqItem>
                    <div className="faq-q" onClick={() => setOpenFaq(openFaq === 'minimum' ? null : 'minimum')}>{openFaq === 'minimum' ? '\u25BC' : '\u25B6'} Minimum gebruikers?</div>
                    {openFaq === 'minimum' && <div className="faq-a">Nee, minimum is <strong>1 gebruiker</strong>. 50+ = maatwerk offerte.</div>}
                  </FaqItem>
                  <FaqItem>
                    <div className="faq-q" onClick={() => setOpenFaq(openFaq === 'licenties' ? null : 'licenties')}>{openFaq === 'licenties' ? '\u25BC' : '\u25B6'} Licenties inbegrepen?</div>
                    {openFaq === 'licenties' && <div className="faq-a">Ja. Prijzen zijn <strong>inclusief Microsoft licenties</strong>. E{'\u00E9'}n factuur, wij regelen alles.</div>}
                  </FaqItem>
                  <FaqItem>
                    <div className="faq-q" onClick={() => setOpenFaq(openFaq === 'opzeggen' ? null : 'opzeggen')}>{openFaq === 'opzeggen' ? '\u25BC' : '\u25B6'} Hoe werkt opzeggen?</div>
                    {openFaq === 'opzeggen' && <div className="faq-a"><strong>Per maand</strong>, 1 maand opzegtermijn. Wij helpen met overdracht.</div>}
                  </FaqItem>
                  <FaqItem>
                    <div className="faq-q" onClick={() => setOpenFaq(openFaq === 'wat' ? null : 'wat')}>{openFaq === 'wat' ? '\u25BC' : '\u25B6'} Niet alles nodig?</div>
                    {openFaq === 'wat' && <div className="faq-a">U kiest zelf. Alleen mailbox nodig? Dan betaalt u alleen mailbox. Geen verplichte pakketten.</div>}
                  </FaqItem>
                </>
              )}

              {optionsTab === 'start' && (
                <div>
                  <p style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
                    Uw configuratie: <strong>{userCount} gebruiker{userCount !== 1 ? 's' : ''}</strong> voor <strong>{'\u20AC'}{effectiveMonthly.toFixed(2)}/mnd</strong>
                    {billingYearly ? ' (jaarlijks)' : ' (maandelijks)'}.
                  </p>
                  <p style={{ fontSize: 11, color: '#555', lineHeight: 1.5, marginBottom: 12 }}>
                    Inclusief: {CALC_OPTIONS.filter(o => calcChecks[o.id]).map(o => o.name).join(', ') || 'geen services geselecteerd'}.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Button primary onClick={() => go('contact')}>{'\u{1F4E8}'} Offerte aanvragen</Button>
                    <Button onClick={() => window.open(WA_LINK + '?text=Hallo%20Do-IT!%20Ik%20wil%20graag%20een%20offerte%20voor%20' + userCount + '%20gebruikers.', '_blank')}>{'\u{1F4AC}'} WhatsApp</Button>
                  </div>
                  {userCount >= 50 && (
                    <Panel variant="well" style={{ padding: 8, marginTop: 10, background: '#ffffcc' }}>
                      <p style={{ fontSize: 11, margin: 0, fontWeight: 'bold', color: '#000080' }}>{'\u{1F4DE}'} 50+ gebruikers? Bel of mail voor maatwerk!</p>
                    </Panel>
                  )}
                </div>
              )}
            </TabContent>
          </PrijzenRight>
        </PrijzenLayout>
      </div>
    );
  };

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

  const Blog = () => {
    if (activePost) {
      const post = posts.find((p) => p.slug === activePost);
      if (!post) { setActivePost(null); return null; }
      const html = marked.parse(post.content.trim());
      const wordCount = post.content.trim().split(/\s+/).length;
      const lineCount = post.content.trim().split('\n').length;
      return (
        <NotepadWrap>
          <NotepadMenuBar>
            <NotepadMenuItem onClick={() => setActivePost(null)}>{'< Terug'}</NotepadMenuItem>
            <NotepadMenuItem>Bestand</NotepadMenuItem>
            <NotepadMenuItem>Bewerken</NotepadMenuItem>
            <NotepadMenuItem>Opmaak</NotepadMenuItem>
            <NotepadMenuItem>Help</NotepadMenuItem>
          </NotepadMenuBar>
          <NotepadBody>
            <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: 11, color: '#888' }}>{post.date} {'\u2022'} {post.author}</div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 6 }}>
              <Button size="sm" onClick={() => setActivePost(null)}>{'\u{1F4DD}'} Alle posts</Button>
              <Button size="sm" primary onClick={() => go('contact')}>{'\u{1F4E8}'} Contact</Button>
            </div>
          </NotepadBody>
          <NotepadStatusBar>
            <span>{post.title}.txt</span>
            <span>{wordCount} woorden {'\u2022'} {lineCount} regels</span>
          </NotepadStatusBar>
        </NotepadWrap>
      );
    }

    return (
      <NotepadWrap>
        <NotepadMenuBar>
          <NotepadMenuItem>Bestand</NotepadMenuItem>
          <NotepadMenuItem>Bewerken</NotepadMenuItem>
          <NotepadMenuItem>Beeld</NotepadMenuItem>
          <NotepadMenuItem>Help</NotepadMenuItem>
        </NotepadMenuBar>
        <div style={{ background: '#fff', flex: 1 }}>
          {posts.map((post, i) => (
            <BlogListItem key={post.slug} $alt={i % 2 === 1} onClick={() => setActivePost(post.slug)}>
              <span className="blog-icon">{'\u{1F4C4}'}</span>
              <div>
                <div className="blog-title">{post.title}</div>
                <div className="blog-date">{post.date} {'\u2022'} {post.author}</div>
                <div className="blog-summary">{post.summary}</div>
              </div>
            </BlogListItem>
          ))}
        </div>
        <NotepadStatusBar>
          <span>C:\Do-IT\Blog\</span>
          <span>{posts.length} bericht{posts.length !== 1 ? 'en' : ''}</span>
        </NotepadStatusBar>
      </NotepadWrap>
    );
  };

  const pages = { home: Home, diensten: Diensten, waarom: Waarom, prijzen: Prijzen, blog: Blog, contact: Contact };
  const PageComponent = pages[page];

  return (
    <ThemeProvider theme={currentTheme.theme}>
    <>
      <Desktop $bg={currentTheme.desktop} onClick={() => startOpen && setStartOpen(false)}>
        <MainWindow>
          <StyledWindowHeader>
            <HeaderTitle>{cur.icon} {cur.winTitle}</HeaderTitle>
            <HeaderButtons>
              <Button size="sm" square onClick={cycleThemeBack} title="Vorig thema"><span style={{ fontSize: 10 }}>{'\u2014'}</span></Button>
              <Button size="sm" square onClick={cycleTheme} title={`Thema: ${currentTheme.name}`}><span style={{ fontSize: 10 }}>{'\u25A1'}</span></Button>
              <Button size="sm" square onClick={() => setShowError(true)}><CloseIcon /></Button>
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

        {showError && (
          <ErrorOverlay onClick={() => setShowError(false)}>
            <ErrorWindow onClick={(e) => e.stopPropagation()}>
              <ErrorHeader>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{'\u26A0\uFE0F'} Do-IT Solutions</span>
                <Button size="sm" square onClick={() => setShowError(false)} style={{ minWidth: 20, minHeight: 20 }}>
                  <CloseIcon />
                </Button>
              </ErrorHeader>
              <ErrorBody>
                <ErrorIcon>{'\u274C'}</ErrorIcon>
                <ErrorText>
                  <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>
                    Deze applicatie kan niet worden afgesloten.
                  </p>
                  <p style={{ margin: '0 0 8px' }}>
                    Er is een onherstelbare fout opgetreden in <strong>explorer.exe</strong>.
                    Het systeem is afhankelijk van Do-IT Solutions om correct te functioneren.
                  </p>
                  <p style={{ margin: '0 0 4px' }}>
                    Neem{' '}
                    <ErrorLink onClick={() => { setShowError(false); go('contact'); }}>
                      contact op met de IT-beheerder
                    </ErrorLink>
                    {' '}als dit probleem zich blijft voordoen.
                  </p>
                  <p style={{ margin: '8px 0 0', fontSize: 10, color: '#888' }}>
                    Foutcode: 0x0044_4F49_5421 | Module: doitsolutions.dll
                  </p>
                </ErrorText>
              </ErrorBody>
              <ErrorActions>
                <Button onClick={() => setShowError(false)} style={{ minWidth: 90 }}>OK</Button>
                <Button onClick={() => { setShowError(false); go('contact'); }} style={{ minWidth: 90 }} primary>
                  {'\u{1F4E7}'} Contact IT
                </Button>
              </ErrorActions>
            </ErrorWindow>
          </ErrorOverlay>
        )}
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
    </ThemeProvider>
  );
}
