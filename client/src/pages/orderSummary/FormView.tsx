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
import { useOrderById } from "../../hooks/useOrders";
import type { OrderSummary } from "../../types/orderSummary";
import jsPDF from "jspdf";
import { getPrioritetChipColor } from "./orderSummary-data-grid";
import { useAuth } from "../../hooks/useAuth";

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

export default function FormView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [linkCopied, setLinkCopied] = React.useState(false);

  const orderId = id ? id : "";
  const { data: item, isLoading, error } = useOrderById(orderId);
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
            Beställningsspecifikationen hittades inte.
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

  const displayKeys = Object.keys(fieldLabels) as (keyof typeof item)[];

  const checklistKeys: (keyof typeof item)[] = [
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

  const orderSummaryKeys = displayKeys.filter(
    (key) => !checklistKeys.includes(key)
  );

  const renderField = (key: keyof typeof item) => {
    const label = fieldLabels[key];
    if (label === undefined) return null;

    const value = item[key];
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
              {item.arendenummerArtvise ||
                `Beställning ${item.arendenummerArtvise}`}
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
                  onClick={() => generatePDF(item, fieldLabels)}
                  color="primary"
                  sx={{ ml: 1 }}
                >
                  <Download />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2 }}
            flexWrap="wrap"
            useFlexGap
          >
            {item.kategori && (
              <Chip
                label={item.kategori}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {item.prioritet && (
              <Chip
                color={getPrioritetChipColor(item.prioritet)}
                label={item.prioritet}
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
            {orderSummaryKeys.map((key) => renderField(key))}
          </Grid>
          <Divider sx={{ my: 2, mt: 4 }} />
          <Typography
            variant="body1"
            sx={{ mt: 3, mb: 2, fontSize: 17, fontWeight: 600 }}
          >
            Checklista
          </Typography>

          <Grid container spacing={2}>
            {checklistKeys.map((key) => renderField(key))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
