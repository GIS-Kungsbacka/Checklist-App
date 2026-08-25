import * as React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Stack,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  Download,
  Link,
  OpenInNew,
  TableView,
} from "@mui/icons-material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useOrderById } from "../hooks/useOrders";
import type { OrderSummary } from "../types/orderSummary";
import {
  useMetadata,
  useMetadataColumnDescription,
  useMetadataTechDescription,
} from "../hooks/useMetadata";
import type { Metadata } from "../types/metadata";
import type { MetadataTechDescription } from "../types/metadataTechDescription";
import { useManagementPlan } from "../hooks/useManagementPlan";
import type { ManagementPlan } from "../types/management-plan";
import jsPDF from "jspdf";
import { getPrioritetChipColor } from "./orderSummary/orderSummary-data-grid";
import { useAuth } from "../hooks/useAuth";
import { statusChipColor } from "../utils/status-chip";
import { FieldHelpIcon } from "../components/FieldHelpIcon";
import {
  metadataFieldTooltips,
  metadataSectionTooltips,
  metadataTechDescriptionTooltips,
} from "../utils/metadataTooltips";
import {
  managementPlanFieldTooltips,
  managementPlanSectionTooltips,
} from "../utils/managementPlanTooltips";

const fieldLabels: Record<string, string> = {
  arendenummerArtvise: "Ärendenummer",
  arendenummerOpenE: "Ärendenummer OpenE",
  bestallareEpost: "Beställare e-post",
  bestallareOrganisation: "Beställare organisation",
  bestallareTjanstetitel: "Beställare tjänstetitel",
  datumInkommet: "Datum inkommet",
  beskrivning: "Beskrivning",
  nytta: "Nytta",
  sistaDatum: "Sista datum",
  forankradChef: "Förankrad chef",
  kansligInformation: "Känslig information",
  kansligInformationBeskrivning: "Känslig information beskrivning",
  dataunderlag: "Dataunderlag",
  dataadministrator: "Dataadministratör",
  malgrupper: "Målgrupper",
  nyttjandeInterntExternt: "Nyttjande internt/externt",
  leverans: "Leverans",
  leveransArbetstimmar: "Leverans (arbetstimmar)",
  kategori: "Kategori",
  kategoriTyp: "Kategori typ",
  prioritet: "Prioritet",
  antagenJaNej: "Antagen ja/nej",
  antagenJaNejMotivering: "Antagen ja/nej motivering",
  handlaggare: "Handläggare",
  tabell: "Tabell",
  wms: "WMS",
  fme: "FME",
  redigering: "Redigering",
  kopiering: "Kopiering",
  information: "Information",
  verksamhetsKritiskData: "Verksamhetskritisk data",
  kommentar: "Kommentar",
  levererad: "Levererad",
};

const metadataFieldLabels: Partial<Record<keyof Metadata, string>> = {
  namn: "Namn",
  schemaNamn: "Schema",
  beskrivning: "Beskrivning",
  ursprung: "Ursprung",
  syfte: "Syfte",
  kategori: "Kategori",
  status: "Status",
  handlaggare: "Handläggare",
  arendeNummerOpenE: "Ärendenummer (OpenE)",
  bestallareNamn: "Beställare",
  bestallareEpost: "Beställare E-post",
  sakerhetsKlass: "Konfidentialitet",
  sakerhetsklassRiktighet: "Riktighet",
  sakerhetsklassTillganglighet: "Tillgänglighet",
  dataKallaTyp: "Typ av datakälla",
  metod: "Metod",
  metodUrl: "Metodbeskrivning (URL)",
  projekt: "Projekt",
  geografiskBegransning: "Geografisk begränsning",
  uppdateringsFrekvens: "Uppdateringsfrekvens",
  fullstandighet: "Fullständighet",
  skalniva: "Skalbegränsning",
  nyckelOrd: "Nyckelord",
  tidsperiod: "Tidsperiod",
  tidsperiodStartdatum: "Tidsperiod, startdatum",
  tidsperiodSlutdatum: "Tidsperiod, slutdatum",
  tidsUpplosning: "Tidsupplösning",
  skapelseDatum: "Skapelsedatum",
  anvandarBegransningLicens: "Licensbegränsning",
  anvandarBegransningLicensText: "Licenstyp",
  relateradeResurser: "Relaterade resurser",
  kolumnBeskrivningUrl: "Kolumnbeskrivning URL",
  metaDataVersion: "Version",
};

