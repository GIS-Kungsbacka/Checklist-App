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
  useMetadatas,
  useCreateMetadata,
  useUpdateMetadata,
  useDeleteMetadata,
} from "../../hooks/useMetadata";
import type { CreateMetadataDto, Metadata } from "../../types/metadata";

const toArray = (value: string): string[] | undefined => {
  const values = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
};

const fromArray = (value?: string[]): string => (value ?? []).join(", ");

type MetadataFormState = {
  sakerhetsKlassDokument: string;
  arendeNummer: string;
  bestallareNamn: string;
  bestallareEpost: string;
  sakerhetsKlass: string;
  dataKallaTyp: string;
  schema: string;
  namn: string;
  beskrivning: string;
  syfte: string;
  datakalla: string;
  metod: string;
  projekt: string;
  geografiskBegransning: string;
  uppdateringsFrekvens: string;
  fullstandighet: string;
  skalnivå: string;
  nyckelOrd: string;
  kategori: string;
  tidsperiod: boolean;
  tidsperiodStartdatum: string;
  tidsperiodSlutdatum: string;
  tidsUpplosning: string;
  skapelseDatum: string;
  anvandarBegransningLicens: boolean;
  anvandarBegransningLicensText: string;
  relateradeResurser: string;
  status: string;
  handlaggare: string;
  metaDataVersion: string;
  skapadTidPunkt: string;
};

const emptyForm: MetadataFormState = {
  sakerhetsKlassDokument: "",
  arendeNummer: "",
  bestallareNamn: "",
  bestallareEpost: "",
  sakerhetsKlass: "",
  dataKallaTyp: "",
  schema: "",
  namn: "",
  beskrivning: "",
  syfte: "",
  datakalla: "",
  metod: "",
  projekt: "",
  geografiskBegransning: "",
  uppdateringsFrekvens: "",
  fullstandighet: "",
  skalnivå: "",
  nyckelOrd: "",
  kategori: "",
  tidsperiod: false,
  tidsperiodStartdatum: "",
  tidsperiodSlutdatum: "",
  tidsUpplosning: "",
  skapelseDatum: "",
  anvandarBegransningLicens: false,
  anvandarBegransningLicensText: "",
  relateradeResurser: "",
  status: "",
  handlaggare: "",
  metaDataVersion: "",
  skapadTidPunkt: "",
};

const toFormState = (item: Metadata): MetadataFormState => ({
  sakerhetsKlassDokument: item.sakerhetsKlassDokument ?? "",
  arendeNummer: item.arendeNummer ?? "",
  bestallareNamn: item.bestallareNamn ?? "",
  bestallareEpost: item.bestallareEpost ?? "",
  sakerhetsKlass: item.sakerhetsKlass ?? "",
  dataKallaTyp: item.dataKallaTyp ?? "",
  schema: item.schema ?? "",
  namn: item.namn ?? "",
  beskrivning: item.beskrivning ?? "",
  syfte: item.syfte ?? "",
  datakalla: fromArray(item.datakalla),
  metod: item.metod ?? "",
  projekt: item.projekt ?? "",
  geografiskBegransning: fromArray(item.geografiskBegransning),
  uppdateringsFrekvens: item.uppdateringsFrekvens ?? "",
  fullstandighet: item.fullstandighet ?? "",
  skalnivå: item.skalnivå ?? "",
  nyckelOrd: fromArray(item.nyckelOrd),
  kategori: item.kategori ?? "",
  tidsperiod: item.tidsperiod ?? false,
  tidsperiodStartdatum: item.tidsperiodStartdatum ?? "",
  tidsperiodSlutdatum: item.tidsperiodSlutdatum ?? "",
  tidsUpplosning: item.tidsUpplosning ?? "",
  skapelseDatum: item.skapelseDatum ?? "",
  anvandarBegransningLicens: item.anvandarBegransningLicens ?? false,
  anvandarBegransningLicensText: item.anvandarBegransningLicensText ?? "",
  relateradeResurser: fromArray(item.relateradeResurser),
  status: item.status ?? "",
  handlaggare: item.handlaggare ?? "",
  metaDataVersion: item.metaDataVersion ?? "",
  skapadTidPunkt: item.skapadTidPunkt ?? "",
});

