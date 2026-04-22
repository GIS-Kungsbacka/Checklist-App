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
  Divider,
  FormControlLabel,
  Link,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ColumnsPanelTrigger,
  DataGrid,
  ExportCsv,
  ExportPrint,
  FilterPanelTrigger,
  GridActionsCellItem,
  type GridColDef,
  type GridDensity,
  type GridRenderCellParams,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import { GRID_DEFAULT_LOCALE_TEXT } from "../../../constants/sv";
import {
  useDeleteManagementPlan,
  useManagementPlans,
  useUpdateManagementPlan,
} from "../../hooks/useManagementPlan";
import type {
  ManagementPlan,
  UpdateManagementPlanDto,
} from "../../types/managementPlan";
import { useGridPrefs } from "../../utils/gridPrefs";
import { buildArendeUrl, useRuntimeConfig } from "../../utils/runtimeConfig";
import { toast } from "react-toastify";

const toArray = (value: string): string[] | undefined => {
  const values = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
};

const fromArray = (value?: string[]): string => (value ?? []).join(", ");
const GRID_PREFS_STORAGE_KEY = "management-plan-grid-prefs";
const defaultColumnVisibility = {
  gid: true,
  namn: true,
  arendeNummberOpenE: true,
  bestallareNamn: true,
  bestallareEpost: false,
  sakerhetsklass: false,
  datakallaTyp: false,
  schemaNamn: false,
  titel: false,
  dataAgare: false,
  dataForvaltare: false,
  dataAdministrator: false,
  dataKonsument: false,
  redigeringsKalla: false,
  oppnaData: false,
  dokumentSkUrl: false,
  dokuementInfoUrl: false,
  ovrigInformation: false,
  kritiskDatamangd: false,
  arkivering: false,
  arkiveringTidpunkt: false,
  publicerad: false,
  publiceradOppnaData: false,
  atkomst: false,
  integration: false,
  status: true,
  handlaggare: true,
  forvaltningsplanVersion: false,
  skapadTidPunkt: false,
  skapadAv: false,
  andradTidPunkt: false,
  andradAv: false,
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
  arendeNummberOpenE: string;
  bestallareNamn: string;
  bestallareEpost: string;
  sakerhetsklass: string;
  datakallaTyp: string;
  schemaNamn: string;
  namn: string;
  titel: string;
  dataAgare: string;
  dataForvaltare: string;
  dataAdministrator: string;
  dataKonsument: string;
  redigeringsKalla: string;
  oppnaData: boolean;
  dokumentSkUrl: string;
  dokuementInfoUrl: string;
  ovrigInformation: string;
  kritiskDatamangd: boolean;
  arkivering: string;
  arkiveringTidpunkt: string;
  publicerad: string;
  publiceradOppnaData: boolean;
  atkomst: string;
  integration: string;
  status: string;
  handlaggare: string;
  forvaltningsplanVersion: string;
  skapadTidPunkt: string;
  skapadAv: string;
  andradTidPunkt: string;
  andradAv: string;
};

const emptyForm: ManagementPlanFormState = {
  arendeNummberOpenE: "",
  bestallareNamn: "",
  bestallareEpost: "",
  sakerhetsklass: "",
  datakallaTyp: "",
  schemaNamn: "",
  namn: "",
  titel: "",
  dataAgare: "",
  dataForvaltare: "",
  dataAdministrator: "",
  dataKonsument: "",
  redigeringsKalla: "",
  oppnaData: false,
  dokumentSkUrl: "",
  dokuementInfoUrl: "",
  ovrigInformation: "",
  kritiskDatamangd: false,
  arkivering: "",
  arkiveringTidpunkt: "",
  publicerad: "",
  publiceradOppnaData: false,
  atkomst: "",
  integration: "",
  status: "",
  handlaggare: "",
  forvaltningsplanVersion: "",
  skapadTidPunkt: "",
  skapadAv: "",
  andradTidPunkt: "",
  andradAv: "",
};

