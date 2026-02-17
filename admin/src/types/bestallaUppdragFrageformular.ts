export interface BestallaUppdragFrageformular {
  gid: number;
  arendernummer?: string;
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
  arendernummer?: string;
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
  arendernummer?: string;
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