const toDto = (state: MetadataFormState): CreateMetadataDto => ({
  sakerhetsKlassDokument: state.sakerhetsKlassDokument || undefined,
  arendeNummer: state.arendeNummer || undefined,
  bestallareNamn: state.bestallareNamn || undefined,
  bestallareEpost: state.bestallareEpost || undefined,
  sakerhetsKlass: state.sakerhetsKlass || undefined,
  dataKallaTyp: state.dataKallaTyp || undefined,
  schema: state.schema || undefined,
  namn: state.namn || undefined,
  beskrivning: state.beskrivning || undefined,
  syfte: state.syfte || undefined,
  datakalla: toArray(state.datakalla),
  metod: state.metod || undefined,
  projekt: state.projekt || undefined,
  geografiskBegransning: toArray(state.geografiskBegransning),
  uppdateringsFrekvens: state.uppdateringsFrekvens || undefined,
  fullstandighet: state.fullstandighet || undefined,
  skalnivå: state.skalnivå || undefined,
  nyckelOrd: toArray(state.nyckelOrd),
  kategori: state.kategori || undefined,
  tidsperiod: state.tidsperiod,
  tidsperiodStartdatum: state.tidsperiodStartdatum || undefined,
  tidsperiodSlutdatum: state.tidsperiodSlutdatum || undefined,
  tidsUpplosning: state.tidsUpplosning || undefined,
  skapelseDatum: state.skapelseDatum || undefined,
  anvandarBegransningLicens: state.anvandarBegransningLicens,
  anvandarBegransningLicensText:
    state.anvandarBegransningLicensText || undefined,
  relateradeResurser: toArray(state.relateradeResurser),
  status: state.status || undefined,
  handlaggare: state.handlaggare || undefined,
  metaDataVersion: state.metaDataVersion || undefined,
  skapadTidPunkt: state.skapadTidPunkt || undefined,
});

export default function MetadataPage() {
  const { data = [], isLoading, isError } = useMetadatas();
  const createMutation = useCreateMetadata();
  const updateMutation = useUpdateMetadata();
  const deleteMutation = useDeleteMetadata();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<Metadata | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<Metadata | null>(null);
  const [form, setForm] = React.useState<MetadataFormState>(emptyForm);

  const rows = React.useMemo(
    () =>
      [...data]
        .sort((a, b) => a.gid - b.gid)
        .map((item) => ({ ...item, id: item.gid })),
    [data]
  );

  const columns: GridColDef<Metadata>[] = [
    { field: "gid", headerName: "GID", width: 90 },
    { field: "namn", headerName: "Namn", minWidth: 180, flex: 1 },
    {
      field: "arendeNummer",
      headerName: "Ärendenummer",
      minWidth: 150,
      flex: 1,
    },
    { field: "kategori", headerName: "Kategori", minWidth: 140, flex: 0.9 },
    { field: "status", headerName: "Status", minWidth: 140, flex: 0.9 },
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
            const row = params.row as Metadata;
            setOpenEdit(row);
            setForm(toFormState(row));
          }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteOutlineOutlinedIcon color="error" />}
          label="Ta bort"
          onClick={() => setDeleteItem(params.row as Metadata)}
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
          <Alert severity="error">Kunde inte ladda metadata.</Alert>
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
          Hantera metadata med skapa, redigera och ta bort.
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
          {openCreate ? "Skapa metadata" : `Redigera metadata ${openEdit?.gid}`}
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
                ["arendeNummer", "Ärendenummer"],
                ["bestallareNamn", "Beställare namn"],
                ["bestallareEpost", "Beställare e-post"],
                ["sakerhetsKlassDokument", "Säkerhetsklass dokument"],
                ["sakerhetsKlass", "Säkerhetsklass"],
                ["dataKallaTyp", "Datakälla typ"],
                ["schema", "Schema"],
                ["kategori", "Kategori"],
                ["status", "Status"],
                ["handlaggare", "Handläggare"],
                ["metaDataVersion", "Metadata version"],
                ["datakalla", "Datakälla (kommaseparerat)"],
                [
                  "geografiskBegransning",
                  "Geografisk begränsning (kommaseparerat)",
                ],
                ["nyckelOrd", "Nyckelord (kommaseparerat)"],
                ["relateradeResurser", "Relaterade resurser (kommaseparerat)"],
                ["uppdateringsFrekvens", "Uppdateringsfrekvens"],
                ["fullstandighet", "Fullständighet"],
                ["skalnivå", "Skalnivå"],
                ["tidsUpplosning", "Tidsupplösning"],
                ["tidsperiodStartdatum", "Tidsperiod startdatum (YYYY-MM-DD)"],
                ["tidsperiodSlutdatum", "Tidsperiod slutdatum (YYYY-MM-DD)"],
                ["skapelseDatum", "Skapelsedatum (YYYY-MM-DD)"],
                ["skapadTidPunkt", "Skapad tidpunkt (ISO datetime)"],
                ["metod", "Metod"],
                ["projekt", "Projekt"],
                [
                  "anvandarBegransningLicensText",
                  "Användarbegränsning licens text",
                ],
                ["syfte", "Syfte"],
                ["beskrivning", "Beskrivning"],
              ] as const
            ).map(([key, label]) => (
              <TextField
                key={key}
                label={label}
                value={form[key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                multiline={
                  key === "syfte" ||
                  key === "beskrivning" ||
                  key === "anvandarBegransningLicensText"
                }
                minRows={
                  key === "syfte" ||
                  key === "beskrivning" ||
                  key === "anvandarBegransningLicensText"
                    ? 2
                    : undefined
                }
              />
            ))}
          </Box>
          <Box sx={{ mt: 2, display: "flex", gap: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.tidsperiod}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      tidsperiod: e.target.checked,
                    }))
                  }
                />
              }
              label="Tidsperiod"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.anvandarBegransningLicens}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      anvandarBegransningLicens: e.target.checked,
                    }))
                  }
                />
              }
              label="Användarbegränsning licens"
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
        <DialogTitle>Ta bort metadata</DialogTitle>
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
