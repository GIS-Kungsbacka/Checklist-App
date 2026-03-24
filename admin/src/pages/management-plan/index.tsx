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
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";
import {
  ColumnsPanelTrigger,
  DataGrid,
  ExportCsv,
  ExportPrint,
  FilterPanelTrigger,
  GridActionsCellItem,
  type GridDensity,
  type GridColDef,
  type GridRenderCellParams,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
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
const COLUMN_VISIBILITY_STORAGE_KEY = "management-plan-column-visibility";
const defaultColumnVisibility = {
  gid: true,
  namn: true,
  arendeNummer: true,
  bestallareNamn: true,
  bestallareEpost: false,
  sakerhetsklass: false,
  datakallaTyp: false,
  schema: false,
  titel: false,
  dataAgare: false,
  dataForvaltare: false,
  dataAdministrator: false,
  dataKonsument: false,
  redigeringsKalla: false,
  publicering: false,
  oppnaData: false,
  arkivering: false,
  arkiveringTidpunkt: false,
  atkomst: false,
  status: true,
  handlaggare: true,
  forvaltningsplanVersion: false,
  skapadTidPunkt: false,
  actions: true,
};

const ColumnsToolbarButton = React.forwardRef(function ColumnsToolbarButton(
  props,
  _ref
) {
  return (
    <Tooltip title="Kolumner">
      <ToolbarButton aria-label="Columns" {...props}>
        <ViewColumnOutlinedIcon fontSize="small" />
      </ToolbarButton>
    </Tooltip>
  );
});

function GridToolbar({
  density,
  onDensityChange,
}: {
  density: GridDensity;
  onDensityChange: (d: GridDensity) => void;
}) {
  const [exportAnchor, setExportAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const exportOpen = Boolean(exportAnchor);
  const [densityAnchor, setDensityAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const densityOpen = Boolean(densityAnchor);

  return (
    <Toolbar aria-label="Grid toolbar">
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0.5,
          px: 1.5,
          py: 1,
          minHeight: 52,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tooltip title="Täthet">
          <ToolbarButton
            aria-label="Density"
            onClick={(e) => setDensityAnchor(e.currentTarget)}
          >
            <DensityMediumOutlinedIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>
        <Menu
          anchorEl={densityAnchor}
          open={densityOpen}
          onClose={() => setDensityAnchor(null)}
        >
          {(["compact", "standard", "comfortable"] as GridDensity[]).map(
            (d) => (
              <MenuItem
                key={d}
                selected={density === d}
                onClick={() => {
                  onDensityChange(d);
                  setDensityAnchor(null);
                }}
              >
                <ListItemText
                  primary={
                    d === "compact"
                      ? "Kompakt"
                      : d === "standard"
                      ? "Standard"
                      : "Komfortabelt"
                  }
                />
              </MenuItem>
            )
          )}
        </Menu>

        <ColumnsPanelTrigger render={<ColumnsToolbarButton />} />
        <FilterPanelTrigger
          render={(props) => (
            <Tooltip title="Filtrera">
              <ToolbarButton aria-label="Filter" {...props}>
                <FilterAltOutlinedIcon fontSize="small" />
              </ToolbarButton>
            </Tooltip>
          )}
        />

        <Tooltip title="Exportera">
          <ToolbarButton
            aria-label="Export"
            onClick={(e) => setExportAnchor(e.currentTarget)}
          >
            <DownloadOutlinedIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>
        <Menu
          anchorEl={exportAnchor}
          open={exportOpen}
          onClose={() => setExportAnchor(null)}
        >
          <MenuItem onClick={() => setExportAnchor(null)}>
            <ExportCsv
              options={{ utf8WithBom: true, fileName: "Forvaltningsplan" }}
              render={(props) => (
                <Box component="button" type="button" onClick={props.onClick}>
                  <ListItemText primary="Exportera till CSV" />
                </Box>
              )}
            />
          </MenuItem>
          <MenuItem onClick={() => setExportAnchor(null)}>
            <ExportPrint
              render={(props) => (
                <Box component="button" type="button" onClick={props.onClick}>
                  <ListItemText primary="Skriv ut" />
                </Box>
              )}
            />
          </MenuItem>
        </Menu>

        <QuickFilter defaultExpanded={false}>
          <Box
            sx={{ ml: 1, display: "flex", alignItems: "center", width: 260 }}
          >
            <QuickFilterControl
              render={({ ref, ...props }) => (
                <TextField
                  {...props}
                  inputRef={ref}
                  aria-label="Search"
                  placeholder="Sök..."
                  size="small"
                  sx={{
                    width: 1,
                    "& .MuiInputBase-root": { height: 34, fontSize: 13 },
                  }}
                />
              )}
            />
            <QuickFilterClear edge="end" size="small" aria-label="Clear search">
              <CancelIcon fontSize="small" />
            </QuickFilterClear>
          </Box>
        </QuickFilter>
      </Box>
    </Toolbar>
  );
}

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
  const [density, setDensity] = React.useState<GridDensity>("standard");
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState(
    () => {
      try {
        const saved = localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultColumnVisibility;
      } catch {
        return defaultColumnVisibility;
      }
    }
  );

  React.useEffect(() => {
    try {
      localStorage.setItem(
        COLUMN_VISIBILITY_STORAGE_KEY,
        JSON.stringify(columnVisibilityModel)
      );
    } catch {}
  }, [columnVisibilityModel]);

  const rows = React.useMemo(
    () =>
      [...data]
        .sort((a, b) => a.gid - b.gid)
        .map((item) => ({ ...item, id: item.gid })),
    [data]
  );

  const columns: GridColDef<ManagementPlan>[] = [
    {
      field: "gid",
      headerName: "GID",
      width: 90,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ pl: 2 }}>{params.value}</Box>
      ),
    },
    { field: "namn", headerName: "Namn", minWidth: 180, flex: 1 },
    {
      field: "arendeNummer",
      headerName: "Ärendenummer",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "bestallareNamn",
      headerName: "Beställare namn",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "bestallareEpost",
      headerName: "Beställare e-post",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "sakerhetsklass",
      headerName: "Säkerhetsklass",
      minWidth: 150,
      flex: 0.9,
    },
    {
      field: "datakallaTyp",
      headerName: "Datakälla typ",
      minWidth: 150,
      flex: 1,
    },
    { field: "schema", headerName: "Schema", minWidth: 140, flex: 0.8 },
    { field: "titel", headerName: "Titel", minWidth: 150, flex: 1 },
    { field: "dataAgare", headerName: "Dataägare", minWidth: 150, flex: 1 },
    {
      field: "dataForvaltare",
      headerName: "Dataförvaltare",
      minWidth: 160,
      flex: 1,
    },
    {
      field: "dataAdministrator",
      headerName: "Dataadministratör",
      minWidth: 180,
      flex: 1,
      valueGetter: (_value, row) => row.dataAdministrator?.join(", ") ?? "-",
    },
    {
      field: "dataKonsument",
      headerName: "Datakonsument",
      minWidth: 180,
      flex: 1,
      valueGetter: (_value, row) => row.dataKonsument?.join(", ") ?? "-",
    },
    {
      field: "redigeringsKalla",
      headerName: "Redigeringskälla",
      minWidth: 180,
      flex: 1,
      valueGetter: (_value, row) => row.redigeringsKalla?.join(", ") ?? "-",
    },
    {
      field: "publicering",
      headerName: "Publicering",
      minWidth: 140,
      flex: 0.9,
    },
    {
      field: "oppnaData",
      headerName: "Öppna data",
      minWidth: 120,
      flex: 0.8,
      type: "boolean",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Ja" : params.value === false ? "Nej" : "-",
    },
    { field: "arkivering", headerName: "Arkivering", minWidth: 140, flex: 0.9 },
    {
      field: "arkiveringTidpunkt",
      headerName: "Arkivering tidpunkt",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "atkomst",
      headerName: "Åtkomst",
      minWidth: 180,
      flex: 1,
      valueGetter: (_value, row) => row.atkomst?.join(", ") ?? "-",
    },
    { field: "status", headerName: "Status", minWidth: 140, flex: 1 },
    { field: "handlaggare", headerName: "Handläggare", minWidth: 150, flex: 1 },
    {
      field: "forvaltningsplanVersion",
      headerName: "Förvaltningsplan version",
      minWidth: 190,
      flex: 1,
    },
    {
      field: "skapadTidPunkt",
      headerName: "Skapad tidpunkt",
      minWidth: 170,
      flex: 1,
    },
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
    <Container maxWidth="xl" sx={{ mt: { xs: 1, md: 4 }, mb: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="body2" fontWeight={600}>
          Hantera förvaltningsplan med redigera och ta bort.
        </Typography>
        {/* <Button
          variant="contained"
          onClick={() => {
            setForm(emptyForm);
            setOpenCreate(true);
          }}
        >
          Skapa ny rad
        </Button> */}
      </Box>

      <Paper
        elevation={0}
        sx={{
          height: { xs: 300, md: 400, lg: 500, xl: 700 },
          width: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <DataGrid
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={setColumnVisibilityModel}
          rows={rows}
          columns={columns}
          localeText={GRID_DEFAULT_LOCALE_TEXT}
          pageSizeOptions={[10, 25, 50]}
          density={density}
          showToolbar
          slots={{
            toolbar: (props) => (
              <GridToolbar
                {...props}
                density={density}
                onDensityChange={setDensity}
              />
            ),
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "gid", sort: "asc" }] },
          }}
          sx={{
            border: 0,

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 600 },
            '& .MuiDataGrid-columnHeader[data-field="gid"] .MuiDataGrid-columnHeaderTitleContainer':
              {
                pl: 1,
              },
            "& .MuiDataGrid-columnSeparator": {
              display: "block",
              color: "divider",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px dotted",
              borderColor: "divider",
            },

            "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox":
              {
                px: 1,
              },

            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within":
              {
                outline: "none",
              },

            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid",
              borderColor: "divider",
            },
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
        <DialogTitle sx={{ color: "error" }}>Ta bort post</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Åtgärden kan inte ångras.
          </Alert>
          <Typography>
            Vill du ta bort posten med GID <strong>{deleteItem?.gid}</strong>
            {deleteItem?.arendeNummer ? (
              <> (ärendenummer: {deleteItem.arendeNummer})</>
            ) : null}
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
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