const toFormState = (item: ManagementPlan): ManagementPlanFormState => ({
  arendeNummberOpenE: item.arendeNummberOpenE ?? "",
  bestallareNamn: item.bestallareNamn ?? "",
  bestallareEpost: item.bestallareEpost ?? "",
  sakerhetsklass: item.sakerhetsklass ?? "",
  datakallaTyp: item.datakallaTyp ?? "",
  schemaNamn: item.schemaNamn ?? "",
  namn: item.namn ?? "",
  titel: item.titel ?? "",
  dataAgare: item.dataAgare ?? "",
  dataForvaltare: item.dataForvaltare ?? "",
  dataAdministrator: fromArray(item.dataAdministrator),
  dataKonsument: fromArray(item.dataKonsument),
  redigeringsKalla: fromArray(item.redigeringsKalla),
  oppnaData: item.oppnaData ?? false,
  dokumentSkUrl: item.dokumentSkUrl ?? "",
  dokuementInfoUrl: item.dokuementInfoUrl ?? "",
  ovrigInformation: item.ovrigInformation ?? "",
  kritiskDatamangd: item.kritiskDatamangd ?? false,
  arkivering: item.arkivering ?? "",
  arkiveringTidpunkt: item.arkiveringTidpunkt ?? "",
  publicerad: fromArray(item.publicerad),
  publiceradOppnaData: item.publiceradOppnaData ?? false,
  atkomst: fromArray(item.atkomst),
  integration: fromArray(item.integration),
  status: item.status ?? "",
  handlaggare: item.handlaggare ?? "",
  forvaltningsplanVersion: item.forvaltningsplanVersion ?? "",
  skapadTidPunkt: item.skapadTidPunkt ?? "",
  skapadAv: item.skapadAv ?? "",
  andradTidPunkt: item.andradTidPunkt ?? "",
  andradAv: item.andradAv ?? "",
});

const toDto = (state: ManagementPlanFormState): UpdateManagementPlanDto => ({
  arendeNummberOpenE: state.arendeNummberOpenE || undefined,
  bestallareNamn: state.bestallareNamn || undefined,
  bestallareEpost: state.bestallareEpost || undefined,
  sakerhetsklass: state.sakerhetsklass || undefined,
  datakallaTyp: state.datakallaTyp || undefined,
  schemaNamn: state.schemaNamn || undefined,
  namn: state.namn || undefined,
  titel: state.titel || undefined,
  dataAgare: state.dataAgare || undefined,
  dataForvaltare: state.dataForvaltare || undefined,
  dataAdministrator: toArray(state.dataAdministrator),
  dataKonsument: toArray(state.dataKonsument),
  redigeringsKalla: toArray(state.redigeringsKalla),
  oppnaData: state.oppnaData,
  dokumentSkUrl: state.dokumentSkUrl || undefined,
  dokuementInfoUrl: state.dokuementInfoUrl || undefined,
  ovrigInformation: state.ovrigInformation || undefined,
  kritiskDatamangd: state.kritiskDatamangd,
  arkivering: state.arkivering || undefined,
  arkiveringTidpunkt: state.arkiveringTidpunkt || undefined,
  publicerad: toArray(state.publicerad),
  publiceradOppnaData: state.publiceradOppnaData,
  atkomst: toArray(state.atkomst),
  integration: toArray(state.integration),
  status: state.status || undefined,
  handlaggare: state.handlaggare || undefined,
  forvaltningsplanVersion: state.forvaltningsplanVersion || undefined,
  skapadTidPunkt: state.skapadTidPunkt || undefined,
  skapadAv: state.skapadAv || undefined,
  andradTidPunkt: state.andradTidPunkt || undefined,
  andradAv: state.andradAv || undefined,
});

