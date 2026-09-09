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
  Chip,
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
  useCreateManagementPlan,
  useDeleteManagementPlan,
  useManagementPlans,
  useUpdateManagementPlan,
} from "../../hooks/useManagementPlan";
import type {
  CreateManagementPlanDto,
  ManagementPlan,
} from "../../types/managementPlan";
import { useGridPrefs } from "../../utils/gridPrefs";
import {
  buildSchemaNamnUrl,
  useRuntimeConfig,
} from "../../utils/runtimeConfig";
import { statusChipColor } from "../../utils/status-chip";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/sv";
import { FieldHelpIcon } from "../../components/FieldHelpIcon";
import { FormLabelWithHelp } from "../../components/FormLabelWithHelp";
import {
  managementPlanFieldTooltips,
  managementPlanSectionTooltips,
} from "../../utils/managementPlanTooltips";
import {
  defaultColumnVisibility,
  emptyForm,
  GRID_PREFS_STORAGE_KEY,
  MANAGEMENT_PLAN_FORM_SECTIONS,
  type ManagementPlanFormState,
  REDIGERINGS_KALLA_OPTIONS,
  STATUS_OPTIONS,
} from "./constants";

dayjs.extend(customParseFormat);

const parseDateValue = (value: string): Dayjs | null => {
  if (!value) return null;
  const parsed = dayjs(value, "YYYY-MM-DD", true);
  return parsed.isValid() ? parsed : null;
};

const formatDateValue = (value: Dayjs | null): string =>
  value && value.isValid() ? value.format("YYYY-MM-DD") : "";

const managementPlanFieldLabel = (
  fieldKey: string,
  text: string,
  glueIconToLastWord = false,
) => (
  <FormLabelWithHelp
    label={text}
    title={
      managementPlanFieldTooltips[
        fieldKey as keyof typeof managementPlanFieldTooltips
      ]
    }
    glueIconToLastWord={glueIconToLastWord}
  />
);

const toArray = (value: string): string[] | undefined => {
  const values = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
};

const fromArray = (value?: string[]): string => (value ?? []).join(", ");

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

const toFormState = (item: ManagementPlan): ManagementPlanFormState => ({
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
  redigeringsKalla: String(item.redigeringsKalla?.[0] ?? "").trim(),
  oppnaData: item.oppnaData ?? false,
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
});

const toDto = (state: ManagementPlanFormState): CreateManagementPlanDto => ({
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
  redigeringsKalla: state.redigeringsKalla.trim()
    ? [state.redigeringsKalla.trim()]
    : undefined,
  oppnaData: state.oppnaData,
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
});

