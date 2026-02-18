export interface BestallaUppdragFrageformular {
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
  handlaggare?: string;
}

export interface CreateBestallaUppdragFrageformularDto {
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

export interface UpdateBestallaUppdragFrageformularDto {
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
