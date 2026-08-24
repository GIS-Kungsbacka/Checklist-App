export interface ManagementPlan {
  gid: number;
  arendeNummberOpenE?: string;
  bestallareNamn?: string;
  bestallareEpost?: string;
  sakerhetsklass?: string;
  datakallaTyp?: string;
  schemaNamn?: string;
  namn?: string;
  titel?: string;
  dataAgare?: string;
  dataForvaltare?: string;
  dataAdministrator?: string[];
  dataKonsument?: string[];
  redigeringsKalla?: string[];
  oppnaData?: boolean;
  dokumentSkUrl?: string;
  dokuementInfoUrl?: string;
  ovrigInformation?: string;
  kritiskDatamangd?: boolean;
  arkivering?: string;
  arkiveringTidpunkt?: string;
  publicerad?: string[];
  publiceradOppnaData?: boolean;
  atkomst?: string[];
  integration?: string[];
  status?: string;
  handlaggare?: string;
  forvaltningsplanVersion?: string;
  skapadTidPunkt?: string;
  skapadAv?: string;
  andradTidPunkt?: string;
  andradAv?: string;
}

export type CreateManagementPlanDto = Omit<ManagementPlan, "gid">;
export type UpdateManagementPlanDto = Omit<ManagementPlan, "gid">;
