import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { bestallaUppdragFrageformularApi } from "../api/bestallaUppdragFrageformularApi";
import type {
  BestallaUppdragFrageformular,
  CreateBestallaUppdragFrageformularDto,
} from "../types/bestallaUppdragFrageformular";

const ITEMS_PER_PAGE = 10;

const emptyFormData: CreateBestallaUppdragFrageformularDto = {
  arendenummer: "",
  dataunderlag: "",
  dataadministrator: "",
  malgrupper: "",
  nyttjandeInterntExternt: "",
  leverans: "",
  leveransArbetstimmar: "",
  kategori: "",
  kategoriTyp: "",
  parioritet: "",
  antagenJaNej: "",
  antagenJaNejMotivering: "",
};

export default function FormsList() {
  const queryClient = useQueryClient();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<BestallaUppdragFrageformular | null>(
    null,
  );
  const [deleteConfirm, setDeleteConfirm] =
    useState<BestallaUppdragFrageformular | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [formData, setFormData] =
    useState<CreateBestallaUppdragFrageformularDto>(emptyFormData);

  const { data: items, isLoading } = useQuery({
    queryKey: ["bestallaUppdragFrageformular"],
    queryFn: bestallaUppdragFrageformularApi.getAll,
  });

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.arendenummer?.toLowerCase().includes(q) ||
        item.dataadministrator?.toLowerCase().includes(q) ||
        item.kategori?.toLowerCase().includes(q) ||
        item.dataunderlag?.toLowerCase().includes(q) ||
        item.gid.toString().includes(q),
    );
  }, [items, searchQuery]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, page]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
  );

  const createMutation = useMutation({
    mutationFn: bestallaUppdragFrageformularApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bestallaUppdragFrageformular"],
      });
      setOpenCreate(false);
      setFormData(emptyFormData);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      gid,
      dto,
    }: {
      gid: number;
      dto: CreateBestallaUppdragFrageformularDto;
    }) => bestallaUppdragFrageformularApi.update(gid, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bestallaUppdragFrageformular"],
      });
      setOpenEdit(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: bestallaUppdragFrageformularApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bestallaUppdragFrageformular"],
      });
      setDeleteConfirm(null);
    },
  });

  const handleEditClick = (item: BestallaUppdragFrageformular) => {
    setOpenEdit(item);
    setFormData({
      arendenummer: item.arendenummer ?? "",
      dataunderlag: item.dataunderlag ?? "",
      dataadministrator: item.dataadministrator ?? "",
      malgrupper: item.malgrupper ?? "",
      nyttjandeInterntExternt: item.nyttjandeInterntExternt ?? "",
      leverans: item.leverans ?? "",
      leveransArbetstimmar: item.leveransArbetstimmar ?? "",
      kategori: item.kategori ?? "",
      kategoriTyp: item.kategoriTyp ?? "",
      parioritet: item.parioritet ?? "",
      antagenJaNej: item.antagenJaNej ?? "",
      antagenJaNejMotivering: item.antagenJaNejMotivering ?? "",
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (!openEdit) return;
    updateMutation.mutate({ gid: openEdit.gid, dto: formData });
  };

  const handleDelete = () => {
    if (deleteConfirm) deleteMutation.mutate(deleteConfirm.gid);
  };

  const setField = (
    key: keyof CreateBestallaUppdragFrageformularDto,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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
            setFormData(emptyFormData);
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
            Visar {filteredItems.length} av {items?.length ?? 0} poster
          </Typography>
        )}
      </Box>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Kunde inte skapa. Försök igen.
        </Alert>
      )}
      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Kunde inte uppdatera. Försök igen.
        </Alert>
      )}
      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Kunde inte ta bort. Försök igen.
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
                <TableCell>{item.arendenummer ?? "-"}</TableCell>
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
                <TableCell>{item.parioritet ?? "-"}</TableCell>
                <TableCell>{item.antagenJaNej ?? "-"}</TableCell>
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
        <DialogTitle>Skapa ny post</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            {(
              [
                ["arendenummer", "Ärendenummer"],
                ["dataunderlag", "Dataunderlag"],
                ["dataadministrator", "Dataadministratör"],
                ["malgrupper", "Målgrupper"],
                ["nyttjandeInterntExternt", "Nyttjande internt/externt"],
                ["leverans", "Leverans"],
                ["leveransArbetstimmar", "Leverans (arbetstimmar)"],
                ["kategori", "Kategori"],
                ["kategoriTyp", "Kategori typ"],
                ["parioritet", "Prioritet"],
                ["antagenJaNej", "Antagen ja/nej"],
                ["antagenJaNejMotivering", "Antagen ja/nej motivering"],
              ] as const
            ).map(([key, label]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={key}>
                <TextField
                  fullWidth
                  label={label}
                  value={formData[key] ?? ""}
                  onChange={(e) => setField(key, e.target.value)}
                  multiline={key === "antagenJaNejMotivering"}
                  rows={key === "antagenJaNejMotivering" ? 2 : 1}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setOpenCreate(false)}
            disabled={createMutation.isPending}
          >
            Avbryt
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={createMutation.isPending}
            sx={{ minWidth: 100 }}
          >
            {createMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Skapa"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit !== null}
        onClose={() => setOpenEdit(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Redigera post {openEdit?.gid}</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            {(
              [
                ["arendenummer", "Ärendenummer"],
                ["dataunderlag", "Dataunderlag"],
                ["dataadministrator", "Dataadministratör"],
                ["malgrupper", "Målgrupper"],
                ["nyttjandeInterntExternt", "Nyttjande internt/externt"],
                ["leverans", "Leverans"],
                ["leveransArbetstimmar", "Leverans (arbetstimmar)"],
                ["kategori", "Kategori"],
                ["kategoriTyp", "Kategori typ"],
                ["parioritet", "Prioritet"],
                ["antagenJaNej", "Antagen ja/nej"],
                ["antagenJaNejMotivering", "Antagen ja/nej motivering"],
              ] as const
            ).map(([key, label]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={key}>
                <TextField
                  fullWidth
                  label={label}
                  value={formData[key] ?? ""}
                  onChange={(e) => setField(key, e.target.value)}
                  multiline={key === "antagenJaNejMotivering"}
                  rows={key === "antagenJaNejMotivering" ? 2 : 1}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setOpenEdit(null)}
            disabled={updateMutation.isPending}
          >
            Avbryt
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={updateMutation.isPending}
            sx={{ minWidth: 100 }}
          >
            {updateMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Spara"
            )}
          </Button>
        </DialogActions>
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
            {deleteConfirm?.arendenummer ? (
              <> (ärendenummer: {deleteConfirm.arendenummer})</>
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
