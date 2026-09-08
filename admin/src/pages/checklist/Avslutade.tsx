import * as React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { Undo } from "@mui/icons-material";
import { useChecklists, useUpdateChecklist } from "../../hooks/useChecklist";
import type { Checklist, UpdateChecklistDto } from "../../types/checklist";
import { getPrioritetChipColor } from "./checklist-data-grid";
import { useNavigate } from "react-router-dom";
import { useGridPrefs } from "../../utils/gridPrefs";
import { toast } from "react-toastify";
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
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import CancelIcon from "@mui/icons-material/Cancel";

const GRID_PREFS_STORAGE_KEY = "avslutade-default-prefs-dev-admin";
const defaultColumnVisibility = {
  gid: true,
  arendenummerArtvise: true,
  dataunderlag: false,
  dataadministrator: true,
  nyttjandeInterntExternt: true,
  leveransArbetstimmar: true,
  kategori: false,
  kategoriTyp: true,
  prioritet: true,
  antagenJaNej: true,
  antagenJaNejMotivering: true,
  handlaggare: true,
  malgrupper: false,
  leverans: false,
  tabell: false,
  wms: false,
  fme: false,
  redigering: false,
  kopiering: false,
  information: false,
  kommentar: false,
  verksamhetskritiskData: true,
  levererad: true,
  skapelseDatum: true,
};

const ColumnsToolbarButton = React.forwardRef(
  function ColumnsToolbarButton(props, _ref) {
    return (
      <Tooltip title="Kolumner">
        <ToolbarButton aria-label="Columns" {...props}>
          <ViewColumnOutlinedIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
    );
  },
);

function GridToolbar({
  density,
  onDensityChange,
}: {
  density: GridDensity;
  onDensityChange: (d: GridDensity) => void;
}) {
  const [exportAnchor, setExportAnchor] = React.useState<null | HTMLElement>(
    null,
  );
  const exportOpen = Boolean(exportAnchor);
  const [densityAnchor, setDensityAnchor] = React.useState<null | HTMLElement>(
    null,
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
            ),
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
              options={{ utf8WithBom: true, fileName: "Avslutade" }}
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

export default function Avslutade({ mode }: { mode: "light" | "dark" }) {
  const { data: allItems = [], isLoading, isError } = useChecklists();
  const updateMutation = useUpdateChecklist();
  const navigate = useNavigate();

  // Filter items where levererad is true
  const items = React.useMemo(
    () =>
      allItems
        .filter((item) => item.levererad === true)
        .sort((a, b) => a.gid - b.gid),
    [allItems],
  );
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
          toast.success(
            "Ångrat. Posten flyttades tillbaka till beställningslistan.",
          );
        },
      },
    );
  };

  const columns: GridColDef<Checklist>[] = [
    {
      field: "gid",
      headerName: "GID",
      minWidth: 90,
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ pl: 2 }}>{params.value}</Box>
      ),
    },
    {
      field: "arendenummerArtvise",
      headerName: "Ärendenummer",
      minWidth: 140,
      flex: 0.8,
      hideable: false,
    },
    {
      field: "dataunderlag",
      headerName: "Dataunderlag",
      minWidth: 110,
      flex: 0.8,
    },
    {
      field: "dataadministrator",
      headerName: "Dataadministratör",
      minWidth: 150,
      flex: 1,
    },
    { field: "malgrupper", headerName: "Målgrupper", minWidth: 180, flex: 1 },
    {
      field: "nyttjandeInterntExternt",
      headerName: "Nyttjande",
      minWidth: 110,
      flex: 0.8,
    },
    { field: "leverans", headerName: "Leverans", minWidth: 110, flex: 1 },
    { field: "kategori", headerName: "Kategori", minWidth: 110, flex: 0.8 },
    {
      field: "prioritet",
      headerName: "Prioritet",
      minWidth: 110,
      flex: 0.6,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? (
          <Chip
            label={params.value}
            size="small"
            color={getPrioritetChipColor(params.value)}
            variant="filled"
          />
        ) : (
          "-"
        ),
    },
    { field: "antagenJaNej", headerName: "Antagen", minWidth: 100, flex: 0.8 },
    {
      field: "handlaggare",
      headerName: "Handläggare",
      minWidth: 110,
      flex: 0.8,
    },
    { field: "tabell", headerName: "Tabell", minWidth: 100, flex: 0.8 },
    { field: "wms", headerName: "WMS", minWidth: 100, flex: 0.8 },
    { field: "fme", headerName: "FME", minWidth: 100, flex: 0.8 },
    {
      field: "redigering",
      headerName: "Redigering",
      minWidth: 110,
      flex: 0.8,
    },
    {
      field: "kopiering",
      headerName: "Kopiering",
      minWidth: 110,
      flex: 0.8,
      type: "boolean",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Ja" : params.value === false ? "Nej" : "-",
    },
    {
      field: "information",
      headerName: "Information",
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: "verksamhetskritiskData",
      headerName: "Verksamhetskritisk data",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "kommentar",
      headerName: "Kommentar",
      minWidth: 110,
      flex: 1,
    },
    {
      field: "levererad",
      headerName: "Levererad",
      minWidth: 110,
      flex: 0.8,
      type: "boolean",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Ja" : params.value === false ? "Nej" : "-",
    },
    {
      field: "skapelseDatum",
      headerName: "Skapelsedatum",
      minWidth: 140,
      flex: 0.8,
    },
    {
      field: "actions",
      headerName: "Åtgärder",
      type: "actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="undo"
          icon={
            <Tooltip title="Ångra">
              <Undo />
            </Tooltip>
          }
          label="Ångra"
          disabled={updateMutation.isPending}
          onClick={(e) => {
            e.stopPropagation();
            handleUndo(params.row as Checklist);
          }}
        />,
      ],
    },
  ];

  const rows = items.map((item) => ({ ...item, id: item.gid }));

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
          Här listas objekt med levererad satt till "true". Klicka på ångra
          knappen för att flytta tillbaka objektet till beställningslistan.{" "}
          <br /> Klicka på ett ärendenummer för att öppna en detaljerad vy
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
            disableRowSelectionOnClick
            onRowClick={(params) => handleView(params.row as Checklist)}
            pageSizeOptions={[10, 25, 50]}
            pagination
            density={density}
            initialState={{
              sorting: { sortModel: [{ field: "gid", sort: "asc" }] },
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
              setPaginationModel(model);
              if (model.pageSize !== pageSize) setPageSize(model.pageSize);
            }}
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
                color: mode === "light" ? "grey" : "white",
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
      )}
    </Container>
  );
}
