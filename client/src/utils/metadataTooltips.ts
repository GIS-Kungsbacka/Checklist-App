import type { Metadata } from "../types/metadata";
import type { MetadataTechDescription } from "../types/metadataTechDescription";

/** Field-level help texts shown next to metadata labels in FormView. */
export const metadataFieldTooltips: Partial<Record<keyof Metadata, string>> = {
  arendeNummerOpenE: "Ärendenummer (OpenE)",
  bestallareNamn: "Tjänsteperson som har beställt datamängden.",
  bestallareEpost: "E-postadress till beställaren.",
  sakerhetsKlass:
    "Skydd mot att information röjs eller sprids till obehöriga.",
  dataKallaTyp:
    "Anger om datamängden härstammar från en förvaltning, extern organisation eller ett system.",
  schemaNamn: "Namn på det databasschema där datamängden lagras.",
  namn: "Datamängdens namn.",
  beskrivning: "Beskrivning av datamängdens innehåll.",
  ursprung:
    "Anger datamängdens ursprung eller källor som informationen baseras på.",
  nyckelOrd:
    "Nyckelord som underlättar sökning, kategorisering och förståelse av datamängden.",
  kategori: "Kategori som datamängden tillhör",
  syfte:
    "Beskriver varför datamängden samlas in, lagras och förvaltas samt vilket verksamhetsbehov den ska uppfylla.",
  metod:
    "Beskriver hur datamängden har tagits fram, samlats in eller bearbetats.",
  metodUrl:
    "Länk till dokumentation, skript eller webbsida som beskriver metodiken bakom datamängden.",
  projekt:
    "Projekt som datamängden är kopplad till eller har tagits fram inom.",
  geografiskBegransning:
    "Anger vilket geografiskt område datamängden omfattar.",
  uppdateringsFrekvens: "Anger hur ofta datamängden uppdateras.",
  fullstandighet:
    "Beskriver i vilken utsträckning datamängden täcker det avsedda innehållet inom den geografiska begränsningen.",
  skalniva:
    "Anger den detaljnivå eller skala som datamängden är avsedd att användas på. Datamängden bör inte användas för analyser eller presentationer på mer detaljerad nivå än den angivna.",
  tidsperiod:
    "Anger om datamängden endast är aktuell under en viss tidsperiod.",
  tidsperiodStartdatum:
    "Startdatum för den tidsperiod som datamängden beskriver.",
  tidsperiodSlutdatum:
    "Slutdatum för den tidsperiod som datamängden beskriver.",
  tidsUpplosning:
    "Anger den tidsmässiga detaljnivån, exempelvis dag, månad eller år.",
  skapelseDatum: "Datum då datamängden ursprungligen skapades.",
  anvandarBegransningLicens:
    "Anger om användningen av datamängden omfattas av begränsningar eller licensvillkor.",
  anvandarBegransningLicensText:
    "Vilken licens datamängden omfattas av som påverkar användningsbegränsningar eller licensvillkor.",
  relateradeResurser:
    "Referenser till relaterade datamängder, dokument eller informationsresurser.",
  kolumnBeskrivningUrl:
    "Länk till dokumentation som beskriver datamängdens attribut och kolumner.",
  handlaggare: "Handläggare på Geodataenheten som för datamängden.",
  metaDataVersion:
    "Metadataspecifikationens version (löpnummer från och med 1.0).",
  metadataSpecifikationModelversion:
    "Metadataspecifikationens version (löpnummer från och med 1.0).",
  sakerhetsklassRiktighet:
    "Skydd mot att information förändras, förstörs eller blir felaktig.",
  sakerhetsklassTillganglighet:
    "Skydd mot att information eller tjänster inte är tillgängliga när de behövs.",
};

/** Tooltips for fields not yet shown on the metadata form (kept for reuse). */
export const metadataAuditFieldTooltips = {
  skapad: "När metadataspecifikationen skapades.",
  skapadAv: "Vem/Vad som skapade metadataspecifikationen.",
  andrad: "När metadataspecifikationen senast ändrades.",
  andradAv: "Vem/Vad som som senast ändrade metadataspecifikationen.",
} as const;

/**
 * Optional tooltips for metadata section headers.
 * Only sections with a defined text get a help icon.
 */
export const metadataSectionTooltips: Record<string, string> = {
  "Grundläggande identitet":
    "Identifierande uppgifter om datamängden, schema och version.",
  "Beskrivning och syfte":
    "Beskrivning av innehåll, syfte, kategori, nyckelord och projektkoppling.",
  "Ursprung och datakälla":
    "Uppgifter om ursprung, metod och metoddokumentation.",
  "Geografisk detaljnivå":
    "Geografisk omfattning och skalbegränsning för datamängden.",
  Tidsinformation:
    "Tidsperiod, skapelsedatum och tidsupplösning för datamängden.",
  "Kvalitet och uppdatering":
    "Uppdateringsfrekvens och bedömning av fullständighet.",
  "Åtkomst och användarbegränsningar":
    "Licensbegränsningar och licenstyp som styr användning.",
  Säkerhetsklassning:
    "Klassning av konfidentialitet, riktighet och tillgänglighet.",
  "Teknisk beskrivning":
    "Tekniska egenskaper för geometri och koordinatsystem.",
  Övrigt: "Övriga relaterade resurser och information.",
  Ärendeuppgifter:
    "Beställare, handläggare, ärendenummer och dokumentationslänkar.",
};

/** Optional tooltips for tech-description fields (shown when provided). */
export const metadataTechDescriptionTooltips: Partial<
  Record<keyof MetadataTechDescription, string>
> = {
  datatype: "Datatyp för geometrikolumnen.",
  srid: "Spatialt referenssystem (SRID) för datamängden.",
  geometryDimension: "Geometrins dimension (t.ex. 2 eller 3).",
  geometryType: "Geometrityp (t.ex. POINT, POLYGON, MULTIPOLYGON).",
  geometryColumn: "Namn på kolumnen som innehåller geometrin.",
};
