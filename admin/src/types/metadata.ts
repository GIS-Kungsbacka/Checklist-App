export interface Metadata {
  gid: number;
  sakerhetsKlassDokument?: string;
  arendeNummer?: string;
  bestallareNamn?: string;
  bestallareEpost?: string;
  sakerhetsKlass?: string;
  dataKallaTyp?: string;
  schema?: string;
  namn?: string;
  beskrivning?: string;
  syfte?: string;
  datakalla?: string[];
  metod?: string;
  projekt?: string;
  geografiskBegransning?: string[];
  uppdateringsFrekvens?: string;
  fullstandighet?: string;
  skalnivå?: string;
  nyckelOrd?: string[];
  kategori?: string;
  tidsperiod?: boolean;
  tidsperiodStartdatum?: string;
  tidsperiodSlutdatum?: string;
  tidsUpplosning?: string;
  skapelseDatum?: string;
  anvandarBegransningLicens?: boolean;
  anvandarBegransningLicensText?: string;
  relateradeResurser?: string[];
  status?: string;
  handlaggare?: string;
  metaDataVersion?: string;
  skapadTidPunkt?: string;
}

export type CreateMetadataDto = Omit<Metadata, "gid">;
export type UpdateMetadataDto = Omit<Metadata, "gid">;
