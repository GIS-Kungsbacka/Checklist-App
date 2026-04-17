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
  useDeleteMetadata,
  useMetadatas,
  useUpdateMetadata,
} from "../../hooks/useMetadata";
import { useManagementPlans } from "../../hooks/useManagementPlan";
import type { Metadata, UpdateMetadataDto } from "../../types/metadata";
import { useGridPrefs } from "../../utils/gridPrefs";
import appConfig from "../../config.json";

const toArray = (value: string): string[] | undefined => {
  const values = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
};

const fromArray = (value?: string[]): string => (value ?? []).join(", ");
const GRID_PREFS_STORAGE_KEY = "metadata-grid-prefs";
const defaultColumnVisibility = {
  gid: true,
  namn: true,
  arendeNummerOpenE: true,
  bestallareNamn: true,
  bestallareEpost: false,
  titel: false,
  sakerhetsKlass: false,
  dataKallaTyp: false,
  schemaNamn: false,
  beskrivning: false,
  ursprung: false,
  syfte: false,
  metod: false,
  metodUrl: false,
  projekt: false,
  geografiskBegransning: false,
  uppdateringsFrekvens: false,
  fullstandighet: false,
  skalniva: false,
  nyckelOrd: false,
  kategori: true,
  tidsperiod: false,
  tidsperiodStartdatum: false,
  tidsperiodSlutdatum: false,
  tidsUpplosning: false,
  skapelseDatum: false,
  anvandarBegransningLicens: false,
  anvandarBegransningLicensText: false,
  relateradeResurser: false,
  kolumnBeskrivningUrl: false,
  status: true,
  handlaggare: true,
  metaDataVersion: false,
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
              options={{ utf8WithBom: true, fileName: "Metadata" }}
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

type MetadataFormState = {
  arendeNummerOpenE: string;
  bestallareNamn: string;
  bestallareEpost: string;
  sakerhetsKlass: string;
  dataKallaTyp: string;
  schemaNamn: string;
  namn: string;
  beskrivning: string;
  ursprung: string;
  syfte: string;
  metod: string;
  metodUrl: string;
  projekt: string;
  geografiskBegransning: string;
  uppdateringsFrekvens: string;
  fullstandighet: string;
  skalniva: string;
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
  kolumnBeskrivningUrl: string;
  status: string;
  handlaggare: string;
  metaDataVersion: string;
};

const emptyForm: MetadataFormState = {
  arendeNummerOpenE: "",
  bestallareNamn: "",
  bestallareEpost: "",
  sakerhetsKlass: "",
  dataKallaTyp: "",
  schemaNamn: "",
  namn: "",
  beskrivning: "",
  ursprung: "",
  syfte: "",
  metod: "",
  metodUrl: "",
  projekt: "",
  geografiskBegransning: "",
  uppdateringsFrekvens: "",
  fullstandighet: "",
  skalniva: "",
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
  kolumnBeskrivningUrl: "",
  status: "",
  handlaggare: "",
  metaDataVersion: "",
};

const toFormState = (item: Metadata): MetadataFormState => ({
  arendeNummerOpenE: item.arendeNummerOpenE ?? "",
  bestallareNamn: item.bestallareNamn ?? "",
  bestallareEpost: item.bestallareEpost ?? "",
  sakerhetsKlass: item.sakerhetsKlass ?? "",
  dataKallaTyp: item.dataKallaTyp ?? "",
  schemaNamn: item.schemaNamn ?? "",
  namn: item.namn ?? "",
  beskrivning: item.beskrivning ?? "",
  ursprung: fromArray(item.ursprung),
  syfte: item.syfte ?? "",
  metod: item.metod ?? "",
  metodUrl: item.metodUrl ?? "",
  projekt: item.projekt ?? "",
  geografiskBegransning: fromArray(item.geografiskBegransning),
  uppdateringsFrekvens: item.uppdateringsFrekvens ?? "",
  fullstandighet: item.fullstandighet ?? "",
  skalniva: item.skalniva ?? "",
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
  kolumnBeskrivningUrl: item.kolumnBeskrivningUrl ?? "",
  status: item.status ?? "",
  handlaggare: item.handlaggare ?? "",
  metaDataVersion: item.metaDataVersion ?? "",
});

const toDto = (state: MetadataFormState): UpdateMetadataDto => ({
  arendeNummerOpenE: state.arendeNummerOpenE || undefined,
  bestallareNamn: state.bestallareNamn || undefined,
  bestallareEpost: state.bestallareEpost || undefined,
  sakerhetsKlass: state.sakerhetsKlass || undefined,
  dataKallaTyp: state.dataKallaTyp || undefined,
  schemaNamn: state.schemaNamn || undefined,
  namn: state.namn || undefined,
  beskrivning: state.beskrivning || undefined,
  ursprung: toArray(state.ursprung),
  syfte: state.syfte || undefined,
  metod: state.metod || undefined,
  metodUrl: state.metodUrl || undefined,
  projekt: state.projekt || undefined,
  geografiskBegransning: toArray(state.geografiskBegransning),
  uppdateringsFrekvens: state.uppdateringsFrekvens || undefined,
  fullstandighet: state.fullstandighet || undefined,
  skalniva: state.skalniva || undefined,
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
  kolumnBeskrivningUrl: state.kolumnBeskrivningUrl || undefined,
  status: state.status || undefined,
  handlaggare: state.handlaggare || undefined,
  metaDataVersion: state.metaDataVersion || undefined,
});

export default function MetadataPage({ mode }: { mode: "light" | "dark" }) {
  const metadataCatalogBaseUrl = appConfig.metadataBaseUrl;

  const { data = [], isLoading, isError } = useMetadatas();
  const { data: managementPlans = [] } = useManagementPlans();
  const updateMutation = useUpdateMetadata();
  const deleteMutation = useDeleteMetadata();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<Metadata | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<Metadata | null>(null);
  const [form, setForm] = React.useState<MetadataFormState>(emptyForm);
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

  const titelByArendeNummer = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const plan of managementPlans) {
      const key = String(plan.arendeNummberOpenE ?? "").trim();
      const titel = String(plan.titel ?? "").trim();
      if (!key || !titel || map.has(key)) {
        continue;
      }
      map.set(key, titel);
    }
    return map;
  }, [managementPlans]);

  const columns: GridColDef<Metadata>[] = [
    {
      field: "gid",
      headerName: "GID",
      width: 90,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ pl: 2 }}>{params.value}</Box>
      ),
    },
    {
      field: "arendeNummerOpenE",
      headerName: "Ärendenummer",
      minWidth: 150,
      flex: 1,
      hideable: false,
      renderCell: (params: GridRenderCellParams<Metadata>) => {
        const value = String(params.value ?? "").trim();
        if (!value) {
          return "-";
        }

        const href = `${metadataCatalogBaseUrl}/${encodeURIComponent(value)}`;
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
    {
      field: "titel",
      headerName: "Titel",
      minWidth: 150,
      flex: 1,
      valueGetter: (_value, row) => {
        const key = String(row.arendeNummerOpenE ?? "").trim();
        return key ? titelByArendeNummer.get(key) ?? "-" : "-";
      },
    },
    {
      field: "bestallareNamn",
      headerName: "Beställare namn",
      minWidth: 160,
      flex: 1,
    },
    {
      field: "bestallareEpost",
      headerName: "Beställare e-post",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "sakerhetsKlass",
      headerName: "Säkerhetsklass",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "dataKallaTyp",
      headerName: "Datakälla typ",
      minWidth: 150,
      flex: 1,
    },
    { field: "schemaNamn", headerName: "Schema", minWidth: 140, flex: 0.8 },
    {
      field: "beskrivning",
      headerName: "Beskrivning",
      minWidth: 200,
      flex: 1.2,
    },
    {
      field: "ursprung",
      headerName: "Ursprung",
      minWidth: 180,
      flex: 1,
      valueGetter: (_value, row) => row.ursprung?.join(", ") ?? "-",
    },
    { field: "syfte", headerName: "Syfte", minWidth: 200, flex: 1.2 },
    { field: "metod", headerName: "Metod", minWidth: 140, flex: 0.9 },
    { field: "metodUrl", headerName: "Metod URL", minWidth: 180, flex: 1 },
    { field: "projekt", headerName: "Projekt", minWidth: 140, flex: 0.9 },
    {
      field: "geografiskBegransning",
      headerName: "Geografisk begränsning",
      minWidth: 220,
      flex: 1,
      valueGetter: (_value, row) =>
        row.geografiskBegransning?.join(", ") ?? "-",
    },
    {
      field: "uppdateringsFrekvens",
      headerName: "Uppdateringsfrekvens",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "fullstandighet",
      headerName: "Fullständighet",
      minWidth: 150,
      flex: 1,
    },
    { field: "skalniva", headerName: "Skalniva", minWidth: 140, flex: 0.8 },
    {
      field: "nyckelOrd",
      headerName: "Nyckelord",
      minWidth: 180,
      flex: 1,
      valueGetter: (_value, row) => row.nyckelOrd?.join(", ") ?? "-",
    },
    { field: "kategori", headerName: "Kategori", minWidth: 140, flex: 0.9 },
    {
      field: "tidsperiod",
      headerName: "Tidsperiod",
      minWidth: 120,
      flex: 0.7,
      type: "boolean",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Ja" : params.value === false ? "Nej" : "-",
    },
    {
      field: "tidsperiodStartdatum",
      headerName: "Tidsperiod start",
      minWidth: 150,
      flex: 0.9,
    },
    {
      field: "tidsperiodSlutdatum",
      headerName: "Tidsperiod slut",
      minWidth: 150,
      flex: 0.9,
    },
    {
      field: "tidsUpplosning",
      headerName: "Tidsupplösning",
      minWidth: 140,
      flex: 0.9,
    },
    {
      field: "skapelseDatum",
      headerName: "Skapelsedatum",
      minWidth: 140,
      flex: 0.9,
    },
    {
      field: "anvandarBegransningLicens",
      headerName: "Användarbegränsning licens",
      minWidth: 190,
      flex: 1,
      type: "boolean",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Ja" : params.value === false ? "Nej" : "-",
    },
    {
      field: "anvandarBegransningLicensText",
      headerName: "Licenstext",
      minWidth: 180,
      flex: 1.1,
    },
    {
      field: "relateradeResurser",
      headerName: "Relaterade resurser",
      minWidth: 200,
      flex: 1,
      valueGetter: (_value, row) => row.relateradeResurser?.join(", ") ?? "-",
    },
    {
      field: "kolumnBeskrivningUrl",
      headerName: "Kolumnbeskrivning URL",
      minWidth: 220,
      flex: 1,
    },
    { field: "status", headerName: "Status", minWidth: 140, flex: 0.9 },
    { field: "handlaggare", headerName: "Handläggare", minWidth: 150, flex: 1 },
    {
      field: "metaDataVersion",
      headerName: "Metadata version",
      minWidth: 150,
      flex: 0.9,
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
          <Alert severity="error">Kunde inte ladda metadata.</Alert>
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
          Här skapas och listas metadata automatiskt som kommer från e-tjänsten.
          Redigera eller ta bort objekt. <br /> Klicka på ärendenummer för att
          öppna geodatamängden i metadatakatalogen.
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
                ["arendeNummerOpenE", "Ärendenummer"],
                ["bestallareNamn", "Beställare namn"],
                ["bestallareEpost", "Beställare e-post"],
                ["sakerhetsKlass", "Säkerhetsklass"],
                ["dataKallaTyp", "Datakälla typ"],
                ["schemaNamn", "Schema"],
                ["kategori", "Kategori"],
                ["status", "Status"],
                ["handlaggare", "Handläggare"],
                ["metaDataVersion", "Metadata version"],
                ["ursprung", "Ursprung (kommaseparerat)"],
                [
                  "geografiskBegransning",
                  "Geografisk begränsning (kommaseparerat)",
                ],
                ["nyckelOrd", "Nyckelord (kommaseparerat)"],
                ["relateradeResurser", "Relaterade resurser (kommaseparerat)"],
                ["uppdateringsFrekvens", "Uppdateringsfrekvens"],
                ["fullstandighet", "Fullständighet"],
                ["skalniva", "Skalniva"],
                ["tidsUpplosning", "Tidsupplösning"],
                ["tidsperiodStartdatum", "Tidsperiod startdatum (YYYY-MM-DD)"],
                ["tidsperiodSlutdatum", "Tidsperiod slutdatum (YYYY-MM-DD)"],
                ["skapelseDatum", "Skapelsedatum (YYYY-MM-DD)"],
                ["metod", "Metod"],
                ["metodUrl", "Metod URL"],
                ["projekt", "Projekt"],
                ["kolumnBeskrivningUrl", "Kolumnbeskrivning URL"],
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
                { onSuccess: () => setOpenEdit(null) }
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
            {deleteItem?.arendeNummerOpenE ? (
              <> (ärendenummer: {deleteItem.arendeNummerOpenE})</>
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
