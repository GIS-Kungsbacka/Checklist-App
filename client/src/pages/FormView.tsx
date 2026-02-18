import { useQuery } from "@tanstack/react-query";
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
import { bestallningsspecifikationApi } from "../api/bestallningsspecifikationApi";

const fieldLabels: Record<string, string> = {
  bestallningGid: "Beställning GID",
  arendenummer: "Ärendenummer",
  bestallareEpost: "Beställare e-post",
  bestallareOrganisation: "Beställare organisation",
  bestallareTjanstetitel: "Beställare tjänstetitel",
  datumInkommet: "Datum inkommet",
  beskrivning: "Beskrivning",
  nytta: "Nytta",
  sistaDatum: "Sista datum",
  forankradChef: "Förankrad chef",
  kansligInformation: "Känslig information",
  frageformularGid: "Frågeformulär GID",
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
  handlaggare: "Handlaggare",
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "–";
  if (typeof value === "boolean") return value ? "Ja" : "Nej";
  return String(value);
}

export default function FormView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: item,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bestallningsspecifikation", id],
    queryFn: () => bestallningsspecifikationApi.getById(Number(id)),
    enabled: !!id,
  });

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

  if (error || !item) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Kunde inte ladda beställningsspecifikationen. Försök igen senare.
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
      >
        Tillbaka till beställningsspecifikationer
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
              {item.arendenummer || `Beställning ${item.bestallningGid}`}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Beställningsspecifikation (endast visning)
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 2 }}
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                label={`GID ${item.bestallningGid}`}
                size="small"
                variant="outlined"
              />
              {item.kategori && (
                <Chip
                  label={item.kategori}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {item.prioritet && <Chip label={item.prioritet} size="small" />}
              {item.handlaggare && (
                <Chip label={item.handlaggare} size="small" />
              )}
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            {displayKeys.map((key) => {
              const value = item[key];
              const label = fieldLabels[key];
              if (label === undefined) return null;
              const display = formatValue(value);
              if (display === "–" && key !== "bestallningGid") return null; // optionally hide empty fields
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
                    {display}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
