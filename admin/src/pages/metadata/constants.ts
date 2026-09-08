export const GRID_PREFS_STORAGE_KEY = "metadata-default-prefs-dev-admin";

export const STATUS_OPTIONS = ["granskas", "godkänd"] as const;

export const FULLSTANDIGHET_OPTIONS = [
  "Fullständig",
  "Delvis fullständig",
  "Ofullständig",
  "Okänt",
] as const;

export const KATEGORI_OPTIONS = [
  "Administrativa gränser",
  "Arealtäckande bilder och bakgrundskartor",
  "Areella näringar",
  "Atmosfär, klimatologi och meteorologi",
  "Biologi och ekologi",
  "Byggnader och byggnadskonstruktioner",
  "Ekonomi",
  "Fastigheter och fysisk planering",
  "Försvar",
  "Geovetenskap",
  "Hälsa",
  "Höjddata",
  "Kust och hav",
  "Miljö",
  "Positionering",
  "Samhälle och kultur",
  "Sjöar och vattendrag",
  "Tekniska försörjningssystem",
  "Transporter",
] as const;

export const GEOGRAFISK_TYP_OPTIONS = [
  "Kungsbacka kommun",
  "Kungsbacka tätort",
  "Hela landet",
  "Annat",
] as const;

export const TATORT_OPTIONS = [
  "Buerås",
  "Dala",
  "Fjärås kyrkby",
  "Fjärås station",
  "Frillesås",
  "Halla Heberg",
  "Hjälm",
  "Kläppa",
  "Kungsbacka stad",
  "Onsala",
  "Röda holme",
  "Vallda",
  "Västa Hagen",
  "Västa Hanhals",
  "Åsa",
  "Östra Hanhals och Torkelstorp",
] as const;

export const TATORT_OPTION_SET = new Set<string>(TATORT_OPTIONS);

export const UPPDATERINGS_FREKVENS_OPTIONS = [
  "Årligen",
  "Kvartalsvis",
  "Månadsvis",
  "Veckovis",
  "Dagligen",
  "Vid behov",
  "Uppdateras ej",
  "Annat",
] as const;

export const UPPDATERINGS_FREKVENS_OPTION_SET = new Set<string>(
  UPPDATERINGS_FREKVENS_OPTIONS,
);

export const TIDS_UPPLOSNING_OPTIONS = [
  "Kontinuerlig förvaltning av data",
  "Sekund",
  "Minut",
  "Timme",
  "Dag",
  "Månad",
  "År",
  "Vet ej",
] as const;

export const TIDS_UPPLOSNING_OPTION_SET = new Set<string>(
  TIDS_UPPLOSNING_OPTIONS,
);

export const defaultColumnVisibility = {
  gid: true,
  namn: true,
  arendeNummerOpenE: true,
  bestallareNamn: true,
  bestallareEpost: false,
  titel: true,
  sakerhetsKlass: false,
  sakerhetsklassRiktighet: false,
  sakerhetsklassTillganglighet: false,
  dataKallaTyp: false,
  schemaNamn: true,
  beskrivning: false,
  ursprung: false,
  syfte: false,
  metod: false,
  metodUrl: false,
  projekt: false,
  geografiskBegransning: false,
  uppdateringsFrekvens: false,
  fullstandighet: false,
  skalniva: false,
  nyckelOrd: false,
  kategori: true,
  tidsperiod: false,
  tidsperiodStartdatum: false,
  tidsperiodSlutdatum: false,
  tidsUpplosning: false,
  skapelseDatum: false,
  anvandarBegransningLicens: false,
  anvandarBegransningLicensText: false,
  relateradeResurser: false,
  kolumnBeskrivningUrl: false,
  status: true,
  handlaggare: false,
  metaDataVersion: false,
  metadataSpecifikationModelversion: false,
  actions: true,
};