type MetadataSection =
  | {
      title: string;
      keys: (keyof Metadata)[];
      fullWidthKeys?: (keyof Metadata)[];
      techDescription?: false;
    }
  | {
      title: "Teknisk beskrivning";
      techDescription: true;
    };

const metadataSections: MetadataSection[] = [
  {
    title: "Grundläggande identitet",
    keys: ["namn", "schemaNamn", "dataKallaTyp", "metaDataVersion"],
  },
  {
    title: "Beskrivning och syfte",
    keys: ["beskrivning", "syfte", "kategori", "nyckelOrd", "projekt"],
    fullWidthKeys: ["beskrivning", "syfte"],
  },
  {
    title: "Ursprung och datakälla",
    keys: ["ursprung", "metod", "metodUrl"],
    fullWidthKeys: ["ursprung"],
  },
  {
    title: "Geografisk detaljnivå",
    keys: ["geografiskBegransning", "skalniva"],
  },
  {
    title: "Tidsinformation",
    keys: [
      "tidsperiod",
      "tidsperiodStartdatum",
      "tidsperiodSlutdatum",
      "skapelseDatum",
      "tidsUpplosning",
    ],
  },
  {
    title: "Kvalitet och uppdatering",
    keys: ["uppdateringsFrekvens", "fullstandighet"],
  },
  {
    title: "Åtkomst och användarbegränsningar",
    keys: ["anvandarBegransningLicens", "anvandarBegransningLicensText"],
  },
  {
    title: "Säkerhetsklassning",
    keys: [
      "sakerhetsKlass",
      "sakerhetsklassRiktighet",
      "sakerhetsklassTillganglighet",
    ],
  },
  {
    title: "Teknisk beskrivning",
    techDescription: true,
  },
  {
    title: "Övrigt",
    keys: ["relateradeResurser"],
  },
  {
    title: "Ärendeuppgifter",
    keys: [
      "bestallareNamn",
      "bestallareEpost",
      "handlaggare",
      "arendeNummerOpenE",
      "kolumnBeskrivningUrl",
    ],
  },
];

const metadataTechDescriptionFieldLabels: Partial<
  Record<keyof MetadataTechDescription, string>
> = {
  datatype: "Datatyp",
  srid: "Srid",
  geometryDimension: "Geometri dimension",
  geometryType: "Geometri typ",
  geometryColumn: "Geometri kolumn",
};

const metadataTechDescriptionKeys: (keyof MetadataTechDescription)[] = [
  "datatype",
  "srid",
  "geometryDimension",
  "geometryType",
  "geometryColumn",
];

const managementPlanFieldLabels: Partial<Record<keyof ManagementPlan, string>> =
  {
    namn: "Namn",
    titel: "Titel",
    schemaNamn: "Schema",
    handlaggare: "Handläggare",
    arendeNummberOpenE: "Ärendenummer (OpenE)",
    bestallareNamn: "Beställare",
    bestallareEpost: "Beställare E-post",
    datakallaTyp: "Typ av datakälla",
    dataAgare: "Geodataägare",
    dataForvaltare: "Geodataförvaltare",
    dataAdministrator: "Geodataadministratör",
    dataKonsument: "Datakonsument",
    redigeringsKalla: "Redigeringskälla",
    oppnaData: "Önskas publiceras som öppna data",
    publiceradOppnaData: "Publicerad som öppna data",
    dokumentSkUrl: "Dokument Informationsklassning",
    ovrigInformation: "Övrig information",
    kritiskDatamangd: "Kritisk datamängd",
    arkivering: "Arkiveras/Gallras",
    arkiveringTidpunkt: "Tidpunkt för Arkivering/Gallring",
    forvaltningsplanVersion: "Version",
    skapadTidPunkt: "Skapad",
    skapadAv: "Skapad av",
    andradTidPunkt: "Ändrad",
    andradAv: "Ändrad av",
  };