export default function ManagementPlanPage({
  mode,
}: {
  mode: "light" | "dark";
}) {
  const { config } = useRuntimeConfig();
  const managementPlanCatalogBaseUrl = config.managementPlanBaseUrl;

  const { data = [], isLoading, isError } = useManagementPlans();
  const updateMutation = useUpdateManagementPlan();
  const deleteMutation = useDeleteManagementPlan();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<ManagementPlan | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<ManagementPlan | null>(
    null
  );
  const [form, setForm] = React.useState<ManagementPlanFormState>(emptyForm);
  const {
    columnVisibilityModel,
    setColumnVisibilityModel,
    density,
    setDensity,
    pageSize,
    setPageSize,
  } = useGridPrefs(GRID_PREFS_STORAGE_KEY, {
    columnVisibilityModel: defaultColumnVisibility,
    density: "standard",
    pageSize: 10,
  });

  const [paginationModel, setPaginationModel] = React.useState(() => ({
    page: 0,
    pageSize,
  }));

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
    {
      field: "arendeNummberOpenE",
      headerName: "Ärendenummer",
      minWidth: 150,
      flex: 1,
      hideable: false,
      renderCell: (params: GridRenderCellParams<ManagementPlan>) => {
        const value = String(params.value ?? "").trim();
        if (!value) {
          return "-";
        }

        const href = buildArendeUrl(managementPlanCatalogBaseUrl, value);
        if (!href) return value;
        return (
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            {value}
          </Link>
        );
      },
    },
    { field: "namn", headerName: "Namn", minWidth: 180, flex: 1 },
    { field: "titel", headerName: "Titel", minWidth: 150, flex: 1 },
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
    { field: "schemaNamn", headerName: "Schema", minWidth: 140, flex: 0.8 },
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
      field: "oppnaData",
      headerName: "Öppna data",
      minWidth: 120,
      flex: 0.8,
      type: "boolean",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Ja" : params.value === false ? "Nej" : "-",
    },
    {
      field: "dokumentSkUrl",
      headerName: "Dokument SK URL",
      minWidth: 190,
      flex: 1,
    },
    {
      field: "dokuementInfoUrl",
      headerName: "Dokument info URL",
      minWidth: 190,
      flex: 1,
    },
    {
      field: "ovrigInformation",
      headerName: "Övrig information",
      minWidth: 200,
      flex: 1.1,
    },
    {
      field: "kritiskDatamangd",
      headerName: "Kritisk datamängd",
      minWidth: 150,
      flex: 0.9,
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
      field: "publicerad",
      headerName: "Publicerad",
      minWidth: 170,
      flex: 1,
      valueGetter: (_value, row) => row.publicerad?.join(", ") ?? "-",
    },
    {
      field: "publiceradOppnaData",
      headerName: "Publicerad öppna data",
      minWidth: 170,
      flex: 1,
      type: "boolean",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Ja" : params.value === false ? "Nej" : "-",
    },
    {
      field: "atkomst",
      headerName: "Åtkomst",
      minWidth: 180,
      flex: 1,
      valueGetter: (_value, row) => row.atkomst?.join(", ") ?? "-",
    },
    {
      field: "integration",
      headerName: "Integration",
      minWidth: 180,
      flex: 1,
      valueGetter: (_value, row) => row.integration?.join(", ") ?? "-",
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
    { field: "skapadAv", headerName: "Skapad av", minWidth: 150, flex: 1 },
    {
      field: "andradTidPunkt",
      headerName: "Ändrad tidpunkt",
      minWidth: 170,
      flex: 1,
    },
    { field: "andradAv", headerName: "Ändrad av", minWidth: 150, flex: 1 },
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

  const isSubmitting = updateMutation.isPending || deleteMutation.isPending;

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
          Här skapas och listas förvaltningsplaner automatiskt som kommer från
          e-tjänsten. Redigera eller ta bort objekt. <br /> Klicka på
          ärendenummer för att öppna förvaltningsplanen i metadatakatalogen.
        </Typography>
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
          onColumnVisibilityModelChange={(model) =>
            setColumnVisibilityModel(model)
          }
          rows={rows}
          columns={columns}
          localeText={GRID_DEFAULT_LOCALE_TEXT}
          pageSizeOptions={[10, 25, 50]}
          density={density}
          showToolbar
          disableRowSelectionOnClick
          slotProps={{
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
          }}
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
            sorting: { sortModel: [{ field: "gid", sort: "asc" }] },
          }}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => {
            setPaginationModel(model);
            if (model.pageSize !== pageSize) setPageSize(model.pageSize);
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
              color: mode === "light" ? "grey" : "white",
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
        onClose={() => (openEdit ? setOpenEdit(null) : setOpenCreate(false))}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {openCreate
            ? "Skapa förvaltningsplan"
            : `Redigera förvaltningsplan ${openEdit?.arendeNummberOpenE}`}
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
                ["arendeNummberOpenE", "Ärendenummer"],
                ["bestallareNamn", "Beställare namn"],
                ["bestallareEpost", "Beställare e-post"],
                ["sakerhetsklass", "Säkerhetsklass"],
                ["datakallaTyp", "Datakälla typ"],
                ["schemaNamn", "Schema"],
                ["dataAgare", "Dataägare"],
                ["dataForvaltare", "Dataförvaltare"],
                ["dataAdministrator", "Dataadministratör (kommaseparerat)"],
                ["dataKonsument", "Datakonsument (kommaseparerat)"],
                ["redigeringsKalla", "Redigeringskälla (kommaseparerat)"],
                ["dokumentSkUrl", "Dokument SK URL"],
                ["dokuementInfoUrl", "Dokument info URL"],
                ["arkivering", "Arkivering"],
                ["arkiveringTidpunkt", "Arkivering tidpunkt"],
                ["publicerad", "Publicerad (kommaseparerat)"],
                ["atkomst", "Åtkomst (kommaseparerat)"],
                ["integration", "Integration (kommaseparerat)"],
                ["status", "Status"],
                ["handlaggare", "Handläggare"],
                ["forvaltningsplanVersion", "Förvaltningsplan version"],
                ["skapadTidPunkt", "Skapad tidpunkt (ISO datetime)"],
                ["skapadAv", "Skapad av"],
                ["andradTidPunkt", "Ändrad tidpunkt (ISO datetime)"],
                ["andradAv", "Ändrad av"],
                ["ovrigInformation", "Övrig information"],
              ] as const
            ).map(([key, label]) => (
              <TextField
                key={key}
                label={label}
                value={form[key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                multiline={key === "ovrigInformation"}
                minRows={key === "ovrigInformation" ? 2 : undefined}
              />
            ))}
          </Box>
          <Divider sx={{ mt: 3 }} />
          <Box sx={{ mt: 2, display: "flex", gap: 3, flexWrap: "wrap" }}>
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.kritiskDatamangd}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      kritiskDatamangd: e.target.checked,
                    }))
                  }
                />
              }
              label="Kritisk datamängd"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.publiceradOppnaData}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      publiceradOppnaData: e.target.checked,
                    }))
                  }
                />
              }
              label="Publicerad öppna data"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              openEdit ? setOpenEdit(null) : setOpenCreate(false)
            }
          >
            Avbryt
          </Button>
          <Button
            variant="contained"
            disabled={isSubmitting}
            onClick={() => {
              const dto = toDto(form);
              if (!openEdit) {
                return;
              }
              updateMutation.mutate(
                { gid: openEdit.gid, data: dto },
                {
                  onSuccess: () => {
                    setOpenEdit(null);
                    toast.success("Ändringar sparade.");
                  },
                  onError: (err) => {
                    const message =
                      err instanceof Error
                        ? err.message
                        : "Kunde inte spara. Försök igen.";
                    toast.error(message);
                  },
                }
              );
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
            {deleteItem?.arendeNummberOpenE ? (
              <> (ärendenummer: {deleteItem.arendeNummberOpenE})</>
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
              if (!deleteItem) {
                return;
              }
              deleteMutation.mutate(deleteItem.gid, {
                onSuccess: () => {
                  setDeleteItem(null);
                  toast.success("Objekt borttagen.");
                },
                onError: (err) => {
                  const message =
                    err instanceof Error
                      ? err.message
                      : "Kunde inte ta bort. Försök igen.";
                  toast.error(message);
                },
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
