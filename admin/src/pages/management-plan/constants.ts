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

export const MANAGEMENT_PLAN_FORM_FIELDS = [
  ["namn", "Namn"],
  ["titel", "Titel"],
  ["bestallareNamn", "Beställare namn"],
  ["bestallareEpost", "Beställare e-post"],
  ["sakerhetsklass", "Säkerhetsklass"],
  ["datakallaTyp", "Datakälla typ"],
  ["schemaNamn", "Schema"],
  ["dataAgare", "Dataägare"],
  ["dataForvaltare", "Dataförvaltare"],
  ["dataAdministrator", "Dataadministratör"],
  ["dataKonsument", "Datakonsument"],
  ["redigeringsKalla", "Redigeringskälla"],
  ["arkivering", "Arkivering"],
  ["arkiveringTidpunkt", "Arkivering tidpunkt"],
  ["publicerad", "Publicerad"],
  ["atkomst", "Åtkomst"],
  ["integration", "Integration"],
  ["status", "Status"],
  ["handlaggare", "Handläggare"],
  ["ovrigInformation", "Övrig information"],
] as const;
