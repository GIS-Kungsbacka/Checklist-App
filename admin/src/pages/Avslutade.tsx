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
} from "@mui/material";
import { Undo } from "@mui/icons-material";
import { useChecklists, useUpdateChecklist } from "../hooks/useChecklist";
import type { Checklist, UpdateChecklistDto } from "../types/checklist";
import { getPrioritetChipColor } from "./checklist-data-grid";

export default function Avslutade() {
  const { data: allItems = [], isLoading, isError } = useChecklists();
  const updateMutation = useUpdateChecklist();

  // Filter items where levererad is true
  const items = React.useMemo(
    () => allItems.filter((item) => item.levererad === true),
    [allItems]
  );

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Avslutade
        </Typography>
        <Typography variant="body1" color="text.secondary">
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
      ) : (
        <Paper elevation={2}>
          <List>
            {items.map((item, index) => (
              <React.Fragment key={item.gid}>
                <ListItem
                  sx={{
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
                        primary={item.arendenummerArtvise || `GID: ${item.gid}`}
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
                      onClick={() => handleUndo(item)}
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
