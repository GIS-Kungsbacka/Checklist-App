export interface OrderSummary {
  arendenummerArtvise: string;
  arendenummerOpenE?: string;
  bestallareEpost?: string;
  bestallareOrganisation?: string;
  bestallareTjanstetitel?: string;
  datumInkommet?: string; // ISO date "YYYY-MM-DD"
  beskrivning?: string;
  nytta?: string;
  sistaDatum?: string;
  forankradChef: boolean;
  kansligInformation: boolean;
  kansligInformationBeskrivning?: string;
  dataunderlag?: string;
  dataadministrator?: string;
  malgrupper?: string;
  nyttjandeInterntExternt?: string;
  leverans?: string;
  leveransArbetstimmar?: string;
  kategori?: string;
  kategoriTyp?: string;
  prioritet?: string;
  antagenJaNej?: string;
  antagenJaNejMotivering?: string;
  handlaggare?: string;
}
