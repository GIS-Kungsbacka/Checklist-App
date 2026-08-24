import * as React from "react";
import {
  Box,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  Pagination,
  Checkbox,
  FormControlLabel,
  Popover,
  Badge,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  keyframes,
} from "@mui/material";

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

import { GRID_DEFAULT_LOCALE_TEXT } from "../../../constants/sv";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Description,
  CalendarToday,
  ArrowForward,
  Person,
  ViewModule,
  ViewList,
  Search,
  FilterList,
} from "@mui/icons-material";

import { useOrders } from "../../hooks/useOrders";
import type { OrderSummary } from "../../types/orderSummary";
import { useNavigate } from "react-router-dom";
import { useGridPrefs } from "../../utils/gridPrefs";
import { useAuth } from "../../hooks/useAuth";

type ViewMode = "cards" | "list";

const STORAGE_KEY = "orderSummaryViewMode";
const STORAGE_KEY_CARD_PAGINATION = "orderSummaryCardPagination";
const GRID_PREFS_STORAGE_KEY = "orderSummary-default-prefs-dev";
const CARD_ITEMS_PER_PAGE = 8;

const PRIORITET_OPTIONS = ["Hög", "Medel", "Låg"] as const;

const FILTER_COLUMNS = [
  { key: "prioritet", label: "Prioritet", options: [...PRIORITET_OPTIONS] },
] as const;

export const getPrioritetChipColor = (
  p: string | undefined,
): "error" | "success" | "info" | "default" => {
  if (p === "Hög") return "error";
  if (p === "Medel") return "success";
  if (p === "Låg") return "info";
  return "default";
};

const defaultColumnVisibility = {
  arendenummerArtvise: true,
  beskrivning: true,
  bestallareOrganisation: true,
  datumInkommet: true,
  kategori: true,
  prioritet: true,
  dataadministrator: false,
  dataunderlag: false,
  malgrupper: false,
  nyttjandeInterntExternt: false,
  leverans: false,
  handlaggare: false,
  tabell: false,
  wms: false,
  fme: false,
  redigering: false,
  kopiering: false,
  information: false,
  verksamhetsKritiskData: false,
  kommentar: false,
  levererad: false,
};

const getInitialViewMode = (): ViewMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "cards" || saved === "list") return saved;
  } catch {
    // ignore
  }
  return "list";
};

const getInitialCardPagination = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CARD_PAGINATION);
    if (saved === "true") return true;
    if (saved === "false") return false;
  } catch {
    // ignore
  }
  return false;
};

const ColumnsToolbarButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof ToolbarButton>
>(function ColumnsToolbarButton(props, _ref) {
  return (
    <Tooltip title="Kolumner">
      <ToolbarButton aria-label="Columns" {...props}>
        <ViewColumnOutlinedIcon fontSize="small" />
      </ToolbarButton>
    </Tooltip>
  );
});