export type MetadataFormState = {
  bestallareNamn: string;
  bestallareEpost: string;
  sakerhetsKlass: string;
  sakerhetsklassRiktighet: string;
  sakerhetsklassTillganglighet: string;
  dataKallaTyp: string;
  schemaNamn: string;
  namn: string;
  beskrivning: string;
  ursprung: string;
  syfte: string;
  metod: string;
  metodUrl: string;
  projekt: string;
  geografiskBegransningTyp: string;
  geografiskBegransningTatorter: string[];
  geografiskBegransningAnnat: string;
  uppdateringsFrekvens: string;
  uppdateringsFrekvensAnnat: string;
  fullstandighet: string;
  skalniva: string;
  nyckelOrd: string;
  kategori: string;
  tidsperiod: boolean;
  tidsperiodStartdatum: string;
  tidsperiodSlutdatum: string;
  tidsUpplosning: string;
  tidsUpplosningAnnat: string;
  skapelseDatum: string;
  anvandarBegransningLicens: boolean;
  anvandarBegransningLicensText: string;
  relateradeResurser: string;
  status: string;
  handlaggare: string;
};

export const emptyForm: MetadataFormState = {
  bestallareNamn: "",
  bestallareEpost: "",
  sakerhetsKlass: "",
  sakerhetsklassRiktighet: "",
  sakerhetsklassTillganglighet: "",
  dataKallaTyp: "",
  schemaNamn: "",
  namn: "",
  beskrivning: "",
  ursprung: "",
  syfte: "",
  metod: "",
  metodUrl: "",
  projekt: "",
  geografiskBegransningTyp: "",
  geografiskBegransningTatorter: [],
  geografiskBegransningAnnat: "",
  uppdateringsFrekvens: "",
  uppdateringsFrekvensAnnat: "",
  fullstandighet: "",
  skalniva: "",
  nyckelOrd: "",
  kategori: "",
  tidsperiod: false,
  tidsperiodStartdatum: "",
  tidsperiodSlutdatum: "",
  tidsUpplosning: "",
  tidsUpplosningAnnat: "",
  skapelseDatum: "",
  anvandarBegransningLicens: false,
  anvandarBegransningLicensText: "",
  relateradeResurser: "",
  status: "",
  handlaggare: "",
};

export const METADATA_FORM_SECTIONS = [
  {
    title: "Grundläggande identitet",
    fields: [
      ["namn", "Namn"],
      ["schemaNamn", "Schema"],
      ["dataKallaTyp", "Datakälla typ"],
    ],
  },
  {
    title: "Beskrivning och syfte",
    fields: [
      ["kategori", "Kategori"],
      ["nyckelOrd", "Nyckelord"],
      ["projekt", "Projekt"],
      ["beskrivning", "Beskrivning"],
      ["syfte", "Syfte"],
    ],
  },
  {
    title: "Ursprung och datakälla",
    fields: [
      ["ursprung", "Ursprung"],
      ["metodUrl", "Metod URL"],
      ["metod", "Metod"],
    ],
  },
  {
    title: "Geografisk detaljnivå",
    fields: [
      ["geografiskBegransning", "Geografisk begränsning"],
      ["skalniva", "Skalniva"],
    ],
  },
  {
    title: "Tidsinformation",
    fields: [
      ["tidsperiodDatum", "Tidsperiod"],
      ["skapelseDatum", "Skapelsedatum"],
      ["tidsUpplosning", "Tidsupplösning"],
      ["tidsperiod", "Tidsperiod"],
    ],
  },
  {
    title: "Kvalitet och uppdatering",
    fields: [
      ["uppdateringsFrekvens", "Uppdateringsfrekvens"],
      ["fullstandighet", "Fullständighet"],
    ],
  },
  {
    title: "Åtkomst och användarbegränsningar",
    fields: [
      ["anvandarBegransningLicens", "Användarbegränsning licens"],
      ["anvandarBegransningLicensText", "Användarbegränsning licens text"],
    ],
  },
  {
    title: "Säkerhetsklassning",
    fields: [
      ["sakerhetsKlass", "Konfidentialitet"],
      ["sakerhetsklassRiktighet", "Riktighet"],
      ["sakerhetsklassTillganglighet", "Tillgänglighet"],
    ],
  },
  {
    title: "Övrigt",
    fields: [["relateradeResurser", "Relaterade resurser"]],
  },
  {
    title: "Ärendeuppgifter",
    fields: [
      ["bestallareNamn", "Beställare namn"],
      ["bestallareEpost", "Beställare e-post"],
      ["handlaggare", "Handläggare"],
      ["status", "Status"],
    ],
  },
] as const;
