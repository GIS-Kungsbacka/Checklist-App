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
} from "@mui/material";
import { ArrowBack, Download, Link } from "@mui/icons-material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useOrderById } from "../hooks/useOrders";
import type { OrderSummary } from "../types/orderSummary";
import { useMetadata } from "../hooks/useMetadata";
import type { Metadata } from "../types/metadata";
import { useManagementPlan } from "../hooks/useManagementPlan";
import type { ManagementPlan } from "../types/management-plan";
import jsPDF from "jspdf";
import { getPrioritetChipColor } from "./orderSummary/orderSummary-data-grid";
import { useAuth } from "../hooks/useAuth";

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

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Ja" : "Nej";
  return String(value);
}

function generatePDF(item: OrderSummary, fieldLabels: Record<string, string>) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * (fontSize * 0.4) + 5;

    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Title
  const title = item.arendenummerArtvise || "Beställningsspecifikation";
  addText(title, 18, true);
  yPosition += 5;

  // Add chips info if available
  const chipsInfo: string[] = [];
  if (item.kategori) chipsInfo.push(`Kategori: ${item.kategori}`);
  if (item.prioritet) chipsInfo.push(`Prioritet: ${item.prioritet}`);
  if (chipsInfo.length > 0) {
    addText(chipsInfo.join(" | "), 12);
    yPosition += 5;
  }

  yPosition += 5;

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
    (key) => !checklistKeys.includes(key)
  );

  addText("Beställningsunderlag", 14, true);
  yPosition += 3;

  orderSummaryKeys.forEach((key) => {
    const label = fieldLabels[key];
    if (label) {
      const value = formatValue(item[key]);
      addText(`${label}: ${value}`, 11);
    }
  });

  yPosition += 5;
  addText("Checklista", 14, true);
  yPosition += 3;

  checklistKeys.forEach((key) => {
    const label = fieldLabels[key];
    if (label) {
      const value = formatValue(item[key]);
      addText(`${label}: ${value}`, 11);
    }
  });

  // Generate filename
  const filename = `${title.replace(/[^a-z0-9]/gi, "_")}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;

  // Save the PDF
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

export default function FormView({ entity }: { entity: FormEntity }) {
  const { arendeNummer, schemaKey } = useParams<{
    arendeNummer?: string;
    schemaKey?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [linkCopied, setLinkCopied] = React.useState(false);

  const decodedSchemaKey = schemaKey ? decodeURIComponent(schemaKey) : "";
  const { schemaNamn, namn } = parseSchemaKey(schemaKey);

  const norm = (s: string | undefined) => (s ?? "").trim().toLowerCase();
  const gidCandidate = Number(decodedSchemaKey);
  const decodedNorm = norm(decodedSchemaKey);

  const orderQuery = useOrderById(arendeNummer ?? "");
  const metadataListQuery = useMetadata();
  const managementPlanListQuery = useManagementPlan();

  const activeQuery =
    entity === "metadata"
      ? metadataListQuery
      : entity === "managementplan"
      ? managementPlanListQuery
      : orderQuery;

  const isLoading = activeQuery.isLoading;
  const error = activeQuery.error;

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
        (x) => (x as { gid?: number }).gid === gidCandidate
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
    if (byComputedKey) return byComputedKey as unknown as Metadata | ManagementPlan;

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

  const isOrderSummary = entity === "checklist";

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
        (key) => !checklistKeys.includes(key)
      )
    : [];

  const renderField = (key: string) => {
    const label = isOrderSummary && key in fieldLabels ? fieldLabels[key] : key;

    const value = (item as unknown as Record<string, unknown>)[key];
    const display = formatValue(value);

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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {isAdmin && (
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
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
                ? `Metadata ${String((item as Metadata).gid)}`
                : entity === "managementplan"
                ? `Förvaltningsplan ${String((item as ManagementPlan).gid)}`
                : (item as OrderSummary).arendenummerArtvise ||
                  `Checklist ${(item as OrderSummary).arendenummerArtvise}`}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                  sx={{ ml: 2 }}
                >
                  {linkCopied ? <CheckCircleOutlinedIcon /> : <Link />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Ladda ner som PDF">
                <IconButton
                  onClick={() => {
                    if (entity !== "checklist") return;
                    generatePDF(item as OrderSummary, fieldLabels);
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
                      (item as OrderSummary).prioritet
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
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={2}>
                {displayKeys.map((key) => renderField(String(key)))}
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
