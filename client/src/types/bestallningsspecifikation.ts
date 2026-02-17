export interface Bestallningsspecifikation {
  bestallningGid: number;
  arendenummer?: string;
  bestallareOrganisation?: string;
  bestallareTjanstetitel?: string;
  datumInkommet?: string; // ISO date "YYYY-MM-DD"
  beskrivning?: string;
  nytta?: string;
  sistaDatum?: string;
  forankradChef: boolean;
  kansligInformation: boolean;
  frageformularGid?: number;
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
}
