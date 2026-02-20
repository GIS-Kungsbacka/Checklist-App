import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  InputAdornment,
  Pagination,
  Grid,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  useChecklists,
  useCreateChecklist,
  useUpdateChecklist,
  useDeleteChecklist,
} from "../hooks/useChecklist";
import type { Checklist, CreateChecklistDto } from "../types/checklist";

const ITEMS_PER_PAGE = 10;

export default function FormsList() {
  const { data: items = [], isLoading, error } = useChecklists();
  const createMutation = useCreateChecklist();
  const updateMutation = useUpdateChecklist();
  const deleteMutation = useDeleteChecklist();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<Checklist | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Checklist | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const {
    control: createControl,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    setError,
    formState: { isSubmitting: isCreating },
  } = useForm<CreateChecklistDto>({
    defaultValues: {
      arendenummerArtvise: "",
      dataunderlag: "",
      dataadministrator: "",
      malgrupper: "",
      nyttjandeInterntExternt: "",
      leverans: "",
      leveransArbetstimmar: "",
      kategori: "",
      kategoriTyp: "",
      prioritet: "",
      antagenJaNej: "",
      antagenJaNejMotivering: "",
      handlaggare: "",
    },
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    formState: { isSubmitting: isUpdating },
  } = useForm<CreateChecklistDto>();

  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by search query if provided
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = items.filter(
        (item) =>
          item.arendenummerArtvise?.toLowerCase().includes(q) ||
          item.dataadministrator?.toLowerCase().includes(q) ||
          item.kategori?.toLowerCase().includes(q) ||
          item.dataunderlag?.toLowerCase().includes(q) ||
          item.gid.toString().includes(q),
      );
    }

    // Sort by GID in ascending order
    return [...result].sort((a, b) => a.gid - b.gid);
  }, [items, searchQuery]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, page]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
  );

  const handleEditClick = (item: Checklist) => {
    setOpenEdit(item);
    resetEditForm({
      arendenummerArtvise: item.arendenummerArtvise ?? "",
      dataunderlag: item.dataunderlag ?? "",
      dataadministrator: item.dataadministrator ?? "",
      malgrupper: item.malgrupper ?? "",
      nyttjandeInterntExternt: item.nyttjandeInterntExternt ?? "",
      leverans: item.leverans ?? "",
      leveransArbetstimmar: item.leveransArbetstimmar ?? "",
      kategori: item.kategori ?? "",
      kategoriTyp: item.kategoriTyp ?? "",
      prioritet: item.prioritet ?? "",
      antagenJaNej: item.antagenJaNej ?? "",
      antagenJaNejMotivering: item.antagenJaNejMotivering ?? "",
      handlaggare: item.handlaggare ?? "",
    });
  };

  const handleCreate = (data: CreateChecklistDto) => {
    // Additional validation check (react-hook-form validation should catch this, but this is a backup)
    const arendenummerArtvise = data.arendenummerArtvise?.trim();
    if (arendenummerArtvise) {
      const duplicateExists = items.some(
        (item) =>
          item.arendenummerArtvise?.toLowerCase().trim() ===
          arendenummerArtvise.toLowerCase().trim(),
      );

      if (duplicateExists) {
        setError("arendenummerArtvise", {
          type: "manual",
          message: "Ärendenummer finns redan",
        });
        return;
      }
    }

    createMutation.mutate(data, {
      onSuccess: () => {
        setOpenCreate(false);
        resetCreateForm();
      },
    });
  };

  const handleUpdate = (data: CreateChecklistDto) => {
    if (!openEdit) return;
    updateMutation.mutate(
      { gid: openEdit.gid, data },
      {
        onSuccess: () => {
          setOpenEdit(null);
        },
      },
    );
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm.gid, {
        onSuccess: () => {
          setDeleteConfirm(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl">
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Beställa uppdrag – frågeformulär
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Skapa, redigera och ta bort poster
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setOpenCreate(true);
            resetCreateForm();
          }}
          size="large"
          sx={{ height: 42 }}
        >
          Skapa ny
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Sök på ärendenummer, dataadministratör, kategori, dataunderlag eller GID..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": { backgroundColor: "background.paper" },
          }}
        />
        {searchQuery && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Visar {filteredItems.length} av {items.length} poster
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error instanceof Error
            ? error.message
            : "Kunde inte ladda data. Försök igen senare."}
        </Alert>
      )}
      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : "Kunde inte skapa. Försök igen."}
        </Alert>
      )}
      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : "Kunde inte uppdatera. Försök igen."}
        </Alert>
      )}
      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Kunde inte ta bort. Försök igen."}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{ borderRadius: 2, overflowX: "auto" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 600 }}>GID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ärendenummer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dataunderlag</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dataadministratör</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Målgrupper</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nyttjande</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Leverans</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Kategori</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Prioritet</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Antagen</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Handlaggare</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Åtgärder
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow
                key={item.gid}
                sx={{ "&:hover": { backgroundColor: "action.hover" } }}
              >
                <TableCell>{item.gid}</TableCell>
                <TableCell>{item.arendenummerArtvise ?? "-"}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 140,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.dataunderlag ?? "-"}
                </TableCell>
                <TableCell>{item.dataadministrator ?? "-"}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.malgrupper ?? "-"}
                </TableCell>
                <TableCell>{item.nyttjandeInterntExternt ?? "-"}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.leverans ?? "-"}
                </TableCell>
                <TableCell>{item.kategori ?? "-"}</TableCell>
                <TableCell>{item.prioritet ?? "-"}</TableCell>
                <TableCell>{item.antagenJaNej ?? "-"}</TableCell>
                <TableCell>{item.handlaggare ?? "-"}</TableCell>
                <TableCell align="right">
                  <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="flex-end"
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(item)}
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteConfirm(item)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {paginatedItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {searchQuery
                      ? "Inga poster matchar sökningen"
                      : "Inga poster. Skapa en för att börja."}
                  </Typography>
                  {!searchQuery && (
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setOpenCreate(true)}
                      sx={{ mt: 2 }}
                    >
                      Skapa ny
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredItems.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_e, value) => setPage(value)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Create Dialog */}
      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleCreateSubmit(handleCreate)}>
          <DialogTitle>Skapa ny post</DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              {(
                [
                  ["arendenummerArtvise", "Ärendenummer"],
                  ["dataunderlag", "Dataunderlag"],
                  ["dataadministrator", "Dataadministratör"],
                  ["malgrupper", "Målgrupper"],
                  ["nyttjandeInterntExternt", "Nyttjande internt/externt"],
                  ["leverans", "Leverans"],
                  ["leveransArbetstimmar", "Leverans (arbetstimmar)"],
                  ["kategori", "Kategori"],
                  ["kategoriTyp", "Kategori typ"],
                  ["prioritet", "Prioritet"],
                  ["antagenJaNej", "Antagen ja/nej"],
                  ["handlaggare", "Handlaggare"],
                  ["antagenJaNejMotivering", "Antagen ja/nej motivering"],
                ] as const
              ).map(([key, label]) => (
                <Grid size={{ xs: 12, sm: 6 }} key={key}>
                  <Controller
                    name={key as keyof CreateChecklistDto}
                    control={createControl}
                    rules={
                      key === "arendenummerArtvise"
                        ? {
                            validate: (value) => {
                              if (!value || !value.trim()) return true; // Allow empty
                              const duplicateExists = items.some(
                                (item) =>
                                  item.arendenummerArtvise
                                    ?.toLowerCase()
                                    .trim() === value.toLowerCase().trim(),
                              );
                              return duplicateExists
                                ? "Ärendenummer finns redan"
                                : true;
                            },
                          }
                        : undefined
                    }
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={label}
                        multiline={key === "antagenJaNejMotivering"}
                        rows={key === "antagenJaNejMotivering" ? 2 : 1}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              type="button"
              onClick={() => setOpenCreate(false)}
              disabled={createMutation.isPending || isCreating}
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || isCreating}
              sx={{ minWidth: 100 }}
            >
              {createMutation.isPending || isCreating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Skapa"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit !== null}
        onClose={() => setOpenEdit(null)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleEditSubmit(handleUpdate)}>
          <DialogTitle>Redigera post {openEdit?.gid}</DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              {(
                [
                  ["arendenummerArtvise", "Ärendenummer"],
                  ["dataunderlag", "Dataunderlag"],
                  ["dataadministrator", "Dataadministratör"],
                  ["malgrupper", "Målgrupper"],
                  ["nyttjandeInterntExternt", "Nyttjande internt/externt"],
                  ["leverans", "Leverans"],
                  ["leveransArbetstimmar", "Leverans (arbetstimmar)"],
                  ["kategori", "Kategori"],
                  ["kategoriTyp", "Kategori typ"],
                  ["prioritet", "Prioritet"],
                  ["antagenJaNej", "Antagen ja/nej"],
                  ["handlaggare", "Handläggare"],
                  ["antagenJaNejMotivering", "Antagen ja/nej motivering"],
                ] as const
              ).map(([key, label]) => (
                <Grid size={{ xs: 12, sm: 6 }} key={key}>
                  <Controller
                    name={key as keyof CreateChecklistDto}
                    control={editControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={label}
                        multiline={key === "antagenJaNejMotivering"}
                        rows={key === "antagenJaNejMotivering" ? 4 : 1}
                      />
                    )}
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              type="button"
              onClick={() => setOpenEdit(null)}
              disabled={updateMutation.isPending || isUpdating}
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updateMutation.isPending || isUpdating}
              sx={{ minWidth: 100 }}
            >
              {updateMutation.isPending || isUpdating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Spara"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "error" }}>Ta bort post</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Åtgärden kan inte ångras.
          </Alert>
          <Typography>
            Vill du ta bort posten med GID <strong>{deleteConfirm?.gid}</strong>
            {deleteConfirm?.arendenummerArtvise ? (
              <> (ärendenummer: {deleteConfirm.arendenummerArtvise})</>
            ) : null}
            ?
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteConfirm(null)}
            disabled={deleteMutation.isPending}
          >
            Avbryt
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            sx={{ minWidth: 100 }}
          >
            {deleteMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Ta bort"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
