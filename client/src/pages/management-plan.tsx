import * as React from "react";
import {
  Box,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Typography,
  Menu,
  MenuItem,
  ListItemText,
  TextField,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridDensity,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  ExportCsv,
  ExportPrint,
} from "@mui/x-data-grid";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import CancelIcon from "@mui/icons-material/Cancel";

import { GRID_DEFAULT_LOCALE_TEXT } from "../../constants/sv";
import { useManagementPlan } from "../hooks/useManagementPlan";
import type { ManagementPlan } from "../types/management-plan";
import { useGridPrefs } from "../utils/gridPrefs";
import { useNavigate } from "react-router-dom";
const GRID_PREFS_STORAGE_KEY = "management-plan-default-prefs-dev";

const renderJaNej = (value: boolean | undefined) =>
  value ? "Ja" : value === false ? "Nej" : "-";

const buildSchemaKey = (schemaNamn?: string, namn?: string, gid?: number) => {
  const s = (schemaNamn ?? "").trim();
  const n = (namn ?? "").trim();
  if (s && n) return encodeURIComponent(`${s}_${n}`);
  if (n) return encodeURIComponent(n);
  if (s) return encodeURIComponent(s);
  return encodeURIComponent(String(gid ?? ""));
};

const ColumnsToolbarButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof ToolbarButton>
>(function ColumnsToolbarButton(props, _ref) {
  return (
    <ToolbarButton aria-label="Columns" {...props}>
      <ViewColumnOutlinedIcon fontSize="small" />
    </ToolbarButton>
  );
});