const managementPlanSections: Array<{
  title: string;
  keys: (keyof ManagementPlan)[];
}> = [
  {
    title: "Grundläggande identitet",
    keys: [
      "titel",
      "namn",
      "schemaNamn",
      "datakallaTyp",
      "forvaltningsplanVersion",
    ],
  },
  {
    title: "Ansvar och roller",
    keys: ["dataAgare", "dataForvaltare", "dataAdministrator", "dataKonsument"],
  },
  {
    title: "Publicering och åtkomst",
    keys: [
      "oppnaData",
      "publiceradOppnaData",
      "redigeringsKalla",
      "kritiskDatamangd",
    ],
  },
  {
    title: "Livscykel och arkivering",
    keys: ["arkivering", "arkiveringTidpunkt"],
  },
  {
    title: "Övrig information",
    keys: ["ovrigInformation"],
  },
  {
    title: "Ärendeuppgifter",
    keys: [
      "bestallareNamn",
      "bestallareEpost",
      "handlaggare",
      "arendeNummberOpenE",
      "dokumentSkUrl",
      "skapadTidPunkt",
      "skapadAv",
      "andradTidPunkt",
      "andradAv",
    ],
  },
];

function formatDateOnly(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];

    const date = new Date(trimmed);
    if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
    return undefined;
  }

  if (typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
    return undefined;
  }

  if (value instanceof Date) {
    if (!Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
    return undefined;
  }

  return undefined;
}

function formatValue(value: unknown, key?: string): string {
  if (value === null || value === undefined) return "-";
  if (key === "skapadTidPunkt" || key === "andradTidPunkt") {
    return formatDateOnly(value) ?? "-";
  }
  if (typeof value === "boolean") return value ? "Ja" : "Nej";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || "-";
  return String(value);
}

function sanitizeFilenamePart(input: string): string {
  const cleaned = input.trim().replace(/[^a-z0-9\-_]+/gi, "_");
  return cleaned.replace(/^_+|_+$/g, "") || "export";
}

function createPdfTextWriter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  const ensurePageSpace = () => {
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  const addText = (text: string, fontSize: number, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * (fontSize * 0.4) + 5;
    ensurePageSpace();
  };

  const addSpacer = (height = 5) => {
    yPosition += height;
    ensurePageSpace();
  };

  return { addText, addSpacer };
}

function generateChecklistPDF(
  item: OrderSummary,
  fieldLabels: Record<string, string>,
) {
  const doc = new jsPDF();
  const { addText, addSpacer } = createPdfTextWriter(doc);

  // Title
  const title = item.arendenummerArtvise || "Beställningsspecifikation";
  addText(title, 18, true);
  addSpacer(5);

  // Add chips info if available
  const chipsInfo: string[] = [];
  if (item.kategori) chipsInfo.push(`Kategori: ${item.kategori}`);
  if (item.prioritet) chipsInfo.push(`Prioritet: ${item.prioritet}`);
  if (chipsInfo.length > 0) {
    addText(chipsInfo.join(" | "), 12);
    addSpacer(5);
  }

  addSpacer(5);

  // Beställningsunderlag section
  const checklistKeys: (keyof OrderSummary)[] = [
    "dataunderlag",
    "dataadministrator",
    "malgrupper",
    "nyttjandeInterntExternt",
    "leverans",
    "leveransArbetstimmar",
    "kategori",
    "kategoriTyp",
    "prioritet",
    "antagenJaNej",
    "antagenJaNejMotivering",
    "handlaggare",
    "tabell",
    "wms",
    "fme",
    "redigering",
    "kopiering",
    "information",
    "verksamhetsKritiskData",
    "kommentar",
    "levererad",
  ];

  const displayKeys = Object.keys(fieldLabels) as (keyof OrderSummary)[];
  const orderSummaryKeys = displayKeys.filter(
    (key) => !checklistKeys.includes(key),
  );

  addText("Beställningsunderlag", 14, true);
  addSpacer(3);

  orderSummaryKeys.forEach((key) => {
    const label = fieldLabels[key];
    if (label) {
      const value = formatValue(item[key]);
      addText(`${label}: ${value}`, 11);
    }
  });

  addSpacer(5);
  addText("Checklista", 14, true);
  addSpacer(3);

  checklistKeys.forEach((key) => {
    const label = fieldLabels[key];
    if (label) {
      const value = formatValue(item[key]);
      addText(`${label}: ${value}`, 11);
    }
  });

  // Generate filename
  const filename = `${sanitizeFilenamePart(title)}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;

  // Save the PDF
  doc.save(filename);
}

function generateMetadataPDF(
  metadata: Metadata,
  techDescription?: MetadataTechDescription,
) {
  const doc = new jsPDF();
  const { addText, addSpacer } = createPdfTextWriter(doc);

  const title =
    (metadata.namn ?? "").trim() || `Metadata ${String(metadata.gid)}`;
  addText(title, 18, true);
  addSpacer(5);

  const chipsInfo: string[] = [];
  if (metadata.kategori)
    chipsInfo.push(`Kategori: ${String(metadata.kategori)}`);
  if (metadata.status) chipsInfo.push(`Status: ${String(metadata.status)}`);
  if (chipsInfo.length > 0) {
    addText(chipsInfo.join(" | "), 12);
    addSpacer(5);
  }

  for (const section of metadataSections) {
    addText(section.title, 14, true);
    addSpacer(3);

    if (section.techDescription) {
      for (const key of metadataTechDescriptionKeys) {
        const label = metadataTechDescriptionFieldLabels[key] ?? String(key);
        const value = formatValue(techDescription?.[key], String(key));
        addText(`${label}: ${value}`, 11);
      }
    } else {
      for (const key of section.keys) {
        const label = metadataFieldLabels[key] ?? String(key);
        const value = formatValue(metadata[key], String(key));
        addText(`${label}: ${value}`, 11);
      }
    }

    addSpacer(5);
  }

  const keySuffix =
    `${(metadata.schemaNamn ?? "").trim()}_${(metadata.namn ?? "").trim()}`.trim() ||
    title;
  const filename = `${sanitizeFilenamePart(keySuffix)}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(filename);
}

