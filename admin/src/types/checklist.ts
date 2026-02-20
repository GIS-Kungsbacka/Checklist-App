export interface Checklist {
  gid: number;
  arendenummerArtvise?: string;
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
  arendenummerArtvise?: string;
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
  arendenummerArtvise?: string;
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
