import * as React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Undo } from "@mui/icons-material";
import { useChecklists, useUpdateChecklist } from "../../hooks/useChecklist";
import type { Checklist, UpdateChecklistDto } from "../../types/checklist";
import { getPrioritetChipColor } from "./checklist-data-grid";
import { useNavigate } from "react-router-dom";

export default function Avslutade() {
  const { data: allItems = [], isLoading, isError } = useChecklists();
  const updateMutation = useUpdateChecklist();
  const navigate = useNavigate();

  // Filter items where levererad is true
  const items = React.useMemo(
    () =>
      allItems
        .filter((item) => item.levererad === true)
        .sort((a, b) => a.gid - b.gid),
    [allItems]
  );

  const pageSize = 10;
  const [page, setPage] = React.useState(0);
  React.useEffect(() => setPage(0), [items.length]);
  const pagedItems = items.slice(page * pageSize, page * pageSize + pageSize);
  const showTable = true;

  const handleView = (item: Checklist) => {
    navigate(`/avslutade/${item.gid}`);
  };

  const handleUndo = (item: Checklist) => {
    // Restore full item data with levererad changed to false
    const updateData: UpdateChecklistDto = {
      arendenummerArtvise: item.arendenummerArtvise,
      dataunderlag: item.dataunderlag,
      dataadministrator: item.dataadministrator,
      malgrupper: item.malgrupper,
      nyttjandeInterntExternt: item.nyttjandeInterntExternt,
      leverans: item.leverans,
      leveransArbetstimmar: item.leveransArbetstimmar,
      kategori: item.kategori,
      kategoriTyp: item.kategoriTyp,
      prioritet: item.prioritet,
      antagenJaNej: item.antagenJaNej,
      antagenJaNejMotivering: item.antagenJaNejMotivering,
      handlaggare: item.handlaggare,
      tabell: item.tabell,
      wms: item.wms,
      fme: item.fme,
      redigering: item.redigering,
      kopiering: item.kopiering,
      information: item.information,
      kommentar: item.kommentar,
      levererad: false, // Changed back to false
      verksamhetskritiskData: item.verksamhetskritiskData,
    };

    updateMutation.mutate(
      {
        gid: item.gid,
        data: updateData,
      },
      {
        onSuccess: () => {
          // Query invalidation happens automatically in the hook
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Alert severity="error">Kunde inte ladda listan.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Box mb={3}>
        <Typography variant="body2" fontWeight={600}>
          Poster med levererad markerad. Klicka på ångra för att flytta tillbaka
          till checklistan.
        </Typography>
      </Box>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Kunde inte uppdatera. Försök igen.
        </Alert>
      )}

      {items.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            Inga avslutade poster.
          </Typography>
        </Paper>
      ) : showTable ? (
        <Paper elevation={2}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>GID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ärendenummer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Prioritet</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 140 }}>
                    Åtgärder
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedItems.map((item) => (
                  <TableRow
                    key={item.gid}
                    hover
                    onClick={() => handleView(item)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{item.gid}</TableCell>
                    <TableCell>{item.arendenummerArtvise ?? "-"}</TableCell>
                    <TableCell>
                      {item.prioritet ? (
                        <Chip
                          label={item.prioritet}
                          size="small"
                          color={getPrioritetChipColor(item.prioritet)}
                          variant="filled"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {item.dataadministrator ?? "-"}
                      {item.kategori ? ` • ${item.kategori}` : ""}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<Undo />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUndo(item);
                        }}
                        disabled={updateMutation.isPending}
                      >
                        Ångra
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={items.length}
            page={page}
            onPageChange={(_e, nextPage) => setPage(nextPage)}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[pageSize]}
          />
        </Paper>
      ) : (
        <Paper elevation={2}>
          <List>
            {items.map((item, index) => (
              <React.Fragment key={item.gid}>
                <ListItem
                  onClick={() => handleView(item)}
                  sx={{
                    cursor: "pointer",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    py: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          GID: {item.gid}
                        </Typography>
                        {item.arendenummerArtvise && (
                          <Typography variant="body2" color="text.secondary">
                            ({item.arendenummerArtvise})
                          </Typography>
                        )}
                        {item.prioritet && (
                          <Chip
                            label={item.prioritet}
                            size="small"
                            color={getPrioritetChipColor(item.prioritet)}
                            variant="filled"
                          />
                        )}
                      </Stack>
                      <ListItemText
                        primary=""
                        secondary={
                          <Box component="span">
                            {item.dataadministrator && (
                              <>
                                Dataadministratör: {item.dataadministrator} •{" "}
                              </>
                            )}
                            {item.kategori && <>Kategori: {item.kategori}</>}
                            {item.dataunderlag && (
                              <> • Dataunderlag: {item.dataunderlag}</>
                            )}
                          </Box>
                        }
                      />
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<Undo />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUndo(item);
                      }}
                      disabled={updateMutation.isPending}
                      sx={{ ml: 2 }}
                    >
                      Ångra
                    </Button>
                  </Box>
                </ListItem>
                {index < items.length - 1 && (
                  <Box component="hr" sx={{ m: 0 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}