function OrderSummaryToolbar({
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
    <Toolbar aria-label="Grid toolbar" className="">
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
            ),
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
            style={{ marginTop: "3px" }}
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
              options={{
                utf8WithBom: true,
                fileName: "Beställningsspecifikationer",
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

export default function OrderSummaryDataGrid({
  mode,
}: {
  mode: "light" | "dark";
}) {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const {
    data: items = [],
    isLoading,
    isError,
    failureCount,
    isRefetchError,
  } = useOrders({ enabled: isAdmin });

  const [viewMode, setViewMode] = React.useState<ViewMode>(getInitialViewMode);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [filterAnchor, setFilterAnchor] = React.useState<HTMLElement | null>(
    null,
  );
  const [columnFilters, setColumnFilters] = React.useState<
    Record<string, string[]>
  >({});
  const [datumSortOrder, setDatumSortOrder] = React.useState<
    "asc" | "desc" | null
  >(null);
  const [cardPaginationEnabled, setCardPaginationEnabled] = React.useState(
    getInitialCardPagination,
  );

  const {
    columnVisibilityModel,
    setColumnVisibilityModel,
    density,
    setDensity,
    pageSize,
    setPageSize,
  } = useGridPrefs(GRID_PREFS_STORAGE_KEY, {
    columnVisibilityModel: {
      ...defaultColumnVisibility,
      arendenummerArtvise: true,
    },
    density: "standard",
    pageSize: 10,
  });

  const handleColumnVisibilityModelChange = React.useCallback(
    (nextModel: Record<string, boolean>) => {
      setColumnVisibilityModel({
        ...nextModel,
        arendenummerArtvise: true,
      } as unknown as Record<string, boolean>);
    },
    [],
  );

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, viewMode);
    } catch {
      // ignore
    }
  }, [viewMode]);

  React.useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CARD_PAGINATION,
        String(cardPaginationEnabled),
      );
    } catch {
      // ignore
    }
  }, [cardPaginationEnabled]);

  const [paginationModel, setPaginationModel] = React.useState(() => ({
    page: 0,
    pageSize,
  }));

  const uniqueValues = React.useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const col of FILTER_COLUMNS) {
      if ("options" in col && col.options) {
        map[col.key] = [...col.options];
      } else {
        const seen = new Set<string>();
        for (const item of items) {
          const v = (item as unknown as Record<string, unknown>)[col.key];
          if (v != null && String(v).trim()) seen.add(String(v).trim());
        }
        map[col.key] = [...seen].sort((a, b) => a.localeCompare(b));
      }
    }
    return map;
  }, [items]);

  const activeFilterCount =
    Object.values(columnFilters).reduce(
      (sum, arr) => sum + (arr?.length ?? 0),
      0,
    ) + (datumSortOrder ? 1 : 0);

  const filteredItems = React.useMemo(() => {
    let result = items;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        for (const value of Object.values(item)) {
          if (value === null || value === undefined) continue;
          if (typeof value === "string") {
            if (value.toLowerCase().includes(q)) return true;
            continue;
          }
          if (typeof value === "number" || typeof value === "boolean") {
            if (String(value).toLowerCase().includes(q)) return true;
            continue;
          }
          if (Array.isArray(value)) {
            const hay = value
              .filter((v) => v !== null && v !== undefined)
              .map((v) => String(v))
              .join(" ")
              .toLowerCase();
            if (hay.includes(q)) return true;
            continue;
          }
          if (typeof value === "object") {
            try {
              if (JSON.stringify(value).toLowerCase().includes(q)) return true;
            } catch {
              // ignore non-serializable values
            }
          }
        }
        return false;
      });
    }

    for (const col of FILTER_COLUMNS) {
      const selected = columnFilters[col.key];
      if (!selected?.length) continue;
      const set = new Set(selected);
      result = result.filter((item) => {
        const v = (item as unknown as Record<string, unknown>)[col.key];
        const str = v != null ? String(v).trim() : "";
        return str && set.has(str);
      });
    }

    const sorted = [...result];
    if (datumSortOrder) {
      sorted.sort((a, b) => {
        const da = a.datumInkommet || "";
        const db = b.datumInkommet || "";
        const cmp = da.localeCompare(db);
        return datumSortOrder === "asc" ? cmp : -cmp;
      });
    } else {
      sorted.sort((a, b) =>
        (a.arendenummerArtvise as string).localeCompare(
          b.arendenummerArtvise as string,
        ),
      );
    }
    return sorted;
  }, [items, searchQuery, columnFilters, datumSortOrder]);

  const handleFilterToggle = (colKey: string, value: string) => {
    setPage(1);
    setColumnFilters((prev) => {
      const arr = prev[colKey] ?? [];
      const next = arr.includes(value)
        ? arr.filter((x) => x !== value)
        : [...arr, value];
      const copy = { ...prev };
      if (next.length) copy[colKey] = next;
      else delete copy[colKey];
      return copy;
    });
  };

  const handleClearFilters = () => {
    setColumnFilters({});
    setDatumSortOrder(null);
    setPage(1);
  };

  const handleDatumSortToggle = (order: "asc" | "desc") => {
    setPage(1);
    setDatumSortOrder((prev) => (prev === order ? null : order));
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null,
  ) => {
    if (newMode !== null) setViewMode(newMode);
  };

  const cardItems = React.useMemo(() => {
    if (cardPaginationEnabled && viewMode === "cards") {
      const start = (page - 1) * CARD_ITEMS_PER_PAGE;
      return filteredItems.slice(start, start + CARD_ITEMS_PER_PAGE);
    }
    return filteredItems;
  }, [filteredItems, page, cardPaginationEnabled, viewMode]);

  const cardTotalPages =
    Math.ceil(filteredItems.length / CARD_ITEMS_PER_PAGE) || 1;

  if (authLoading) {
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

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Alert severity="error">Du har inte behörighet att se denna vy.</Alert>
      </Container>
    );
  }

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

  const columns: GridColDef<OrderSummary>[] = [
    {
      field: "arendenummerArtvise",
      headerName: "Ärendenummer",
      minWidth: 160,
      flex: 1.2,
      hideable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ pl: 2 }}>{params.value}</Box>
      ),
    },
    {
      field: "ärendenummerOpenE",
      headerName: "Ärendenummer OpenE",
      minWidth: 190,
      flex: 1.5,
    },
    {
      field: "bestallareEpost",
      headerName: "Beställare e-post",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "bestallareOrganisation",
      headerName: "Beställare organisation",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "bestallareTjanstetitel",
      headerName: "Beställare tjänstetitel",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "datumInkommet",
      headerName: "Datum inkommet",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "beskrivning",
      headerName: "Beskrivning",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "nytta",
      headerName: "Nytta",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "sistaDatum",
      headerName: "Sista datum",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "forankradChef",
      headerName: "Förankrad chef",
      minWidth: 150,
      flex: 0.8,
      type: "boolean",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Ja" : params.value === false ? "Nej" : "-",
    },
    {
      field: "kansligInformation",
      headerName: "Känslig information",
      minWidth: 150,
      flex: 0.8,
      type: "boolean",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? "Ja" : params.value === false ? "Nej" : "-",
    },
    {
      field: "kansligInformationBeskrivning",
      headerName: "Känslig information beskrivning",
      minWidth: 150,
      flex: 0.8,
    },
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
      field: "verksamhetsKritiskData",
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
  ];

  const rows = items.map((item, index) => ({
    ...item,
    id: item.arendenummerArtvise || `row-${index}`,
  }));

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
            Sammanfattning av beställningsspecifikationer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {viewMode === "cards"
              ? "Klicka på ärendenummer för att se fler detaljer. Sök, filtrera och visa poster i kortvy eller listvy."
              : "Klicka på en rad för att se fler detaljer. Sök, filtrera, visa/dölj kolumner, exportera listan."}
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          {viewMode === "cards" &&
            filteredItems.length > CARD_ITEMS_PER_PAGE && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cardPaginationEnabled}
                    onChange={(e) => {
                      setCardPaginationEnabled(e.target.checked);
                      setPage(1);
                    }}
                    size="small"
                  />
                }
                label="Paginering i kortvy"
              />
            )}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                border: "1px solid",
                borderColor: "divider",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": { backgroundColor: "primary.dark" },
                },
              },
            }}
          >
            <Tooltip title="Kortvy" arrow>
              <ToggleButton value="cards" aria-label="card view">
                <ViewModule />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Listvy" arrow>
              <ToggleButton value="list" aria-label="list view">
                <ViewList />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {viewMode === "cards" && (
        <>
          <Box mb={3} display="flex" flexDirection="column" gap={1}>
            <Box display="flex" gap={1} alignItems="flex-start">
              <TextField
                fullWidth
                placeholder="Sök på ärendenummer, beskrivning, beställare, dataadministratör, eller kategori..."
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
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "background.paper",
                  },
                }}
              />
              <Tooltip title="Filtrera">
                <IconButton
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    setFilterAnchor(e.currentTarget)
                  }
                  sx={{
                    mt: 0.5,
                    backgroundColor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                  aria-label="Öppna filter"
                >
                  <Badge badgeContent={activeFilterCount} color="primary">
                    <FilterList />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
            {(searchQuery || activeFilterCount > 0) && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Visar {filteredItems.length} av {items.length} poster
              </Typography>
            )}
          </Box>
          <Popover
            open={!!filterAnchor}
            anchorEl={filterAnchor}
            onClose={() => setFilterAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  minWidth: 320,
                  maxWidth: 360,
                  maxHeight: 420,
                  borderRadius: 2,
                  boxShadow: 4,
                  overflow: "hidden",
                },
              },
            }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Filter
                </Typography>
                {activeFilterCount > 0 && (
                  <Button
                    size="small"
                    onClick={handleClearFilters}
                    sx={{ textTransform: "none" }}
                  >
                    Rensa alla
                  </Button>
                )}
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2} sx={{ maxHeight: 320, overflowY: "auto" }}>
                {FILTER_COLUMNS.map((col) => {
                  const values = uniqueValues[col.key] ?? [];
                  if (values.length === 0) return null;
                  const selected = columnFilters[col.key] ?? [];
                  return (
                    <Box key={col.key}>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mb: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        {col.label}
                      </Typography>
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        useFlexGap
                        spacing={0.5}
                      >
                        {values.slice(0, 12).map((val) => (
                          <Chip
                            key={val}
                            label={val}
                            size="small"
                            variant={
                              selected.includes(val) ? "filled" : "outlined"
                            }
                            onClick={() => handleFilterToggle(col.key, val)}
                            sx={{
                              cursor: "pointer",
                              "&.MuiChip-filled": {
                                backgroundColor: "primary.main",
                                color: "primary.contrastText",
                              },
                            }}
                          />
                        ))}
                        {values.length > 12 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ alignSelf: "center", ml: 0.5 }}
                          >
                            +{values.length - 12} fler
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  );
                })}
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="text.secondary"
                    sx={{
                      display: "block",
                      mb: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Datum inkommet
                  </Typography>
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    useFlexGap
                    spacing={0.5}
                  >
                    <Chip
                      label="Stigande"
                      size="small"
                      variant={datumSortOrder === "asc" ? "filled" : "outlined"}
                      onClick={() => handleDatumSortToggle("asc")}
                      sx={{
                        cursor: "pointer",
                        "&.MuiChip-filled": {
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                        },
                      }}
                    />
                    <Chip
                      label="Fallande"
                      size="small"
                      variant={
                        datumSortOrder === "desc" ? "filled" : "outlined"
                      }
                      onClick={() => handleDatumSortToggle("desc")}
                      sx={{
                        cursor: "pointer",
                        "&.MuiChip-filled": {
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                        },
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Popover>
        </>
      )}

      {filteredItems.length === 0 && viewMode === "cards" ? (
        <Card elevation={2}>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchQuery || activeFilterCount > 0
                ? "Inga poster matchar sökningen eller filtren"
                : "Inga beställningsspecifikationer tillgängliga."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery || activeFilterCount > 0
                ? "Justera sökningen eller filtren"
                : "Kontakta administratören."}
            </Typography>
          </Box>
        </Card>
      ) : viewMode === "cards" ? (
        <>
          <Paper
            elevation={3}
            sx={{ p: 2, borderRadius: 2, flexGrow: 1, overflow: "auto" }}
          >
            <Grid container spacing={2}>
              {cardItems.map((item) => (
                <Grid size={3} key={item.arendenummerArtvise}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: 4,
                      },
                    }}
                    onClick={() =>
                      navigate(`/checklist/${item.arendenummerArtvise}`)
                    }
                  >
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={`Ärendenummer Artvise ${item.arendenummerArtvise}`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      {item.beskrivning && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mb: 1.5,
                            minHeight: 50,
                          }}
                        >
                          <Description
                            sx={{ color: "text.secondary", mr: 1, mt: 0.5 }}
                            fontSize="small"
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              flex: 1,
                            }}
                          >
                            {item.beskrivning}
                          </Typography>
                        </Box>
                      )}
                      <Stack spacing={0.75} sx={{ mt: 1.5 }}>
                        {item.bestallareOrganisation && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Person
                              sx={{ color: "text.secondary", mr: 1 }}
                              fontSize="small"
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.bestallareOrganisation}
                            </Typography>
                          </Box>
                        )}
                        {item.datumInkommet && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CalendarToday
                              sx={{ color: "text.secondary", mr: 1 }}
                              fontSize="small"
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.datumInkommet}
                            </Typography>
                          </Box>
                        )}
                        {item.kategori && (
                          <Chip
                            label={item.kategori}
                            size="small"
                            sx={{ alignSelf: "flex-start" }}
                          />
                        )}
                        {item.prioritet && (
                          <Chip
                            label={item.prioritet}
                            size="small"
                            color={getPrioritetChipColor(item.prioritet)}
                            variant="filled"
                            sx={{ alignSelf: "flex-start" }}
                          />
                        )}
                      </Stack>
                    </CardContent>
                    <CardActions
                      sx={{ p: 1.5, pt: 0, justifyContent: "flex-end" }}
                    >
                      <Button
                        endIcon={<ArrowForward />}
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/checklist/${item.arendenummerArtvise}`);
                        }}
                      >
                        Visa detaljer
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
          {viewMode === "cards" &&
            cardPaginationEnabled &&
            filteredItems.length > CARD_ITEMS_PER_PAGE && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  mb: 2,
                }}
              >
                <Pagination
                  count={cardTotalPages}
                  page={page}
                  onChange={(_e, value) => setPage(value)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
        </>
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
            onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
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
              const id = (params.row as OrderSummary | undefined)
                ?.arendenummerArtvise;
              if (!id) return;
              navigate(`/checklist/${id}`);
            }}
            slotProps={{
              loadingOverlay: {
                variant: "skeleton",
                noRowsVariant: "skeleton",
              },
            }}
            density={density}
            initialState={{
              sorting: {
                sortModel: [{ field: "arendenummerArtvise", sort: "asc" }],
              },
            }}
            showToolbar
            slots={{
              toolbar: (props: unknown) => (
                <OrderSummaryToolbar
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
              '& .MuiDataGrid-columnHeader[data-field="arendenummerArtvise"] .MuiDataGrid-columnHeaderTitleContainer':
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
      )}
    </Container>
  );
}
