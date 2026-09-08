export const GRID_PREFS_STORAGE_KEY = "management-plan-default-prefs-dev-admin";

export const STATUS_OPTIONS = ["granskas", "godkänd"] as const;

export const REDIGERINGS_KALLA_OPTIONS = [
  "Kartportalen",
  "TopoDirekt",
  "MerginMaps",
  "QGIS",
  "FME",
  "MyCarta",
  "Lager ska ej redigeras",
] as const;

export const defaultColumnVisibility = {
  gid: true,
  namn: true,
  arendeNummberOpenE: true,
  bestallareNamn: true,
  bestallareEpost: false,
  sakerhetsklass: false,
  datakallaTyp: false,
  schemaNamn: true,
  titel: true,
  dataAgare: false,
  dataForvaltare: false,
  dataAdministrator: false,
  dataKonsument: false,
  redigeringsKalla: false,
  oppnaData: false,
  dokumentSkUrl: false,
  dokuementInfoUrl: false,
  ovrigInformation: false,
  kritiskDatamangd: false,
  arkivering: false,
  arkiveringTidpunkt: false,
  publicerad: false,
  publiceradOppnaData: false,
  atkomst: false,
  integration: false,
  status: true,
  handlaggare: false,
  forvaltningsplanVersion: false,
  forvaltningsplanModelversion: false,
  skapadTidPunkt: true,
  skapadAv: false,
  andradTidPunkt: false,
  andradAv: false,
  actions: true,
};

export type ManagementPlanFormState = {
  bestallareNamn: string;
  bestallareEpost: string;
  sakerhetsklass: string;
  datakallaTyp: string;
  schemaNamn: string;
  namn: string;
  titel: string;
  dataAgare: string;
  dataForvaltare: string;
  dataAdministrator: string;
  dataKonsument: string;
  redigeringsKalla: string;
  oppnaData: boolean;
  ovrigInformation: string;
  kritiskDatamangd: boolean;
  arkivering: string;
  arkiveringTidpunkt: string;
  publicerad: string;
  publiceradOppnaData: boolean;
  atkomst: string;
  integration: string;
  status: string;
  handlaggare: string;
};

export const emptyForm: ManagementPlanFormState = {
  bestallareNamn: "",
  bestallareEpost: "",
  sakerhetsklass: "",
  datakallaTyp: "",
  schemaNamn: "",
  namn: "",
  titel: "",
  dataAgare: "",
  dataForvaltare: "",
  dataAdministrator: "",
  dataKonsument: "",
  redigeringsKalla: "",
  oppnaData: false,
  ovrigInformation: "",
  kritiskDatamangd: false,
  arkivering: "",
  arkiveringTidpunkt: "",
  publicerad: "",
  publiceradOppnaData: false,
  atkomst: "",
  integration: "",
  status: "",
  handlaggare: "",
};

export const MANAGEMENT_PLAN_FORM_SECTIONS = [
  {
    title: "Grundläggande identitet",
    fields: [
      ["titel", "Titel"],
      ["namn", "Namn"],
      ["schemaNamn", "Schema"],
      ["datakallaTyp", "Datakälla typ"],
      ["sakerhetsklass", "Säkerhetsklass"],
    ],
  },
  {
    title: "Ansvar och roller",
    fields: [
      ["dataAgare", "Dataägare"],
      ["dataForvaltare", "Dataförvaltare"],
      ["dataAdministrator", "Dataadministratör"],
      ["dataKonsument", "Datakonsument"],
    ],
  },
  {
    title: "Publicering och åtkomst",
    fields: [
      ["redigeringsKalla", "Redigeringskälla"],
      ["publicerad", "Publicerad"],
      ["atkomst", "Åtkomst"],
      ["integration", "Integration"],
      ["oppnaData", "Önskemål om öppna data"],
      ["publiceradOppnaData", "Publicerad öppna data"],
      ["kritiskDatamangd", "Kritisk datamängd"],
    ],
  },
  {
    title: "Livscykel och arkivering",
    fields: [
      ["arkivering", "Arkivering"],
      ["arkiveringTidpunkt", "Arkivering tidpunkt"],
    ],
  },
  {
    title: "Övrig information",
    fields: [["ovrigInformation", "Övrig information"]],
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
