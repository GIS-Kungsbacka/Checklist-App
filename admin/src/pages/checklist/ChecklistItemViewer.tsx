import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useChecklistById } from "../../hooks/useChecklist";
import type { Checklist } from "../../types/checklist";

function formatOptionalValue(v: unknown) {
  if (v === undefined || v === null || v === "") return "-";
  return String(v);
}

function formatOptionalBool(v: boolean | undefined) {
  if (v === true) return "Ja";
  if (v === false) return "Nej";
  return "-";
}

export default function ChecklistItemViewer() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ gid: string }>();
  const gid = Number(params.gid);
  const gidSafe = Number.isFinite(gid) ? gid : 0;

  const base = React.useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[0] || "idebanken";
  }, [location.pathname]);

  const title =
    base === "avslutade" ? "Avslutade" : base === "idebanken" ? "Idebanken" : "Detaljer";

  const backPath = `/${base}`;

  const { data, isLoading, error } = useChecklistById(gidSafe);

  if (!params.gid || Number.isNaN(gid)) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Alert severity="error">Ogiltigt id.</Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate(backPath)}>
            Tillbaka
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title} - Detaljer
        </Typography>
        <Button variant="outlined" onClick={() => navigate(backPath)}>
          Tillbaka
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Kunde inte hämta posten.
        </Alert>
      ) : (
        <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
          <TableContainer>
            <Table size="small">
              <TableBody>
                <ChecklistDetailRow label="GID" value={data?.gid} />
                <ChecklistDetailRow
                  label="Ärendenummer"
                  value={(data as Checklist | undefined)?.arendenummerArtvise}
                />
                <ChecklistDetailRow label="Dataunderlag" value={data?.dataunderlag} />
                <ChecklistDetailRow
                  label="Dataadministratör"
                  value={data?.dataadministrator}
                />
                <ChecklistDetailRow label="Målgrupper" value={data?.malgrupper} />
                <ChecklistDetailRow
                  label="Nyttjande"
                  value={data?.nyttjandeInterntExternt}
                />
                <ChecklistDetailRow label="Leverans" value={data?.leverans} />
                <ChecklistDetailRow
                  label="Leverans (arbetstimmar)"
                  value={data?.leveransArbetstimmar}
                />
                <ChecklistDetailRow label="Kategori" value={data?.kategori} />
                <ChecklistDetailRow label="Kategori typ" value={data?.kategoriTyp} />
                <ChecklistDetailRow label="Prioritet" value={data?.prioritet} />
                <ChecklistDetailRow label="Antagen (ja/nej)" value={data?.antagenJaNej} />
                <ChecklistDetailRow
                  label="Antagen (motivering)"
                  value={data?.antagenJaNejMotivering}
                />
                <ChecklistDetailRow label="Handläggare" value={data?.handlaggare} />
                <ChecklistDetailRow label="Tabell" value={data?.tabell} />
                <ChecklistDetailRow label="WMS" value={data?.wms} />
                <ChecklistDetailRow label="FME" value={data?.fme} />
                <ChecklistDetailRow label="Redigering" value={data?.redigering} />
                <ChecklistDetailRow
                  label="Kopiering"
                  value={formatOptionalBool(data?.kopiering)}
                />
                <ChecklistDetailRow label="Information" value={data?.information} />
                <ChecklistDetailRow label="Kommentar" value={data?.kommentar} />
                <ChecklistDetailRow
                  label="Levererad"
                  value={formatOptionalBool(data?.levererad)}
                />
                <ChecklistDetailRow
                  label="Verksamhetskritisk data"
                  value={data?.verksamhetskritiskData}
                />
                <ChecklistDetailRow
                  label="Skapelsedatum"
                  value={data?.skapelseDatum}
                />
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
}

function ChecklistDetailRow({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <TableRow>
      <TableCell sx={{ fontWeight: 600, width: 260 }}>{label}</TableCell>
      <TableCell>{formatOptionalValue(value)}</TableCell>
    </TableRow>
  );
}