function ManagementPlanToolbar({
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
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              setDensityAnchor(e.currentTarget)
            }
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
          render={(props: React.ComponentProps<typeof ToolbarButton>) => (
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
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              setExportAnchor(e.currentTarget)
            }
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
              options={{ utf8WithBom: true, fileName: "Förvaltningsplan" }}
              render={(props) => (
                <Box
                  component="button"
                  type="button"
                  onClick={props.onClick}
                  style={{
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <ListItemText primary="Exportera till CSV" />
                </Box>
              )}
            />
          </MenuItem>
          <MenuItem onClick={() => setExportAnchor(null)}>
            <ExportPrint
              render={(props) => (
                <Box
                  component="button"
                  type="button"
                  onClick={props.onClick}
                  style={{
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
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
                  placeholder="Sök…"
                  size="small"
                  sx={{
                    width: 1,
                    "& .MuiInputBase-root": {
                      height: 34,
                      fontSize: 13,
                    },
                  }}
                />
              )}
            />
            <QuickFilterClear
              edge="end"
              size="small"
              aria-label="Clear search"
              material={{ sx: { marginRight: -0.75 } }}
            >
              <CancelIcon fontSize="small" />
            </QuickFilterClear>
          </Box>
        </QuickFilter>
      </Box>
    </Toolbar>
  );
}

export default function ManagementPlan({
  mode,
}: { mode?: "light" | "dark" } = {}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    data: items = [],
    isLoading,
    isError,
    failureCount,
    isRefetchError,
  } = useManagementPlan();

  const {
    columnVisibilityModel,
    setColumnVisibilityModel,
    density,
    setDensity,
    pageSize,
    setPageSize,
  } = useGridPrefs(GRID_PREFS_STORAGE_KEY, {
    columnVisibilityModel: {
      gid: true,
      titel: true,
      namn: true,
      schemaNamn: true,
      datakallaTyp: true,
      forvaltningsplanVersion: true,
      forvaltningsplanModelversion: true,
      dataAgare: true,
      dataForvaltare: true,
      dataAdministrator: true,
      dataKonsument: true,
      oppnaData: true,
      publiceradOppnaData: true,
      redigeringsKalla: true,
      kritiskDatamangd: true,
      arkivering: true,
      arkiveringTidpunkt: true,
      ovrigInformation: true,
      bestallareNamn: true,
      bestallareEpost: true,
      handlaggare: true,
      arendeNummberOpenE: true,
      dokumentSkUrl: true,
      skapadTidPunkt: true,
      skapadAv: true,
      andradTidPunkt: true,
      andradAv: true,
    },
    density: "standard",
    pageSize: 25,
  });

  const [paginationModel, setPaginationModel] = React.useState(() => ({
    page: 0,
    pageSize,
  }));

  const showApiDown = failureCount > 0 || isRefetchError || isError;

  const columns: GridColDef<ManagementPlan>[] = [
    {
      field: "gid",
      headerName: "GID",
      minWidth: 110,
      flex: 0.6,
      hideable: false,
      renderCell: (params: GridRenderCellParams<ManagementPlan>) => (
        <Box sx={{ pl: 2 }}>{params.value}</Box>
      ),
    },
    {
      field: "titel",
      headerName: "Titel",
      minWidth: 200,
      flex: 1.2,
    },
    { field: "namn", headerName: "Namn", minWidth: 200, flex: 1.2 },
    { field: "schemaNamn", headerName: "Schema", minWidth: 160, flex: 0.9 },
    {
      field: "datakallaTyp",
      headerName: "Typ av datakälla",
      minWidth: 170,
      flex: 0.9,
    },
    {
      field: "forvaltningsplanVersion",
      headerName: "Version",
      minWidth: 120,
      flex: 0.7,
    },
    {
      field: "forvaltningsplanModelversion",
      headerName: "Modellversion",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "dataAgare",
      headerName: "Geodataägare",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "dataForvaltare",
      headerName: "Geodataförvaltare",
      minWidth: 190,
      flex: 1,
    },
    {
      field: "dataAdministrator",
      headerName: "Geodataadministratör",
      minWidth: 220,
      flex: 1.2,
      sortable: false,
      valueGetter: (_value, row) => row.dataAdministrator?.join(", ") ?? "",
    },
    {
      field: "dataKonsument",
      headerName: "Datakonsument",
      minWidth: 220,
      flex: 1.2,
      sortable: false,
      valueGetter: (_value, row) => row.dataKonsument?.join(", ") ?? "",
    },
    {
      field: "oppnaData",
      headerName: "Önskas publiceras som öppna data",
      minWidth: 240,
      flex: 1,
      type: "boolean",
      renderCell: (params: GridRenderCellParams<ManagementPlan>) =>
        renderJaNej(params.value),
    },
    {
      field: "publiceradOppnaData",
      headerName: "Publicerad som öppna data",
      minWidth: 220,
      flex: 1,
      type: "boolean",
      renderCell: (params: GridRenderCellParams<ManagementPlan>) =>
        renderJaNej(params.value),
    },
    {
      field: "redigeringsKalla",
      headerName: "Redigeringskälla",
      minWidth: 220,
      flex: 1.2,
      sortable: false,
      valueGetter: (_value, row) => row.redigeringsKalla?.join(", ") ?? "",
    },
    {
      field: "kritiskDatamangd",
      headerName: "Kritisk datamängd",
      minWidth: 170,
      flex: 0.9,
      type: "boolean",
      renderCell: (params: GridRenderCellParams<ManagementPlan>) =>
        renderJaNej(params.value),
    },
    {
      field: "arkivering",
      headerName: "Arkiveras/Gallras",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "arkiveringTidpunkt",
      headerName: "Tidpunkt för Arkivering/Gallring",
      minWidth: 240,
      flex: 1,
    },
    {
      field: "ovrigInformation",
      headerName: "Övrig information",
      minWidth: 240,
      flex: 1.4,
    },
    {
      field: "bestallareNamn",
      headerName: "Beställare",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "bestallareEpost",
      headerName: "Beställare E-post",
      minWidth: 200,
      flex: 1,
    },
    { field: "handlaggare", headerName: "Handläggare", minWidth: 170, flex: 1 },
    {
      field: "arendeNummberOpenE",
      headerName: "Ärendenummer (OpenE)",
      minWidth: 190,
      flex: 1,
    },
    {
      field: "dokumentSkUrl",
      headerName: "Dokument Informationsklassning",
      minWidth: 240,
      flex: 1.2,
    },
    {
      field: "skapadTidPunkt",
      headerName: "Skapad",
      minWidth: 160,
      flex: 0.9,
    },
    { field: "skapadAv", headerName: "Skapad av", minWidth: 160, flex: 0.9 },
    {
      field: "andradTidPunkt",
      headerName: "Ändrad",
      minWidth: 160,
      flex: 0.9,
    },
    { field: "andradAv", headerName: "Ändrad av", minWidth: 160, flex: 0.9 },
  ];

  const rows = items.map((item) => ({
    ...item,
    id: item.gid,
  }));

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

  if (showApiDown) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          Kunde inte ladda listan. Försöker igen…
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Box mb={2}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Förvaltningsplan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Uppföljning av ansvar, leverans och status.
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
          localeText={GRID_DEFAULT_LOCALE_TEXT}
          rows={rows}
          columns={columns}
          checkboxSelection={false}
          pageSizeOptions={[10, 25, 50]}
          pagination
          disableRowSelectionOnClick
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => {
            setPaginationModel(model);
            if (model.pageSize !== pageSize) setPageSize(model.pageSize);
          }}
          onRowClick={(params) => {
            const gid = (params.row as ManagementPlan | undefined)?.gid;
            if (gid == null) return;
            const row = params.row as ManagementPlan;
            const key = buildSchemaKey(row.schemaNamn, row.namn, row.gid);
            navigate(`/forvaltningsplan/${key}`);
          }}
          density={density}
          showToolbar
          slots={{
            toolbar: (props: unknown) => (
              <ManagementPlanToolbar
                {...(props as Record<string, unknown>)}
                density={density}
                onDensityChange={setDensity}
              />
            ),
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-row": {
              cursor: "pointer",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 600 },
            '& .MuiDataGrid-columnHeader[data-field="gid"] .MuiDataGrid-columnHeaderTitleContainer':
              { pl: 1 },
            "& .MuiDataGrid-columnSeparator": {
              color:
                (mode ?? theme.palette.mode) === "light" ? "grey" : "white",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px dotted",
              borderColor: "divider",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within":
              { outline: "none" },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid",
              borderColor: "divider",
            },
          }}
        />
      </Paper>
    </Container>
  );
}