function ManagementPlanFormDialog({
  open,
  item,
  isSubmitting,
  onClose,
  onCreate,
  onUpdate,
}: {
  open: boolean;
  item: ManagementPlan | null;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (dto: CreateManagementPlanDto) => void;
  onUpdate: (gid: number, dto: CreateManagementPlanDto) => void;
}) {
  const isCreate = item === null;
  const { control, handleSubmit, reset } = useForm<ManagementPlanFormState>({
    defaultValues: emptyForm,
  });

  React.useEffect(() => {
    if (!open) return;
    reset(item ? toFormState(item) : emptyForm);
  }, [open, item, reset]);

  const onSubmit = (state: ManagementPlanFormState) => {
    const dto = toDto(state);
    if (isCreate) {
      onCreate(dto);
      return;
    }
    onUpdate(item.gid, {
      ...dto,
      // Keep values that are no longer editable in the form.
      arendeNummberOpenE: item.arendeNummberOpenE,
      dokumentSkUrl: item.dokumentSkUrl,
      dokuementInfoUrl: item.dokuementInfoUrl,
      forvaltningsplanVersion: item.forvaltningsplanVersion,
      forvaltningsplanModelversion: item.forvaltningsplanModelversion,
      skapadTidPunkt: item.skapadTidPunkt,
      skapadAv: item.skapadAv,
      andradTidPunkt: item.andradTidPunkt,
      andradAv: item.andradAv,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      disableEscapeKeyDown
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isCreate
          ? "Skapa förvaltningsplan"
          : `Redigera förvaltningsplan${
              item.titel || item.namn ? ` (${item.titel ?? item.namn})` : ""
            }`}
      </DialogTitle>
      <DialogContent
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          const tag = (e.target as HTMLElement).tagName;
          if (tag === "TEXTAREA") return;
          e.preventDefault();
        }}
        sx={{
          // Default shrunk label is ~12px (16px * 0.75); bump to ~13px.
          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            transform: "translate(14px, -9px) scale(0.8125)",
          },
        }}
      >
        <Box sx={{ mt: 1 }}>
          {MANAGEMENT_PLAN_FORM_SECTIONS.map((section) => (
            <Box key={section.title} sx={{ mt: 5 }}>
              <Typography
                variant="body1"
                sx={{ fontSize: 15, fontWeight: 800, mb: 1 }}
              >
                {section.title}
                <FieldHelpIcon
                  title={managementPlanSectionTooltips[section.title]}
                />
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                {section.fields.map(([key, label]) =>
                  key === "oppnaData" ||
                  key === "kritiskDatamangd" ||
                  key === "publiceradOppnaData" ? (
                    <Controller
                      key={key}
                      name={key}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={Boolean(field.value)}
                              onChange={(e) =>
                                field.onChange(e.target.checked)
                              }
                            />
                          }
                          label={managementPlanFieldLabel(
                            key,
                            label,
                            key === "oppnaData",
                          )}
                        />
                      )}
                    />
                  ) : key === "status" ? (
                    <Controller
                      key={key}
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          label={managementPlanFieldLabel(key, label)}
                          value={field.value}
                          slotProps={{
                            inputLabel: { shrink: true },
                            select: { displayEmpty: true },
                          }}
                          onChange={(e) =>
                            field.onChange(String(e.target.value ?? ""))
                          }
                          onBlur={field.onBlur}
                          inputRef={field.ref}
                          name={field.name}
                        >
                          <MenuItem value="">
                            <em>Välj status</em>
                          </MenuItem>
                          {STATUS_OPTIONS.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  ) : key === "redigeringsKalla" ? (
                    <Controller
                      key={key}
                      name="redigeringsKalla"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          label={managementPlanFieldLabel(key, label)}
                          value={field.value}
                          slotProps={{
                            inputLabel: { shrink: true },
                            select: { displayEmpty: true },
                          }}
                          onChange={(e) =>
                            field.onChange(String(e.target.value ?? "").trim())
                          }
                          onBlur={field.onBlur}
                          inputRef={field.ref}
                          name={field.name}
                        >
                          <MenuItem value="">
                            <em>Välj redigeringskälla</em>
                          </MenuItem>
                          {field.value &&
                          !REDIGERINGS_KALLA_OPTIONS.includes(
                            field.value as (typeof REDIGERINGS_KALLA_OPTIONS)[number],
                          ) ? (
                            <MenuItem value={field.value}>
                              {field.value}
                            </MenuItem>
                          ) : null}
                          {REDIGERINGS_KALLA_OPTIONS.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  ) : key === "arkiveringTidpunkt" ? (
                    <LocalizationProvider
                      key={key}
                      dateAdapter={AdapterDayjs}
                      adapterLocale="sv"
                    >
                      <Controller
                        name="arkiveringTidpunkt"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            label={managementPlanFieldLabel(key, label)}
                            format="YYYY-MM-DD"
                            value={parseDateValue(field.value)}
                            onChange={(value) =>
                              field.onChange(formatDateValue(value))
                            }
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                onBlur: field.onBlur,
                                inputRef: field.ref,
                                name: field.name,
                                slotProps: { inputLabel: { shrink: true } },
                              },
                              field: { clearable: true },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  ) : (
                    <Controller
                      key={key}
                      name={key}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          value={
                            typeof field.value === "boolean"
                              ? ""
                              : (field.value ?? "")
                          }
                          label={managementPlanFieldLabel(key, label)}
                          multiline={key === "ovrigInformation"}
                          minRows={key === "ovrigInformation" ? 2 : undefined}
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      )}
                    />
                  ),
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose}>
          Avbryt
        </Button>
        <Button
          type="button"
          variant="contained"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {isCreate ? "Skapa" : "Spara"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ManagementPlanPage({
  mode,
}: {
  mode: "light" | "dark";
}) {
  const { config } = useRuntimeConfig();
  const managementPlanCatalogBaseUrl = config.managementPlanBaseUrl;

  const { data = [], isLoading, isError } = useManagementPlans();
  const createMutation = useCreateManagementPlan();
  const updateMutation = useUpdateManagementPlan();
  const deleteMutation = useDeleteManagementPlan();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<ManagementPlan | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<ManagementPlan | null>(
    null,
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

  const rows = React.useMemo(
    () =>
      [...data]
        .sort((a, b) => a.gid - b.gid)
        .map((item) => ({ ...item, id: item.gid })),
    [data],
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
    },
    {
      field: "namn",
      headerName: "Namn",
      minWidth: 180,
      flex: 1,
      renderCell: (params: GridRenderCellParams<ManagementPlan>) => {
        const value = String(params.value ?? "").trim();
        if (!value) {
          return "-";
        }

        const href = buildSchemaNamnUrl(
          managementPlanCatalogBaseUrl,
          String(params.row?.schemaNamn ?? ""),
          value,
        );
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
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 1,
      renderCell: (params: GridRenderCellParams<ManagementPlan>) => {
        const value = String(params.value ?? "").trim();
        if (!value) return "-";
        return (
          <Chip
            label={value}
            size="small"
            color={statusChipColor(value)}
            variant="filled"
          />
        );
      },
    },
    { field: "handlaggare", headerName: "Handläggare", minWidth: 150, flex: 1 },
    {
      field: "forvaltningsplanVersion",
      headerName: "Förvaltningsplan version",
      minWidth: 190,
      flex: 1,
    },
    {
      field: "forvaltningsplanModelversion",
      headerName: "Modellversion",
      minWidth: 150,
      flex: 0.9,
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
      hideable: false,
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditOutlinedIcon color="primary" />}
          label="Redigera"
          onClick={() => {
            setOpenCreate(false);
            setOpenEdit(params.row as ManagementPlan);
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
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="body2" fontWeight={600}>
          Här skapas och listas förvaltningsplaner automatiskt som kommer från
          e-tjänsten. Redigera eller ta bort objekt. <br /> Klicka på
          ärendenummer för att öppna förvaltningsplanen i metadatakatalogen.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setOpenEdit(null);
            setOpenCreate(true);
          }}
          sx={{ height: 42 }}
        >
          Skapa förvaltningsplan
        </Button>
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

      <ManagementPlanFormDialog
        open={openCreate || openEdit !== null}
        item={openCreate ? null : openEdit}
        isSubmitting={isSubmitting}
        onClose={() => {
          setOpenEdit(null);
          setOpenCreate(false);
        }}
        onCreate={(dto) => {
          createMutation.mutate(dto, {
            onSuccess: () => {
              setOpenCreate(false);
              toast.success("Förvaltningsplan skapad.");
            },
            onError: (err) => {
              const message =
                err instanceof Error
                  ? err.message
                  : "Kunde inte skapa. Försök igen.";
              toast.error(message);
            },
          });
        }}
        onUpdate={(gid, dto) => {
          updateMutation.mutate(
            { gid, data: dto },
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
            },
          );
        }}
      />

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
