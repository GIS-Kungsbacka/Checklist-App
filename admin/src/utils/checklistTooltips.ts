import type { CreateChecklistDto } from "../types/checklist";

/** Field-level help texts for checklist create/edit forms. */
export const checklistFieldTooltips: Partial<
  Record<keyof CreateChecklistDto, string>
> = {
  arendenummerArtvise:
    "Ärendenummer (Artvise). Välj från beställningsunderlag. Används som unik identifierare i listan.",
  dataunderlag:
    "Vilket underlag som används (t.ex. beställningsunderlag, datakälla).",
  dataadministrator: "Vem som ansvarar för dataadministration/hantering.",
  malgrupper: "Vilka målgrupper som nyttjar resultatet.",
  nyttjandeInterntExternt: "Om nyttjandet är internt och/eller externt.",
  leverans: "Vad som ska levereras (t.ex. tjänst, lager, fil, rapport).",
  leveransArbetstimmar: "Uppskattad arbetsinsats i timmar för leveransen.",
  kategori: "Kategori för ärendet.",
  kategoriTyp: "Typ av kategori: ny eller förändring.",
  prioritet: "Prioritet: Hög/Medel/Låg.",
  antagenJaNej:
    "Om posten är antagen. Värdet 'nej' skickar automatiskt objektet till idébanken.",
  antagenJaNejMotivering: "Motivering till 'Antagen' (särskilt vid 'nej').",
  handlaggare: "Ansvarig handläggare.",
  tabell: "Information om tabell(er) som berörs.",
  wms: "Information om WMS-publicering/åtkomst.",
  fme: "Information om FME-script/app eller koppling till FME.",
  redigering: "Hur redigering ska ske (process/verktyg/åtkomst).",
  kopiering: "Om kopiering är tillåten/aktuell för data.",
  information: "Övrig viktig information som behövs för hantering/leverans.",
  kommentar: "Interna kommentarer/anteckningar.",
  levererad:
    "Om leveransen är klar. Kryssrutan 'Levererad' skickar automatiskt objektet till Avslutad.",
  verksamhetskritiskData:
    "Om data bedöms vara verksamhetskritisk (beskrivning/klassning).",
};
