import * as React from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Menu,
  MenuItem,
  ListItemText,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  keyframes,
} from "@mui/material";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  GridActionsCellItem,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  ExportCsv,
  ExportPrint,
  type GridDensity,
} from "@mui/x-data-grid";

import { GRID_DEFAULT_LOCALE_TEXT } from "../../../constants/sv";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import CancelIcon from "@mui/icons-material/Cancel";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { useForm, Controller } from "react-hook-form";

import {
  useChecklists,
  useCreateChecklist,
  useUpdateChecklist,
  useDeleteChecklist,
} from "../../hooks/useChecklist";
import { useOrderSummaries } from "../../hooks/useOrderSummary";
import type { Checklist, CreateChecklistDto } from "../../types/checklist";
import type { OrderSummary } from "../../types/orderSummary";

export const getPrioritetChipColor = (
  p: string | undefined
): "error" | "success" | "info" | "default" => {
  if (p === "Hög") return "error";
  if (p === "Medel") return "success";
  if (p === "Låg") return "info";
  return "default";
};

const PRIORITET_OPTIONS = ["Hög", "Medel", "Låg"] as const;
const KATEGORI_OPTIONS = [
  "lager i kartportalen",
  "FME-script",
  "FME-app",
  "lagring av data",
  "analys",
  "övrigt",
] as const;
const KATEGORI_TYP_OPTIONS = ["ny", "förändring"] as const;
const ANTAGEN_OPTIONS = ["ja", "nej"] as const;
const COLUMN_VISIBILITY_STORAGE_KEY = "checklist-column-visibility";

function normalizeAntagenJaNej(value: string | undefined): string {
  const v = (value ?? "").trim();
  if (!v) return "";
  if (v.toLowerCase() === "ja") return "ja";
  if (v.toLowerCase() === "nej") return "nej";
  return v;
}

function addUnknownOption<T extends readonly string[]>(
  options: T,
  currentValue: string | undefined
): string[] {
  const v = (currentValue ?? "").trim();
  if (!v) return [...options];
  return options.includes(v as (typeof options)[number])
    ? [...options]
    : [v, ...options];
}

