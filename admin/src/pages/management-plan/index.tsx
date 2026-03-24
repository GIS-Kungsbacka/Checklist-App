import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { GRID_DEFAULT_LOCALE_TEXT } from "../../../constants/sv";
import {
  useManagementPlans,
  useCreateManagementPlan,
  useUpdateManagementPlan,
  useDeleteManagementPlan,
} from "../../hooks/useManagementPlan";
import type {
  CreateManagementPlanDto,
  ManagementPlan,
} from "../../types/managementPlan";

const toArray = (value: string): string[] | undefined => {
  const values = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
};

const fromArray = (value?: string[]): string => (value ?? []).join(", ");

type ManagementPlanFormState = {
  arendeNummer: string;
  bestallareNamn: string;
  bestallareEpost: string;
  sakerhetsklass: string;
  datakallaTyp: string;
  schema: string;
  namn: string;
  titel: string;
  dataAgare: string;
  dataForvaltare: string;
  dataAdministrator: string;
  dataKonsument: string;
  redigeringsKalla: string;
  publicering: string;
  oppnaData: boolean;
  arkivering: string;
  arkiveringTidpunkt: string;
  atkomst: string;
  status: string;
  handlaggare: string;
  forvaltningsplanVersion: string;
  skapadTidPunkt: string;
};

const emptyForm: ManagementPlanFormState = {
  arendeNummer: "",
  bestallareNamn: "",
  bestallareEpost: "",
  sakerhetsklass: "",
  datakallaTyp: "",
  schema: "",
  namn: "",
  titel: "",
  dataAgare: "",
  dataForvaltare: "",
  dataAdministrator: "",
  dataKonsument: "",
  redigeringsKalla: "",
  publicering: "",
  oppnaData: false,
  arkivering: "",
  arkiveringTidpunkt: "",
  atkomst: "",
  status: "",
  handlaggare: "",
  forvaltningsplanVersion: "",
  skapadTidPunkt: "",
};

const toFormState = (item: ManagementPlan): ManagementPlanFormState => ({
  arendeNummer: item.arendeNummer ?? "",
  bestallareNamn: item.bestallareNamn ?? "",
  bestallareEpost: item.bestallareEpost ?? "",
  sakerhetsklass: item.sakerhetsklass ?? "",
  datakallaTyp: item.datakallaTyp ?? "",
  schema: item.schema ?? "",
  namn: item.namn ?? "",
  titel: item.titel ?? "",
  dataAgare: item.dataAgare ?? "",
  dataForvaltare: item.dataForvaltare ?? "",
  dataAdministrator: fromArray(item.dataAdministrator),
  dataKonsument: fromArray(item.dataKonsument),
  redigeringsKalla: fromArray(item.redigeringsKalla),
  publicering: item.publicering ?? "",
  oppnaData: item.oppnaData ?? false,
  arkivering: item.arkivering ?? "",
  arkiveringTidpunkt: item.arkiveringTidpunkt ?? "",
  atkomst: fromArray(item.atkomst),
  status: item.status ?? "",
  handlaggare: item.handlaggare ?? "",
  forvaltningsplanVersion: item.forvaltningsplanVersion ?? "",
  skapadTidPunkt: item.skapadTidPunkt ?? "",
});

const toDto = (state: ManagementPlanFormState): CreateManagementPlanDto => ({
  arendeNummer: state.arendeNummer || undefined,
  bestallareNamn: state.bestallareNamn || undefined,
  bestallareEpost: state.bestallareEpost || undefined,
  sakerhetsklass: state.sakerhetsklass || undefined,
  datakallaTyp: state.datakallaTyp || undefined,
  schema: state.schema || undefined,
  namn: state.namn || undefined,
  titel: state.titel || undefined,
  dataAgare: state.dataAgare || undefined,
  dataForvaltare: state.dataForvaltare || undefined,
  dataAdministrator: toArray(state.dataAdministrator),
  dataKonsument: toArray(state.dataKonsument),
  redigeringsKalla: toArray(state.redigeringsKalla),
  publicering: state.publicering || undefined,
  oppnaData: state.oppnaData,
  arkivering: state.arkivering || undefined,
  arkiveringTidpunkt: state.arkiveringTidpunkt || undefined,
  atkomst: toArray(state.atkomst),
  status: state.status || undefined,
  handlaggare: state.handlaggare || undefined,
  forvaltningsplanVersion: state.forvaltningsplanVersion || undefined,
  skapadTidPunkt: state.skapadTidPunkt || undefined,
});

