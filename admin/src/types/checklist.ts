export interface Checklist {
  gid: number;
  arendenummer?: string;
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

export interface CreateChecklistDto {
  arendenummer?: string;
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

export interface UpdateChecklistDto {
  arendenummer?: string;
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
