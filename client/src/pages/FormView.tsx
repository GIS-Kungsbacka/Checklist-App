import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useOrderById } from "../hooks/useOrders";
import { getPrioritetChipColor } from "./FormsList";

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
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Ja" : "Nej";
  return String(value);
}

export default function FormView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const orderId = id ? id : "";
  const { data: item, isLoading, error } = useOrderById(orderId);

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
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Tillbaka till listan
          </Button>
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
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Tillbaka till listan
          </Button>
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
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
        >
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
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
      >
        Tillbaka till listan
      </Button>

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={600}
            >
              {item.arendenummerArtvise ||
                `Beställning ${item.arendenummerArtvise}`}
            </Typography>
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
            
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body1" sx={{ mt: 2, mb:2, fontSize: 17, fontWeight: 600 }}>
              Beställningsunderlag
            </Typography>
          

          <Grid container spacing={2}>
            {orderSummaryKeys.map((key) => renderField(key))}
          </Grid>
          <Divider sx={{ my: 2, mt:4 }} />
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