const defaultColumnVisibility = {
  gid: true,
  arendenummerArtvise: true,
  dataunderlag: true,
  dataadministrator: true,
  nyttjandeInterntExternt: true,
  leveransArbetstimmar: true,
  kategori: true,
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
  levererad: false,
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

function ScreenshotToolbar({
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
    <Toolbar
      aria-label="Grid toolbar"
      style={
        {
          // Toolbar is a styled div; use inline style or className.
        }
      }
      // MUI `sx` also works because Toolbar forwards props to its root element.
      // (Docs show prop forwarding.)
      className=""
    >
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
            style={{ marginTop: "3px" }}
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
              options={{
                utf8WithBom: true,
                fileName: "Checklista",
              }}
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
            sx={{
              ml: 1,
              display: "flex",
              alignItems: "center",
              width: 260,
            }}
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

export default function ChecklistGrid() {
  const {
    data: allItems = [],
    isLoading,
    isError,
    failureCount,
    isRefetchError,
  } = useChecklists();

  // Filter out items that should be on other pages
  const items = React.useMemo(
    () =>
      allItems.filter(
        (item) =>
          item.levererad !== true && item.antagenJaNej?.toLowerCase() !== "nej"
      ),
    [allItems]
  );

  const createMutation = useCreateChecklist();
  const updateMutation = useUpdateChecklist();
  const deleteMutation = useDeleteChecklist();

  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<Checklist | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Checklist | null>(
    null
  );

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
  }, [COLUMN_VISIBILITY_STORAGE_KEY, columnVisibilityModel]);

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
      tabell: "",
      wms: "",
      fme: "",
      redigering: "",
      kopiering: false,
      information: "",
      kommentar: "",
      verksamhetskritiskData: "",
      levererad: false,
    },
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    setError: setEditError,
    formState: { isSubmitting: isUpdating },
  } = useForm<CreateChecklistDto>();

  const {
    data: orderSummaries = [],
    isLoading: isLoadingOrderSummaries,
    error: orderSummaryError,
  } = useOrderSummaries();

  const availableOrderSummariesForCreate = React.useMemo(() => {
    const used = new Set(
      items
        .map((c) => c.arendenummerArtvise?.toLowerCase().trim())
        .filter((v): v is string => !!v)
    );
    return orderSummaries.filter(
      (o) => !used.has(o.arendenummerArtvise.toLowerCase().trim())
    );
  }, [items, orderSummaries]);

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
      antagenJaNej: normalizeAntagenJaNej(item.antagenJaNej),
      antagenJaNejMotivering: item.antagenJaNejMotivering ?? "",
      handlaggare: item.handlaggare ?? "",
      tabell: item.tabell ?? "",
      wms: item.wms ?? "",
      fme: item.fme ?? "",
      redigering: item.redigering ?? "",
      kopiering: item.kopiering ?? false,
      information: item.information ?? "",
      kommentar: item.kommentar ?? "",
      verksamhetskritiskData: item.verksamhetskritiskData ?? "",
      levererad: item.levererad ?? false,
    });
  };

  // Helper to clean form data: convert empty strings to undefined, preserve booleans
  const cleanFormData = (data: CreateChecklistDto): CreateChecklistDto => {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "boolean") {
        cleaned[key] = value;
      } else if (value === "" || value === null) {
        cleaned[key] = undefined;
      } else if (typeof value === "string") {
        const trimmed = value.trim();
        cleaned[key] = trimmed === "" ? undefined : trimmed;
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned as CreateChecklistDto;
  };

  const handleCreate = (data: CreateChecklistDto) => {
    const arendenummerArtvise = data.arendenummerArtvise?.trim();
    if (arendenummerArtvise) {
      const duplicateExists = items.some(
        (item) =>
          item.arendenummerArtvise?.toLowerCase().trim() ===
          arendenummerArtvise.toLowerCase().trim()
      );

      if (duplicateExists) {
        setError("arendenummerArtvise", {
          type: "manual",
          message: "Ärendenummer finns redan",
        });
        return;
      }
    }

    const cleanedData = cleanFormData(data);
    createMutation.mutate(cleanedData, {
      onSuccess: () => {
        setOpenCreate(false);
        resetCreateForm();
      },
    });
  };

  const handleUpdate = (data: CreateChecklistDto) => {
    if (!openEdit) return;

    const arendenummerArtvise = data.arendenummerArtvise?.trim();
    if (arendenummerArtvise) {
      const duplicateExists = items.some(
        (item) =>
          item.gid !== openEdit.gid &&
          item.arendenummerArtvise?.toLowerCase().trim() ===
            arendenummerArtvise.toLowerCase().trim()
      );

      if (duplicateExists) {
        setEditError("arendenummerArtvise", {
          type: "manual",
          message: "Ärendenummer finns redan",
        });
        return;
      }
    }

    const cleanedData = cleanFormData(data);
    updateMutation.mutate(
      { gid: openEdit.gid, data: cleanedData },
      {
        onSuccess: () => {
          setOpenEdit(null);
        },
      }
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

  const [density, setDensity] = React.useState<GridDensity>("standard");

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

  const showApiDown = failureCount > 0 || isRefetchError || isError;
  const dots = keyframes`
  0% { content: ""; }
  33% { content: "."; }
  66% { content: ".."; }
  100% { content: "..."; }
`;
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
          Kunde inte ladda listan. Försöker igen
          <Box
            component="span"
            sx={{
              "&::after": {
                content: '""',
                animation: `${dots} 1.5s steps(3, end) infinite`,
              },
            }}
          />
        </Alert>
      </Box>
    );
  }

  const columns: GridColDef<Checklist>[] = [
    {
      field: "gid",
      headerName: "GID",
      width: 90,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ pl: 2 }}>{params.value}</Box>
      ),
    },
    {
      field: "arendenummerArtvise",
      headerName: "Ärendenummer",
      minWidth: 160,
      flex: 1,
    },
    {
      field: "dataunderlag",
      headerName: "Dataunderlag",
      minWidth: 220,
      flex: 1.2,
    },
    {
      field: "dataadministrator",
      headerName: "Dataadministratör",
      minWidth: 180,
      flex: 1,
    },
    { field: "malgrupper", headerName: "Målgrupper", minWidth: 180, flex: 1 },
    {
      field: "nyttjandeInterntExternt",
      headerName: "Nyttjande",
      minWidth: 150,
      flex: 0.8,
    },
    { field: "leverans", headerName: "Leverans", minWidth: 200, flex: 1 },
    { field: "kategori", headerName: "Kategori", minWidth: 150, flex: 0.8 },
    {
      field: "prioritet",
      headerName: "Prioritet",
      minWidth: 130,
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
    { field: "antagenJaNej", headerName: "Antagen", minWidth: 130, flex: 0.7 },
    {
      field: "handlaggare",
      headerName: "Handläggare",
      minWidth: 150,
      flex: 0.8,
    },
    { field: "tabell", headerName: "Tabell", minWidth: 150, flex: 0.8 },
    { field: "wms", headerName: "WMS", minWidth: 150, flex: 0.8 },
    { field: "fme", headerName: "FME", minWidth: 150, flex: 0.8 },
    {
      field: "redigering",
      headerName: "Redigering",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "kopiering",
      headerName: "Kopiering",
      minWidth: 150,
      flex: 0.8,
      type: "boolean",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Ja" : params.value === false ? "Nej" : "-",
    },
    {
      field: "information",
      headerName: "Information",
      minWidth: 150,
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
      minWidth: 200,
      flex: 1,
    },
    {
      field: "levererad",
      headerName: "Levererad",
      minWidth: 150,
      flex: 0.8,
      type: "boolean",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Ja" : params.value === false ? "Nej" : "-",
    },
    {
      field: "åtgärder",
      headerName: "Åtgärder",
      type: "actions",
      width: 110,
      sortable: false,
      filterable: false,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditOutlinedIcon color="primary" />}
          label="Redigera"
          onClick={() => handleEditClick(params.row as Checklist)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteOutlineOutlinedIcon color="error" />}
          label="Ta bort"
          onClick={() => setDeleteConfirm(params.row as Checklist)}
        />,
      ],
    },
  ];

  const rows = items.map((item) => ({ ...item, id: item.gid }));

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Checklista
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sök, filtrera, visa/dölj kolumner, exportera listan och hantera
            poster.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            setOpenCreate(true);
            resetCreateForm();
          }}
          sx={{ height: 42 }}
        >
          Skapa ny rad
        </Button>
      </Box>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : "Kunde inte skapa. Försök igen."}
        </Alert>
      )}
      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : "Kunde inte uppdatera. Försök igen."}
        </Alert>
      )}
      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Kunde inte ta bort. Försök igen."}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          height: 560,
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
          localeText={GRID_DEFAULT_LOCALE_TEXT}
          rows={rows}
          columns={columns}
          checkboxSelection={false}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          pagination
          slotProps={{
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
          }}
          density={density}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: {
              sortModel: [{ field: "gid", sort: "asc" }],
            },
          }}
          showToolbar
          slots={{
            toolbar: (props) => (
              <ScreenshotToolbar
                {...props}
                density={density}
                onDensityChange={setDensity}
              />
            ),
          }}
          sx={{
            border: 0,

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "grey.100",
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
            {!!orderSummaryError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {"message" in orderSummaryError
                  ? (orderSummaryError as Error).message
                  : "Kunde inte ladda ärendenummer från beställningsunderlag."}
              </Alert>
            )}
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
                  ["handlaggare", "Handläggare"],
                  ["tabell", "Tabell"],
                  ["wms", "WMS"],
                  ["fme", "FME"],
                  ["redigering", "Redigering"],
                  ["information", "Information"],
                  ["verksamhetskritiskData", "Verksamhetskritisk data"],
                  ["antagenJaNej", "Antagen"],
                  ["kommentar", "Kommentar"],
                  ["antagenJaNejMotivering", "Antagen ja/nej motivering"],
                ] as const
              ).map(([key, label]) => (
                <Grid
                  size={key === "antagenJaNejMotivering" ? 12 : 6}
                  key={key}
                >
                  {key === "prioritet" ? (
                    <Controller
                      name="prioritet"
                      control={createControl}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="create-prioritet-label">
                            Prioritet
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="create-prioritet-label"
                            label="Prioritet"
                            value={field.value ?? ""}
                          >
                            <MenuItem value="">
                              <em>Välj prioritet</em>
                            </MenuItem>
                            {PRIORITET_OPTIONS.map((opt) => (
                              <MenuItem key={opt} value={opt}>
                                {opt}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  ) : key === "kategori" ? (
                    <Controller
                      name="kategori"
                      control={createControl}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="create-kategori-label">
                            Kategori
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="create-kategori-label"
                            label="Kategori"
                            value={field.value ?? ""}
                          >
                            <MenuItem value="">
                              <em>Välj kategori</em>
                            </MenuItem>
                            {KATEGORI_OPTIONS.map((opt) => (
                              <MenuItem key={opt} value={opt}>
                                {opt}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  ) : key === "kategoriTyp" ? (
                    <Controller
                      name="kategoriTyp"
                      control={createControl}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="create-kategoriTyp-label">
                            Kategori typ
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="create-kategoriTyp-label"
                            label="Kategori typ"
                            value={field.value ?? ""}
                          >
                            <MenuItem value="">
                              <em>Välj kategori typ</em>
                            </MenuItem>
                            {KATEGORI_TYP_OPTIONS.map((opt) => (
                              <MenuItem key={opt} value={opt}>
                                {opt}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  ) : key === "antagenJaNej" ? (
                    <Controller
                      name="antagenJaNej"
                      control={createControl}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="create-antagenJaNej-label">
                            Antagen
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="create-antagenJaNej-label"
                            label="Antagen"
                            value={field.value ?? ""}
                          >
                            <MenuItem value="">
                              <em>Välj</em>
                            </MenuItem>
                            {ANTAGEN_OPTIONS.map((opt) => (
                              <MenuItem key={opt} value={opt}>
                                {opt}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  ) : key === "arendenummerArtvise" ? (
                    <Controller
                      name="arendenummerArtvise"
                      control={createControl}
                      rules={{
                        required: "Ärendenummer är obligatoriskt",
                      }}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          fullWidth
                          options={availableOrderSummariesForCreate}
                          getOptionLabel={(option) =>
                            option.arendenummerArtvise ?? ""
                          }
                          loading={isLoadingOrderSummaries}
                          value={
                            availableOrderSummariesForCreate.find(
                              (o) => o.arendenummerArtvise === field.value
                            ) ?? null
                          }
                          onChange={(_e, value) => {
                            field.onChange(value?.arendenummerArtvise ?? "");
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.arendenummerArtvise ===
                            value.arendenummerArtvise
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={label}
                              required
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                              slotProps={{
                                input: {
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {isLoadingOrderSummaries ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                },
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  ) : (
                    <Controller
                      name={key as keyof CreateChecklistDto}
                      control={createControl}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={label}
                          multiline={
                            key === "antagenJaNejMotivering" ||
                            key === "kommentar"
                          }
                          rows={
                            key === "antagenJaNejMotivering" ||
                            key === "kommentar"
                              ? 2
                              : 1
                          }
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                display: "flex",
                gap: 4,
                alignItems: "center",
                px: 1,
              }}
            >
              <Controller
                name="kopiering"
                control={createControl}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(field.value)}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Kopiering"
                  />
                )}
              />
              <Controller
                name="levererad"
                control={createControl}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(field.value)}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Levererad"
                  />
                )}
              />
            </Box>
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
          <DialogTitle>
            Redigera GID {openEdit?.gid} - ({openEdit?.arendenummerArtvise})
          </DialogTitle>
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
                  ["handlaggare", "Handläggare"],
                  ["tabell", "Tabell"],
                  ["wms", "WMS"],
                  ["fme", "FME"],
                  ["redigering", "Redigering"],
                  ["information", "Information"],
                  ["verksamhetskritiskData", "Verksamhetskritisk data"],
                  ["antagenJaNej", "Antagen"],
                  ["kommentar", "Kommentar"],
                  ["antagenJaNejMotivering", "Antagen ja/nej motivering"],
                ] as const
              ).map(([key, label]) => (
                <Grid
                  size={key === "antagenJaNejMotivering" ? 12 : 6}
                  key={key}
                >
                  {key === "prioritet" ? (
                    <Controller
                      name="prioritet"
                      control={editControl}
                      render={({ field }) => {
                        const options = addUnknownOption(
                          PRIORITET_OPTIONS,
                          field.value ?? openEdit?.prioritet
                        );
                        return (
                          <FormControl fullWidth>
                            <InputLabel id="edit-prioritet-label">
                              Prioritet
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="edit-prioritet-label"
                              label="Prioritet"
                              value={field.value ?? ""}
                            >
                              <MenuItem value="">
                                <em>Välj prioritet</em>
                              </MenuItem>
                              {options.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                  {opt}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                      }}
                    />
                  ) : key === "kategori" ? (
                    <Controller
                      name="kategori"
                      control={editControl}
                      render={({ field }) => {
                        const options = addUnknownOption(
                          KATEGORI_OPTIONS,
                          field.value ?? openEdit?.kategori
                        );
                        return (
                          <FormControl fullWidth>
                            <InputLabel id="edit-kategori-label">
                              Kategori
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="edit-kategori-label"
                              label="Kategori"
                              value={field.value ?? ""}
                            >
                              <MenuItem value="">
                                <em>Välj kategori</em>
                              </MenuItem>
                              {options.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                  {opt}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                      }}
                    />
                  ) : key === "kategoriTyp" ? (
                    <Controller
                      name="kategoriTyp"
                      control={editControl}
                      render={({ field }) => {
                        const options = addUnknownOption(
                          KATEGORI_TYP_OPTIONS,
                          field.value ?? openEdit?.kategoriTyp
                        );
                        return (
                          <FormControl fullWidth>
                            <InputLabel id="edit-kategoriTyp-label">
                              Kategori typ
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="edit-kategoriTyp-label"
                              label="Kategori typ"
                              value={field.value ?? ""}
                            >
                              <MenuItem value="">
                                <em>Välj kategori typ</em>
                              </MenuItem>
                              {options.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                  {opt}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                      }}
                    />
                  ) : key === "antagenJaNej" ? (
                    <Controller
                      name="antagenJaNej"
                      control={editControl}
                      render={({ field }) => {
                        const normalizedValue = normalizeAntagenJaNej(
                          field.value ?? openEdit?.antagenJaNej
                        );
                        const options = addUnknownOption(
                          ANTAGEN_OPTIONS,
                          normalizedValue
                        );
                        return (
                          <FormControl fullWidth>
                            <InputLabel id="edit-antagenJaNej-label">
                              Antagen
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="edit-antagenJaNej-label"
                              label="Antagen"
                              value={normalizedValue}
                              onChange={(e) =>
                                field.onChange(
                                  normalizeAntagenJaNej(String(e.target.value))
                                )
                              }
                            >
                              <MenuItem value="">
                                <em>Välj</em>
                              </MenuItem>
                              {options.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                  {opt}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                      }}
                    />
                  ) : key === "arendenummerArtvise" ? (
                    <Controller
                      name="arendenummerArtvise"
                      control={editControl}
                      rules={{
                        required: "Ärendenummer är obligatoriskt",
                      }}
                      render={({ field, fieldState }) => {
                        const usedByOthers = new Set(
                          items
                            .filter((c) => c.gid !== openEdit?.gid)
                            .map((c) =>
                              c.arendenummerArtvise?.toLowerCase().trim()
                            )
                            .filter((v): v is string => !!v)
                        );
                        const options = orderSummaries.filter(
                          (o) =>
                            !usedByOthers.has(
                              o.arendenummerArtvise.toLowerCase().trim()
                            )
                        );
                        const currentValue =
                          field.value ?? openEdit?.arendenummerArtvise ?? "";
                        const currentOption =
                          options.find(
                            (o) => o.arendenummerArtvise === currentValue
                          ) ??
                          (currentValue
                            ? ({
                                arendenummerArtvise: currentValue,
                              } as OrderSummary)
                            : null);

                        return (
                          <Autocomplete
                            fullWidth
                            options={options}
                            getOptionLabel={(option) =>
                              option.arendenummerArtvise ?? ""
                            }
                            loading={isLoadingOrderSummaries}
                            value={currentOption}
                            onChange={(_e, value) => {
                              field.onChange(value?.arendenummerArtvise ?? "");
                            }}
                            isOptionEqualToValue={(option, value) =>
                              option.arendenummerArtvise ===
                              value.arendenummerArtvise
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={label}
                                required
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                slotProps={{
                                  input: {
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {isLoadingOrderSummaries ? (
                                          <CircularProgress
                                            color="inherit"
                                            size={20}
                                          />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  },
                                }}
                              />
                            )}
                          />
                        );
                      }}
                    />
                  ) : (
                    <Controller
                      name={key as keyof CreateChecklistDto}
                      control={editControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={label}
                          multiline={
                            key === "antagenJaNejMotivering" ||
                            key === "kommentar"
                          }
                          rows={
                            key === "antagenJaNejMotivering" ||
                            key === "kommentar"
                              ? 2
                              : 1
                          }
                        />
                      )}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                display: "flex",
                gap: 4,
                alignItems: "center",
                px: 1,
              }}
            >
              <Controller
                name="kopiering"
                control={editControl}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(field.value)}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Kopiering"
                  />
                )}
              />
              <Controller
                name="levererad"
                control={editControl}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(field.value)}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Levererad"
                  />
                )}
              />
            </Box>
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
