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
  parioritet?: string;
  antagenJaNej?: string;
  antagenJaNejMotivering?: string;
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
  parioritet?: string;
  antagenJaNej?: string;
  antagenJaNejMotivering?: string;
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
  parioritet?: string;
  antagenJaNej?: string;
  antagenJaNejMotivering?: string;
}