export default function ManagementPlanPage() {
  const { data = [], isLoading, isError } = useManagementPlans();
  const createMutation = useCreateManagementPlan();
  const updateMutation = useUpdateManagementPlan();
  const deleteMutation = useDeleteManagementPlan();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<ManagementPlan | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<ManagementPlan | null>(
    null
  );
  const [form, setForm] = React.useState<ManagementPlanFormState>(emptyForm);

  const rows = React.useMemo(
    () =>
      [...data]
        .sort((a, b) => a.gid - b.gid)
        .map((item) => ({ ...item, id: item.gid })),
    [data]
  );

  const columns: GridColDef<ManagementPlan>[] = [
    { field: "gid", headerName: "GID", width: 90 },
    { field: "namn", headerName: "Namn", minWidth: 180, flex: 1 },
    {
      field: "arendeNummer",
      headerName: "Ärendenummer",
      minWidth: 150,
      flex: 1,
    },
    { field: "status", headerName: "Status", minWidth: 140, flex: 1 },
    { field: "handlaggare", headerName: "Handläggare", minWidth: 150, flex: 1 },
    {
      field: "actions",
      headerName: "Åtgärder",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditOutlinedIcon color="primary" />}
          label="Redigera"
          onClick={() => {
            const row = params.row as ManagementPlan;
            setOpenEdit(row);
            setForm(toFormState(row));
          }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteOutlineOutlinedIcon color="error" />}
          label="Ta bort"
          onClick={() => setDeleteItem(params.row as ManagementPlan)}
        />,
      ],
    },
  ];

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <Alert severity="error">Kunde inte ladda förvaltningsplaner.</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="body2" fontWeight={600}>
          Hantera förvaltningsplan med skapa, redigera och ta bort.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setForm(emptyForm);
            setOpenCreate(true);
          }}
        >
          Skapa ny rad
        </Button>
      </Box>

      <Paper sx={{ height: { xs: 350, md: 550 } }}>
        <DataGrid
          rows={rows}
          columns={columns}
          localeText={GRID_DEFAULT_LOCALE_TEXT}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "gid", sort: "asc" }] },
          }}
        />
      </Paper>

      <Dialog
        open={openCreate || openEdit !== null}
        onClose={() => (openCreate ? setOpenCreate(false) : setOpenEdit(null))}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {openCreate
            ? "Skapa förvaltningsplan"
            : `Redigera förvaltningsplan ${openEdit?.gid}`}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              pt: 1,
            }}
          >
            {(
              [
                ["namn", "Namn"],
                ["titel", "Titel"],
                ["arendeNummer", "Ärendenummer"],
                ["bestallareNamn", "Beställare namn"],
                ["bestallareEpost", "Beställare e-post"],
                ["sakerhetsklass", "Säkerhetsklass"],
                ["datakallaTyp", "Datakälla typ"],
                ["schema", "Schema"],
                ["dataAgare", "Dataägare"],
                ["dataForvaltare", "Dataförvaltare"],
                ["dataAdministrator", "Dataadministratör (kommaseparerat)"],
                ["dataKonsument", "Datakonsument (kommaseparerat)"],
                ["redigeringsKalla", "Redigeringskälla (kommaseparerat)"],
                ["atkomst", "Åtkomst (kommaseparerat)"],
                ["publicering", "Publicering"],
                ["arkivering", "Arkivering"],
                ["arkiveringTidpunkt", "Arkivering tidpunkt"],
                ["status", "Status"],
                ["handlaggare", "Handläggare"],
                ["forvaltningsplanVersion", "Förvaltningsplan version"],
                ["skapadTidPunkt", "Skapad tidpunkt (ISO datetime)"],
              ] as const
            ).map(([key, label]) => (
              <TextField
                key={key}
                label={label}
                value={form[key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            ))}
          </Box>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.oppnaData}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      oppnaData: e.target.checked,
                    }))
                  }
                />
              }
              label="Öppna data"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              openCreate ? setOpenCreate(false) : setOpenEdit(null)
            }
          >
            Avbryt
          </Button>
          <Button
            variant="contained"
            disabled={isSubmitting}
            onClick={() => {
              const dto = toDto(form);
              if (openCreate) {
                createMutation.mutate(dto, {
                  onSuccess: () => setOpenCreate(false),
                });
                return;
              }
              if (openEdit) {
                updateMutation.mutate(
                  { gid: openEdit.gid, data: dto },
                  { onSuccess: () => setOpenEdit(null) }
                );
              }
            }}
          >
            Spara
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteItem !== null} onClose={() => setDeleteItem(null)}>
        <DialogTitle>Ta bort förvaltningsplan</DialogTitle>
        <DialogContent>
          Vill du ta bort posten med GID <strong>{deleteItem?.gid}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteItem(null)}>Avbryt</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (!deleteItem) return;
              deleteMutation.mutate(deleteItem.gid, {
                onSuccess: () => setDeleteItem(null),
              });
            }}
          >
            Ta bort
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
