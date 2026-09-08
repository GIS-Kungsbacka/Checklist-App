import type { ManagementPlan } from "../types/managementPlan";

/** Field-level help texts shown next to management-plan labels (same as client FormView). */
export const managementPlanFieldTooltips: Partial<
  Record<keyof ManagementPlan, string>
> = {
  arendeNummberOpenE: "Ärendenummer för beställningen i OpenE.",
  bestallareNamn: "Tjänsteperson som har beställt datamängden.",
  bestallareEpost: "E-postadress till beställaren.",
  datakallaTyp:
    "Anger om datamängden härstammar från en förvaltning, extern organisation eller ett system.",
  schemaNamn: "Namn på det databasschema där datamängden lagras.",
  namn: "Datamängdens namn.",
  titel: "Datamängdens titel för användare och slutsystem.",
  dataAgare: "Chef som har det formella ansvaret för datamängden.",
  dataForvaltare:
    "Tjänsteperson med operativt ansvar för datamängdens förvaltning samt primär kontaktperson.",
  dataAdministrator:
    "Tjänsteperson som på delegation av geodataförvaltaren redigerar och uppdaterar datamängden.",
  dataKonsument:
    "Organisation, grupp, tjänst eller system som använder datamängden",
  redigeringsKalla:
    "Det system eller den applikation där datamängden uppdateras och underhålls.",
  oppnaData:
    "Anger om geodataförvaltaren önskar att datamängden publiceras som öppna data.",
  dokumentSkUrl:
    "Referens till dokumenterad informationsklassning för datamängden.",
  ovrigInformation:
    "Kompletterande information om datamängden eller dess förvaltning.",
  kritiskDatamangd: "Anger om datamängden bedöms vara verksamhetskritisk.",
  integration: "Integrationer till övriga system som nyttjar datamängden.",
  arkivering: "Anger om datamängden ska arkiveras eller gallras vid avslut.",
  arkiveringTidpunkt:
    "Planerat datum för arkivering eller gallring av datamängden. Om tidpunkt inte är fastställd skrivs detta vid behov.",
  publiceradOppnaData:
    "Anger om datamängden för närvarande är publicerad som öppna data.",
  handlaggare: "Handläggare på Geodataenheten för datamängden.",
  forvaltningsplanVersion:
    "Förvaltningsplanens version (löpnummer från och med 1.0).",
  forvaltningsplanModelversion:
    "Förvaltningsplanens version (löpnummer från och med 1.0).",
  skapadTidPunkt: "När förvaltningsplanen skapades.",
  skapadAv: "Vem/Vad som skapade förvaltningsplanen.",
  andradTidPunkt: "När förvaltningsplanen senast ändrades.",
  andradAv: "Vem/Vad som som senast ändrade förvaltningsplanen.",
};

/**
 * Optional tooltips for management-plan section headers.
 * Only sections with a defined text get a help icon.
 */
export const managementPlanSectionTooltips: Record<string, string> = {
  "Grundläggande identitet":
    "Identifierande uppgifter om datamängden, schema, datakälla och version.",
  "Ansvar och roller":
    "Geodataägare, förvaltare, administratör och konsumenter.",
  "Publicering och åtkomst":
    "Öppna data, redigeringskälla och verksamhetskritisk klassning.",
  "Livscykel och arkivering":
    "Uppgifter om arkivering eller gallring och planerad tidpunkt.",
  "Övrig information":
    "Kompletterande information om datamängden eller dess förvaltning.",
  Ärendeuppgifter:
    "Beställare, handläggare, ärendenummer, dokumentation och ändringshistorik.",
};