function generateManagementPlanPDF(plan: ManagementPlan) {
  const doc = new jsPDF();
  const { addText, addSpacer } = createPdfTextWriter(doc);

  const title =
    (plan.titel ?? plan.namn ?? "").trim() ||
    `Förvaltningsplan ${String(plan.gid)}`;
  addText(title, 18, true);
  addSpacer(5);

  const chipsInfo: string[] = [];
  if (plan.status) chipsInfo.push(`Status: ${String(plan.status)}`);
  if (chipsInfo.length > 0) {
    addText(chipsInfo.join(" | "), 12);
    addSpacer(5);
  }

  for (const section of managementPlanSections) {
    addText(section.title, 14, true);
    addSpacer(3);

    for (const key of section.keys) {
      const label = managementPlanFieldLabels[key] ?? String(key);
      const value = formatValue(plan[key], String(key));
      addText(`${label}: ${value}`, 11);
    }

    addSpacer(5);
  }

  const keySuffix =
    `${(plan.schemaNamn ?? "").trim()}_${(plan.namn ?? "").trim()}`.trim() ||
    title;
  const filename = `${sanitizeFilenamePart(keySuffix)}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(filename);
}

type FormEntity = "checklist" | "metadata" | "managementplan";

function parseSchemaKey(schemaKey: string | undefined): {
  schemaNamn?: string;
  namn?: string;
} {
  if (!schemaKey) return {};
  const decoded = decodeURIComponent(schemaKey);
  const idx = decoded.lastIndexOf("_");
  if (idx === -1) return { namn: decoded };
  return {
    schemaNamn: decoded.slice(0, idx),
    namn: decoded.slice(idx + 1),
  };
}

type PublicConfig = {
  metadataCatalogUrl?: string;
  managementCatalogUrl?: string;
};

export default function FormView({ entity }: { entity: FormEntity }) {
  const { arendeNummer, schemaKey } = useParams<{
    arendeNummer?: string;
    schemaKey?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [columnDialogOpen, setColumnDialogOpen] = React.useState(false);
  const [publicConfig, setPublicConfig] = React.useState<PublicConfig | null>(
    null,
  );

  const decodedSchemaKey = schemaKey ? decodeURIComponent(schemaKey) : "";
  const { schemaNamn, namn } = parseSchemaKey(schemaKey);

  const norm = (s: string | undefined) => (s ?? "").trim().toLowerCase();
  const gidCandidate = Number(decodedSchemaKey);
  const decodedNorm = norm(decodedSchemaKey);

  const orderQuery = useOrderById(arendeNummer ?? "");
  const metadataListQuery = useMetadata();
  const metadataColumnDescriptionsQuery = useMetadataColumnDescription({
    enabled: columnDialogOpen && entity === "metadata",
  });
  const metadataTechDescriptionsQuery = useMetadataTechDescription({
    enabled: entity === "metadata",
  });
  const managementPlanListQuery = useManagementPlan();

  const activeQuery =
    entity === "metadata"
      ? metadataListQuery
      : entity === "managementplan"
        ? managementPlanListQuery
        : orderQuery;

  const isLoading = activeQuery.isLoading;
  const error = activeQuery.error;

  React.useEffect(() => {
    let cancelled = false;
    const url = `${import.meta.env.BASE_URL ?? "/"}config.json`;

    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled) return;
        setPublicConfig((json ?? {}) as PublicConfig);
      })
      .catch(() => {
        if (cancelled) return;
        setPublicConfig({});
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const item = React.useMemo<
    OrderSummary | Metadata | ManagementPlan | undefined
  >(() => {
    if (entity === "checklist") return orderQuery.data;

    const list =
      entity === "metadata"
        ? (metadataListQuery.data ?? [])
        : (managementPlanListQuery.data ?? []);

    if (!schemaKey) return undefined;

    if (Number.isFinite(gidCandidate)) {
      const byGid = list.find(
        (x) => (x as { gid?: number }).gid === gidCandidate,
      );
      if (byGid) return byGid as unknown as Metadata | ManagementPlan;
    }

    const byComputedKey = list.find((x) => {
      const rec = x as { schemaNamn?: string; namn?: string };
      const s = norm(rec.schemaNamn);
      const n = norm(rec.namn);
      if (s && n) return `${s}_${n}` === decodedNorm;
      return n === decodedNorm || s === decodedNorm;
    });
    if (byComputedKey)
      return byComputedKey as unknown as Metadata | ManagementPlan;

    const match = list.find((x) => {
      const rec = x as { schemaNamn?: string; namn?: string };
      if (schemaNamn && namn) {
        return (
          norm(rec.schemaNamn) === norm(schemaNamn) &&
          norm(rec.namn) === norm(namn)
        );
      }
      const single = namn ?? schemaNamn;
      return norm(rec.namn) === norm(single);
    });

    return match as unknown as Metadata | ManagementPlan | undefined;
  }, [
    entity,
    orderQuery.data,
    metadataListQuery.data,
    managementPlanListQuery.data,
    schemaKey,
    schemaNamn,
    namn,
    gidCandidate,
    decodedNorm,
  ]);
  const { isAdmin } = useAuth();

  const openInNewUrl =
    entity === "metadata" || entity === "managementplan"
      ? (() => {
          const base =
            entity === "metadata"
              ? (publicConfig?.metadataCatalogUrl ?? "").trim()
              : (publicConfig?.managementCatalogUrl ?? "").trim();
          if (!base) return undefined;

          const schema = String(
            (item as { schemaNamn?: unknown } | undefined)?.schemaNamn ?? "",
          ).trim();
          const name = String(
            (item as { namn?: unknown } | undefined)?.namn ?? "",
          ).trim();
          if (!schema || !name) return undefined;

          const key = encodeURIComponent(`${schema}_${name}`);
          const baseTrimmed = base.replace(/\/+$/, "");
          return `${baseTrimmed}/${key}`;
        })()
      : undefined;

  const managementPlanHeaderByName = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const p of managementPlanListQuery.data ?? []) {
      const name = norm(p.namn);
      if (!name) continue;
      const title = (p.titel ?? p.namn ?? "").trim();
      if (!title) continue;
      if (!map.has(name)) map.set(name, title);
    }
    return map;
  }, [managementPlanListQuery.data]);

  const metadataHeaderTitle =
    entity === "metadata"
      ? (() => {
          const metadata = item as Metadata | undefined;
          const metadataName = norm(metadata?.namn);
          const managementPlanTitle = metadataName
            ? managementPlanHeaderByName.get(metadataName)
            : undefined;
          return (
            (managementPlanTitle ?? "").trim() ||
            (metadata?.namn ?? "").trim() ||
            (metadata ? `Metadata ${String(metadata.gid)}` : "Metadata")
          );
        })()
      : "";

  const backPath =
    entity === "metadata"
      ? "/metadata"
      : entity === "managementplan"
        ? "/forvaltningsplan"
        : "/";

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            {error instanceof Error
              ? error.message
              : "Kunde inte ladda beställningsspecifikationen. Försök igen senare."}
          </Alert>
          {isAdmin && (
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/")}
              sx={{ mt: 2 }}
            >
              Tillbaka till listan
            </Button>
          )}
        </Box>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            {entity === "metadata"
              ? "Metadata hittades inte."
              : entity === "managementplan"
                ? "Förvaltningsplanen hittades inte."
                : "Checklistan hittades inte."}
          </Alert>
          {isAdmin && (
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(backPath)}
              sx={{ mt: 2 }}
            >
              Tillbaka till listan
            </Button>
          )}
        </Box>
      </Container>
    );
  }

  const isOrderSummary = entity === "checklist";

  const modelVersionLabel =
    entity === "metadata"
      ? (item as Metadata).metadataSpecifikationModelversion
      : entity === "managementplan"
        ? (item as ManagementPlan).forvaltningsplanModelversion
        : undefined;

  const schemaNameLabel = (() => {
    if (entity !== "metadata" && entity !== "managementplan") return "";
    const schemaNamn = String(
      (item as Metadata | ManagementPlan).schemaNamn ?? "",
    ).trim();
    const namn = String((item as Metadata | ManagementPlan).namn ?? "").trim();
    if (schemaNamn && namn) return `${schemaNamn}:${namn}`;
    return schemaNamn || namn;
  })();

  const displayKeys = isOrderSummary
    ? (Object.keys(fieldLabels) as (keyof OrderSummary)[])
    : (Object.keys(item) as (keyof typeof item)[]);

  const checklistKeys: (keyof OrderSummary)[] = [
    "dataunderlag",
    "dataadministrator",
    "malgrupper",
    "nyttjandeInterntExternt",
    "leverans",
    "leveransArbetstimmar",
    "kategori",
    "kategoriTyp",
    "prioritet",
    "antagenJaNej",
    "antagenJaNejMotivering",
    "handlaggare",
    "tabell",
    "wms",
    "fme",
    "redigering",
    "kopiering",
    "information",
    "verksamhetsKritiskData",
    "kommentar",
    "levererad",
  ];

  const orderSummaryKeys = isOrderSummary
    ? (displayKeys as (keyof OrderSummary)[]).filter(
        (key) => !checklistKeys.includes(key),
      )
    : [];

  const renderField = (key: string) => {
    const label = isOrderSummary && key in fieldLabels ? fieldLabels[key] : key;

    const value = (item as unknown as Record<string, unknown>)[key];
    const display = formatValue(value, key);

    return (
      <Grid size={{ xs: 12, sm: 6 }} key={key}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
          {display || "-"}
        </Typography>
      </Grid>
    );
  };

  const renderMetadataField = (key: keyof Metadata, fullWidth = false) => {
    const label = metadataFieldLabels[key] ?? String(key);
    const value = (item as Metadata)?.[key];
    const display = formatValue(value, String(key));
    const tooltip = metadataFieldTooltips[key];

    return (
      <Grid size={{ xs: 12, sm: fullWidth ? 12 : 4 }} key={String(key)}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ fontWeight: 900 }}
        >
          {label}
          <FieldHelpIcon title={tooltip} />
        </Typography>
        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
          {display}
        </Typography>
      </Grid>
    );
  };

  const renderManagementPlanField = (key: keyof ManagementPlan) => {
    const label = managementPlanFieldLabels[key] ?? String(key);
    const value = (item as ManagementPlan)?.[key];
    const display = formatValue(value, String(key));
    const tooltip = managementPlanFieldTooltips[key];
    // Keep last word + icon together so the help icon doesn't wrap alone under the label.
    const glueHelpIconToLastWord = key === "oppnaData";
    const labelWords = glueHelpIconToLastWord ? label.split(" ") : null;
    const labelBeforeLast =
      labelWords && labelWords.length > 1
        ? `${labelWords.slice(0, -1).join(" ")} `
        : null;
    const labelLastWord = labelWords?.at(-1) ?? label;

    return (
      <Grid size={{ xs: 12, sm: 4 }} key={String(key)}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ fontWeight: 900 }}
        >
          {glueHelpIconToLastWord ? (
            <>
              {labelBeforeLast}
              <Box component="span" sx={{ whiteSpace: "nowrap" }}>
                {labelLastWord}
                <FieldHelpIcon title={tooltip} />
              </Box>
            </>
          ) : (
            <>
              {label}
              <FieldHelpIcon title={tooltip} />
            </>
          )}
        </Typography>
        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
          {display}
        </Typography>
      </Grid>
    );
  };

  const renderMetadataTechDescriptionField = (
    key: keyof MetadataTechDescription,
    techDescription?: MetadataTechDescription,
  ) => {
    const label = metadataTechDescriptionFieldLabels[key] ?? String(key);
    const value = techDescription?.[key];
    const display = formatValue(value, String(key));
    const tooltip = metadataTechDescriptionTooltips[key];

    return (
      <Grid size={{ xs: 12, sm: 4 }} key={String(key)}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ fontWeight: 900 }}
        >
          {label}
          <FieldHelpIcon title={tooltip} />
        </Typography>
        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
          {display}
        </Typography>
      </Grid>
    );
  };

  const columnDescriptionsForCurrentMetadata =
    entity === "metadata"
      ? (() => {
          const schemaNamn = ((item as Metadata).schemaNamn ?? "").trim();
          const namn = ((item as Metadata).namn ?? "").trim();
          const all = metadataColumnDescriptionsQuery.data ?? [];
          return all.filter(
            (x) =>
              (x.tableSchema ?? "").trim() === schemaNamn &&
              (x.tableName ?? "").trim() === namn,
          );
        })()
      : [];

  const techDescriptionForCurrentItem =
    entity === "metadata"
      ? (() => {
          const schemaNamn = ((item as Metadata).schemaNamn ?? "").trim();
          const namn = ((item as Metadata).namn ?? "").trim();
          return (metadataTechDescriptionsQuery.data ?? []).find(
            (x) =>
              (x.schema ?? "").trim() === schemaNamn &&
              (x.name ?? "").trim() === namn,
          );
        })()
      : undefined;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {isAdmin && (
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(backPath)}
          sx={{ mb: 3 }}
        >
          Tillbaka till listan
        </Button>
      )}
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={600}
            >
              {entity === "metadata"
                ? metadataHeaderTitle
                : entity === "managementplan"
                  ? (
                      (item as ManagementPlan).titel ??
                      (item as ManagementPlan).namn
                    )?.trim() ||
                    `Förvaltningsplan ${String((item as ManagementPlan).gid)}`
                  : (item as OrderSummary).arendenummerArtvise ||
                    `Checklist ${(item as OrderSummary).arendenummerArtvise}`}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {entity === "metadata" ? (
                <Tooltip title="Visa attributtabell">
                  <IconButton
                    onClick={() => {
                      setColumnDialogOpen(true);
                    }}
                    color="primary"
                  >
                    <TableView />
                  </IconButton>
                </Tooltip>
              ) : null}
              {entity === "metadata" || entity === "managementplan" ? (
                <Tooltip
                  title={
                    openInNewUrl
                      ? entity === "metadata"
                        ? "Öppna förvaltningsplan"
                        : "Öppna metadata"
                      : "Saknar konfiguration"
                  }
                >
                  <span>
                    <IconButton
                      onClick={() => {
                        if (!openInNewUrl) return;
                        window.location.href = openInNewUrl;
                      }}
                      disabled={!openInNewUrl}
                      color="primary"
                      sx={{ ml: 1 }}
                    >
                      <OpenInNew />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : null}
              <Tooltip
                title={linkCopied ? "Länk kopierad" : "Kopiera länk"}
                disableInteractive
              >
                <IconButton
                  onClick={async () => {
                    const url = `${window.location.origin}/FormApp/client${location.pathname}`;
                    try {
                      await navigator.clipboard.writeText(url);
                      setLinkCopied(true);
                      window.setTimeout(() => setLinkCopied(false), 3500);
                    } catch {
                      // ignore (clipboard might be blocked)
                    }
                  }}
                  color={linkCopied ? "primary" : "primary"}
                  sx={{ ml: 1 }}
                >
                  {linkCopied ? <CheckCircleOutlinedIcon /> : <Link />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Ladda ner som PDF">
                <IconButton
                  onClick={() => {
                    if (entity === "checklist") {
                      generateChecklistPDF(item as OrderSummary, fieldLabels);
                      return;
                    }
                    if (entity === "metadata") {
                      generateMetadataPDF(
                        item as Metadata,
                        techDescriptionForCurrentItem,
                      );
                      return;
                    }
                    generateManagementPlanPDF(item as ManagementPlan);
                  }}
                  color="primary"
                  sx={{ ml: 1 }}
                >
                  <Download />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          {isOrderSummary ? (
            <>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 2 }}
                flexWrap="wrap"
                useFlexGap
              >
                {(item as OrderSummary).kategori && (
                  <Chip
                    label={(item as OrderSummary).kategori}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {(item as OrderSummary).prioritet && (
                  <Chip
                    color={getPrioritetChipColor(
                      (item as OrderSummary).prioritet,
                    )}
                    label={(item as OrderSummary).prioritet}
                    size="small"
                  />
                )}
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Typography
                variant="body1"
                sx={{ mt: 2, mb: 2, fontSize: 17, fontWeight: 600 }}
              >
                Beställningsunderlag
              </Typography>

              <Grid container spacing={2}>
                {orderSummaryKeys.map((key) => renderField(String(key)))}
              </Grid>
              <Divider sx={{ my: 2, mt: 4 }} />
              <Typography
                variant="body1"
                sx={{ mt: 3, mb: 2, fontSize: 17, fontWeight: 600 }}
              >
                Checklista
              </Typography>

              <Grid container spacing={2}>
                {checklistKeys.map((key) => renderField(String(key)))}
              </Grid>
            </>
          ) : (
            <>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 2 }}
                flexWrap="wrap"
                useFlexGap
                alignItems="center"
              >
                {schemaNameLabel ? (
                  <Typography variant="body2" sx={{ fontSize: 18 }}>
                    {schemaNameLabel}
                  </Typography>
                ) : null}
                <Box
                  sx={{
                    ml: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {"status" in item && (item as any).status ? (
                    <Chip
                      label={(item as any).status}
                      size="small"
                      color={statusChipColor((item as any).status)}
                      variant="outlined"
                    />
                  ) : null}
                  {modelVersionLabel ? (
                    <Chip
                      label={modelVersionLabel}
                      size="small"
                      variant="outlined"
                    />
                  ) : null}
                </Box>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              {entity === "metadata" ? (
                <Box sx={{ mt: 1 }}>
                  {metadataSections.map((section) => (
                    <Box key={section.title} sx={{ mt: 5 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: 15, fontWeight: 800, mb: 1 }}
                      >
                        {section.title}
                        <FieldHelpIcon
                          title={metadataSectionTooltips[section.title]}
                        />
                      </Typography>
                      <Divider sx={{ mb: 1.5 }} />
                      <Grid container spacing={2}>
                        {section.techDescription
                          ? metadataTechDescriptionKeys.map((k) =>
                              renderMetadataTechDescriptionField(
                                k,
                                techDescriptionForCurrentItem,
                              ),
                            )
                          : section.keys.map((k) =>
                              renderMetadataField(
                                k,
                                section.fullWidthKeys?.includes(k) ?? false,
                              ),
                            )}
                      </Grid>
                    </Box>
                  ))}
                </Box>
              ) : entity === "managementplan" ? (
                <Box sx={{ mt: 1 }}>
                  {managementPlanSections.map((section) => (
                    <Box key={section.title} sx={{ mt: 5 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: 15, fontWeight: 800, mb: 1 }}
                      >
                        {section.title}
                        <FieldHelpIcon
                          title={managementPlanSectionTooltips[section.title]}
                        />
                      </Typography>
                      <Divider sx={{ mb: 1.5 }} />
                      <Grid container spacing={2}>
                        {section.keys.map((k) => renderManagementPlanField(k))}
                      </Grid>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {displayKeys.map((key) => renderField(String(key)))}
                </Grid>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={columnDialogOpen}
        onClose={() => setColumnDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Attributtabell</DialogTitle>
        <DialogContent dividers>
          {metadataColumnDescriptionsQuery.isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : metadataColumnDescriptionsQuery.error ? (
            <Alert severity="error">
              {metadataColumnDescriptionsQuery.error instanceof Error
                ? metadataColumnDescriptionsQuery.error.message
                : "Kunde inte ladda attributtabell."}
            </Alert>
          ) : columnDescriptionsForCurrentMetadata.length === 0 ? (
            <Alert severity="info">
              Inga attribut hittades för{" "}
              <strong>{(item as Metadata).schemaNamn}</strong> /{" "}
              <strong>{(item as Metadata).namn}</strong>.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Namn</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Titel</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Beskrivning</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {columnDescriptionsForCurrentMetadata.map((row) => (
                    <TableRow key={row.gid}>
                      <TableCell sx={{ fontFamily: "monospace" }}>
                        {row.columnName}
                      </TableCell>
                      <TableCell>{row.columnTitle}</TableCell>
                      <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                        {row.columnDescription}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColumnDialogOpen(false)}>Stäng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
