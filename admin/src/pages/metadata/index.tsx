import * as React from "react";
import {
  Alert,
  Autocomplete,
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/sv";
import { GRID_DEFAULT_LOCALE_TEXT } from "../../../constants/sv";
import {
  useCreateMetadata,
  useDeleteMetadata,
  useMetadatas,
  useUpdateMetadata,
} from "../../hooks/useMetadata";
import { useManagementPlans } from "../../hooks/useManagementPlan";
import type { CreateMetadataDto, Metadata } from "../../types/metadata";
import { useGridPrefs } from "../../utils/gridPrefs";
import {
  buildSchemaNamnUrl,
  useRuntimeConfig,
} from "../../utils/runtimeConfig";
import { statusChipColor } from "../../utils/status-chip";
import { toast } from "react-toastify";
import {
  Controller,
  useForm,
  useWatch,
  type Control,
} from "react-hook-form";
import { SelectWithOtherDialog } from "../../components/SelectWithOtherDialog";
import { FieldHelpIcon } from "../../components/FieldHelpIcon";
import { FormLabelWithHelp } from "../../components/FormLabelWithHelp";
import {
  metadataFieldTooltips,
  metadataSectionTooltips,
} from "../../utils/metadataTooltips";
import {
  defaultColumnVisibility,
  emptyForm,
  FULLSTANDIGHET_OPTIONS,
  GEOGRAFISK_TYP_OPTIONS,
  GRID_PREFS_STORAGE_KEY,
  KATEGORI_OPTIONS,
  METADATA_FORM_SECTIONS,
  type MetadataFormState,
  STATUS_OPTIONS,
  TATORT_OPTIONS,
  TATORT_OPTION_SET,
  TIDS_UPPLOSNING_OPTIONS,
  TIDS_UPPLOSNING_OPTION_SET,
  UPPDATERINGS_FREKVENS_OPTIONS,
  UPPDATERINGS_FREKVENS_OPTION_SET,
} from "./constants";

dayjs.extend(customParseFormat);

const metadataFieldLabel = (fieldKey: string, text: string) => (
  <FormLabelWithHelp label={text} title={metadataFieldTooltips[fieldKey]} />
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

const parseGeografiskBegransning = (
  values?: string[],
): Pick<
  MetadataFormState,
  | "geografiskBegransningTyp"
  | "geografiskBegransningTatorter"
  | "geografiskBegransningAnnat"
> => {
  const items = (values ?? [])
    .map((value) => String(value).trim())
    .filter(Boolean);
  if (items.length === 0) {
    return {
      geografiskBegransningTyp: "",
      geografiskBegransningTatorter: [],
      geografiskBegransningAnnat: "",
    };
  }

  if (items.length === 1 && items[0] === "Kungsbacka kommun") {
    return {
      geografiskBegransningTyp: "Kungsbacka kommun",
      geografiskBegransningTatorter: [],
      geografiskBegransningAnnat: "",
    };
  }

  if (items.length === 1 && items[0] === "Hela landet") {
    return {
      geografiskBegransningTyp: "Hela landet",
      geografiskBegransningTatorter: [],
      geografiskBegransningAnnat: "",
    };
  }

  const withoutTatortTyp = items.filter(
    (value) => value !== "Kungsbacka tätort",
  );
  const tatorter = withoutTatortTyp.filter((value) =>
    TATORT_OPTION_SET.has(value),
  );
  const unknown = withoutTatortTyp.filter(
    (value) => !TATORT_OPTION_SET.has(value),
  );
  if (
    items.includes("Kungsbacka tätort") ||
    (tatorter.length > 0 && unknown.length === 0)
  ) {
    return {
      geografiskBegransningTyp: "Kungsbacka tätort",
      geografiskBegransningTatorter: tatorter,
      geografiskBegransningAnnat: "",
    };
  }

  if (items[0] === "Annat") {
    return {
      geografiskBegransningTyp: "Annat",
      geografiskBegransningTatorter: [],
      geografiskBegransningAnnat: items.slice(1).join(", "),
    };
  }

  return {
    geografiskBegransningTyp: "Annat",
    geografiskBegransningTatorter: [],
    geografiskBegransningAnnat: items.join(", "),
  };
};

const toGeografiskBegransning = (
  state: MetadataFormState,
): string[] | undefined => {
  switch (state.geografiskBegransningTyp) {
    case "Kungsbacka kommun":
      return ["Kungsbacka kommun"];
    case "Hela landet":
      return ["Hela landet"];
    case "Kungsbacka tätort":
      return ["Kungsbacka tätort", ...state.geografiskBegransningTatorter];
    case "Annat": {
      const text = state.geografiskBegransningAnnat.trim();
      return text ? ["Annat", text] : ["Annat"];
    }
    default:
      return undefined;
  }
};

const toFormState = (item: Metadata): MetadataFormState => ({
  bestallareNamn: item.bestallareNamn ?? "",
  bestallareEpost: item.bestallareEpost ?? "",
  sakerhetsKlass: item.sakerhetsKlass ?? "",
  sakerhetsklassRiktighet: item.sakerhetsklassRiktighet ?? "",
  sakerhetsklassTillganglighet: item.sakerhetsklassTillganglighet ?? "",
  dataKallaTyp: item.dataKallaTyp ?? "",
  schemaNamn: item.schemaNamn ?? "",
  namn: item.namn ?? "",
  beskrivning: item.beskrivning ?? "",
  ursprung: fromArray(item.ursprung),
  syfte: item.syfte ?? "",
  metod: item.metod ?? "",
  metodUrl: item.metodUrl ?? "",
  projekt: item.projekt ?? "",
  ...parseGeografiskBegransning(item.geografiskBegransning),
  uppdateringsFrekvens: (() => {
    const raw = String(item.uppdateringsFrekvens ?? "").trim();
    if (!raw) return "";
    if (raw !== "Annat" && UPPDATERINGS_FREKVENS_OPTION_SET.has(raw)) {
      return raw;
    }
    // Any custom value is treated as "Annat".
    return "Annat";
  })(),
  uppdateringsFrekvensAnnat: (() => {
    const raw = String(item.uppdateringsFrekvens ?? "").trim();
    if (!raw) return "";
    if (raw !== "Annat" && UPPDATERINGS_FREKVENS_OPTION_SET.has(raw)) {
      return "";
    }
    // If the API value already equals "Annat", keep the free-text empty.
    return raw === "Annat" ? "" : raw;
  })(),
  fullstandighet: String(item.fullstandighet ?? "").trim(),
  skalniva: item.skalniva ?? "",
  nyckelOrd: fromArray(item.nyckelOrd),
  // Normalize to match select options (avoids "blank" when value differs by whitespace/format).
  kategori: String(item.kategori ?? "").trim(),
  tidsperiod: item.tidsperiod ?? false,
  tidsperiodStartdatum: item.tidsperiodStartdatum ?? "",
  tidsperiodSlutdatum: item.tidsperiodSlutdatum ?? "",
  tidsUpplosning: (() => {
    const raw = String(item.tidsUpplosning ?? "").trim();
    if (!raw) return "";
    if (raw !== "Vet ej" && TIDS_UPPLOSNING_OPTION_SET.has(raw)) {
      return raw;
    }
    return "Vet ej";
  })(),
  tidsUpplosningAnnat: (() => {
    const raw = String(item.tidsUpplosning ?? "").trim();
    if (!raw) return "";
    if (raw !== "Vet ej" && TIDS_UPPLOSNING_OPTION_SET.has(raw)) {
      return "";
    }
    return raw === "Vet ej" ? "" : raw;
  })(),
  skapelseDatum: item.skapelseDatum ?? "",
  anvandarBegransningLicens: item.anvandarBegransningLicens ?? false,
  anvandarBegransningLicensText: item.anvandarBegransningLicensText ?? "",
  relateradeResurser: fromArray(item.relateradeResurser),
  status: item.status ?? "",
  handlaggare: item.handlaggare ?? "",
});

const toDto = (state: MetadataFormState): CreateMetadataDto => ({
  bestallareNamn: state.bestallareNamn || undefined,
  bestallareEpost: state.bestallareEpost || undefined,
  sakerhetsKlass: state.sakerhetsKlass || undefined,
  sakerhetsklassRiktighet: state.sakerhetsklassRiktighet || undefined,
  sakerhetsklassTillganglighet: state.sakerhetsklassTillganglighet || undefined,
  dataKallaTyp: state.dataKallaTyp || undefined,
  schemaNamn: state.schemaNamn || undefined,
  namn: state.namn || undefined,
  beskrivning: state.beskrivning || undefined,
  ursprung: toArray(state.ursprung),
  syfte: state.syfte || undefined,
  metod: state.metod || undefined,
  metodUrl: state.metodUrl || undefined,
  projekt: state.projekt || undefined,
  geografiskBegransning: toGeografiskBegransning(state),
  uppdateringsFrekvens:
    state.uppdateringsFrekvens === "Annat"
      ? state.uppdateringsFrekvensAnnat.trim() || undefined
      : state.uppdateringsFrekvens || undefined,
  fullstandighet: state.fullstandighet || undefined,
  skalniva: state.skalniva || undefined,
  nyckelOrd: toArray(state.nyckelOrd),
  kategori: state.kategori.trim() || undefined,
  tidsperiod: state.tidsperiod,
  tidsperiodStartdatum: state.tidsperiodStartdatum || undefined,
  tidsperiodSlutdatum: state.tidsperiodSlutdatum || undefined,
  tidsUpplosning:
    state.tidsUpplosning === "Vet ej"
      ? state.tidsUpplosningAnnat.trim() || "Vet ej"
      : state.tidsUpplosning || undefined,
  skapelseDatum: state.skapelseDatum || undefined,
  anvandarBegransningLicens: state.anvandarBegransningLicens,
  anvandarBegransningLicensText:
    state.anvandarBegransningLicensText || undefined,
  relateradeResurser: toArray(state.relateradeResurser),
  status: state.status || undefined,
  handlaggare: state.handlaggare || undefined,
});

const parseDateValue = (value: string): Dayjs | null => {
  if (!value) return null;
  const parsed = dayjs(value, "YYYY-MM-DD", true);
  return parsed.isValid() ? parsed : null;
};

const formatDateValue = (value: Dayjs | null): string =>
  value && value.isValid() ? value.format("YYYY-MM-DD") : "";

function TidsperiodDatumFields({
  control,
}: {
  control: Control<MetadataFormState>;
}) {
  const startValue = useWatch({ control, name: "tidsperiodStartdatum" }) ?? "";
  const endValue = useWatch({ control, name: "tidsperiodSlutdatum" }) ?? "";
  const startDate = parseDateValue(startValue);
  const endDate = parseDateValue(endValue);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sv">
      <Box
        sx={{
          gridColumn: "1 / -1",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          alignItems: "start",
        }}
      >
        <Controller
          name="tidsperiodStartdatum"
          control={control}
          render={({ field }) => (
            <DatePicker
              label={
                <FormLabelWithHelp
                  label="Tidsperiod startdatum"
                  title={metadataFieldTooltips.tidsperiodStartdatum}
                />
              }
              format="YYYY-MM-DD"
              value={parseDateValue(field.value)}
              onChange={(value) => field.onChange(formatDateValue(value))}
              maxDate={endDate ?? undefined}
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
        <Controller
          name="tidsperiodSlutdatum"
          control={control}
          render={({ field }) => (
            <DatePicker
              label={
                <FormLabelWithHelp
                  label="Tidsperiod slutdatum"
                  title={metadataFieldTooltips.tidsperiodSlutdatum}
                />
              }
              format="YYYY-MM-DD"
              value={parseDateValue(field.value)}
              onChange={(value) => field.onChange(formatDateValue(value))}
              minDate={startDate ?? undefined}
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
      </Box>
    </LocalizationProvider>
  );
}

function MetadataFormDialog({
  open,
  item,
  isSubmitting,
  onClose,
  onCreate,
  onUpdate,
}: {
  open: boolean;
  item: Metadata | null;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (dto: CreateMetadataDto) => void;
  onUpdate: (gid: number, dto: CreateMetadataDto) => void;
}) {
  const isCreate = item === null;
  const { control, handleSubmit, reset, setValue } = useForm<MetadataFormState>(
    {
      defaultValues: emptyForm,
    },
  );

  React.useEffect(() => {
    if (!open) return;
    reset(item ? toFormState(item) : emptyForm);
  }, [open, item, reset]);

  const onSubmit = (state: MetadataFormState) => {
    const dto = toDto(state);
    if (isCreate) {
      onCreate(dto);
      return;
    }
    onUpdate(item.gid, {
      ...dto,
      // Keep values that are no longer editable in the form.
      arendeNummerOpenE: item.arendeNummerOpenE,
      kolumnBeskrivningUrl: item.kolumnBeskrivningUrl,
      metaDataVersion: item.metaDataVersion,
      metadataSpecifikationModelversion:
        item.metadataSpecifikationModelversion,
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
          ? "Skapa metadata"
          : `Redigera metadata${item.namn ? ` (${item.namn})` : ""}`}
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
          {METADATA_FORM_SECTIONS.map((section) => (
            <Box key={section.title} sx={{ mt: 5 }}>
              <Typography
                variant="body1"
                sx={{ fontSize: 15, fontWeight: 800, mb: 1 }}
              >
                {section.title}
                <FieldHelpIcon
                  title={metadataSectionTooltips[section.title]}
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
                  key === "tidsperiod" ? (
                    <Controller
                      key={key}
                      name="tidsperiod"
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
                          label={metadataFieldLabel(key, label)}
                        />
                      )}
                    />
                  ) : key === "anvandarBegransningLicensText" ? null : key ===
                    "anvandarBegransningLicens" ? (
                    <Box
                      key="anvandarBegransningLicens-group"
                      sx={{
                        gridColumn: "1 / -1",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Controller
                        name="anvandarBegransningLicens"
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
                            label={metadataFieldLabel(key, label)}
                          />
                        )}
                      />
                      <Controller
                        name="anvandarBegransningLicensText"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={metadataFieldLabel(
                              "anvandarBegransningLicensText",
                              "Användarbegränsning licens text",
                            )}
                            multiline
                            minRows={2}
                            slotProps={{ inputLabel: { shrink: true } }}
                          />
                        )}
                      />
                    </Box>
                  ) : key === "kategori" ? (
                    <Controller
                      key={key}
                      name="kategori"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          label={metadataFieldLabel(key, label)}
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
                            <em>Välj kategori</em>
                          </MenuItem>
                          {field.value &&
                          !KATEGORI_OPTIONS.includes(
                            field.value as (typeof KATEGORI_OPTIONS)[number],
                          ) ? (
                            <MenuItem value={field.value}>
                              {field.value}
                            </MenuItem>
                          ) : null}
                          {KATEGORI_OPTIONS.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </TextField>
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
                          label={metadataFieldLabel(key, label)}
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
                  ) : key === "fullstandighet" ? (
                    <Controller
                      key={key}
                      name="fullstandighet"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          label={metadataFieldLabel(key, label)}
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
                            <em>Välj fullständighet</em>
                          </MenuItem>
                          {field.value &&
                          !FULLSTANDIGHET_OPTIONS.includes(
                            field.value as (typeof FULLSTANDIGHET_OPTIONS)[number],
                          ) ? (
                            <MenuItem value={field.value}>
                              {field.value}
                            </MenuItem>
                          ) : null}
                          {FULLSTANDIGHET_OPTIONS.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  ) : key === "geografiskBegransning" ? (
                    <SelectWithOtherDialog
                      key={key}
                      control={control}
                      setValue={setValue}
                      label={metadataFieldLabel(key, label)}
                      name="geografiskBegransningTyp"
                      options={GEOGRAFISK_TYP_OPTIONS}
                      emptyOptionLabel="Välj geografisk begränsning"
                      optionDialogs={[
                        {
                          option: "Kungsbacka tätort",
                          fieldName: "geografiskBegransningTatorter",
                          dialogTitle: "Välj tätorter",
                          emptySummaryText: "Inga tätorter valda",
                          formatSummary: (value) =>
                            Array.isArray(value) ? value.join(", ") : "",
                          renderEditor: ({ value, onChange }) => (
                            <Autocomplete
                              multiple
                              disableCloseOnSelect
                              options={[...TATORT_OPTIONS]}
                              value={
                                Array.isArray(value) ? (value as string[]) : []
                              }
                              onChange={(_event, next) => onChange(next)}
                              slotProps={{
                                popper: {
                                  placement: "top-start",
                                  modifiers: [
                                    { name: "flip", enabled: false },
                                  ],
                                },
                              }}
                              renderOption={(props, option, { selected }) => {
                                const { key: optionKey, ...optionProps } =
                                  props as typeof props & { key?: React.Key };
                                return (
                                  <li
                                    key={optionKey ?? option}
                                    {...optionProps}
                                  >
                                    <Checkbox
                                      checked={selected}
                                      sx={{ mr: 1 }}
                                    />
                                    {option}
                                  </li>
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  sx={{ mt: 1 }}
                                  label="Tätorter"
                                  placeholder="Välj tätorter"
                                />
                              )}
                            />
                          ),
                        },
                        {
                          option: "Annat",
                          fieldName: "geografiskBegransningAnnat",
                          dialogTitle: "Ange geografisk begränsning",
                          dialogFieldLabel: "Geografisk begränsning",
                        },
                      ]}
                    />
                  ) : key === "uppdateringsFrekvens" ? (
                    <SelectWithOtherDialog
                      key={key}
                      control={control}
                      setValue={setValue}
                      label={metadataFieldLabel(key, label)}
                      name="uppdateringsFrekvens"
                      options={UPPDATERINGS_FREKVENS_OPTIONS}
                      emptyOptionLabel="Välj uppdateringsfrekvens"
                      optionDialogs={[
                        {
                          option: "Annat",
                          fieldName: "uppdateringsFrekvensAnnat",
                          dialogTitle: "Ange uppdateringsfrekvens",
                          dialogFieldLabel: "Uppdateringsfrekvens (Annat)",
                        },
                      ]}
                    />
                  ) : key === "tidsUpplosning" ? (
                    <SelectWithOtherDialog
                      key={key}
                      control={control}
                      setValue={setValue}
                      label={metadataFieldLabel(key, label)}
                      name="tidsUpplosning"
                      options={TIDS_UPPLOSNING_OPTIONS}
                      emptyOptionLabel="Välj tidsupplösning"
                      optionDialogs={[
                        {
                          option: "Vet ej",
                          fieldName: "tidsUpplosningAnnat",
                          dialogTitle: "Ange tidsupplösning",
                          dialogFieldLabel: "Tidsupplösning (Vet ej)",
                        },
                      ]}
                    />
                  ) : key === "tidsperiodDatum" ? (
                    <TidsperiodDatumFields key={key} control={control} />
                  ) : key === "skapelseDatum" ? (
                    <LocalizationProvider
                      key={key}
                      dateAdapter={AdapterDayjs}
                      adapterLocale="sv"
                    >
                      <Controller
                        name="skapelseDatum"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            label={metadataFieldLabel(key, label)}
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
                  ) : key === "syfte" ? null : key === "beskrivning" ? (
                    <Box
                      key="beskrivning-syfte"
                      sx={{
                        gridColumn: "1 / -1",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                      }}
                    >
                      <Controller
                        name="beskrivning"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={metadataFieldLabel(key, label)}
                            multiline
                            minRows={2}
                            slotProps={{ inputLabel: { shrink: true } }}
                          />
                        )}
                      />
                      <Controller
                        name="syfte"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={metadataFieldLabel("syfte", "Syfte")}
                            multiline
                            minRows={2}
                            slotProps={{ inputLabel: { shrink: true } }}
                          />
                        )}
                      />
                    </Box>
                  ) : (
                    <Controller
                      key={key}
                      name={key as keyof MetadataFormState}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          value={
                            typeof field.value === "boolean"
                              ? ""
                              : (field.value ?? "")
                          }
                          label={metadataFieldLabel(key, label)}
                          multiline={key === "metod"}
                          minRows={key === "metod" ? 2 : undefined}
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

export default function MetadataPage({ mode }: { mode: "light" | "dark" }) {
  const { config } = useRuntimeConfig();
  const metadataCatalogBaseUrl = config.metadataBaseUrl;

  const { data = [], isLoading, isError } = useMetadatas();
  const { data: managementPlans = [] } = useManagementPlans();
  const createMutation = useCreateMetadata();
  const updateMutation = useUpdateMetadata();
  const deleteMutation = useDeleteMetadata();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<Metadata | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<Metadata | null>(null);
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
    },
    {
      field: "namn",
      headerName: "Namn",
      minWidth: 180,
      flex: 1,
      renderCell: (params: GridRenderCellParams<Metadata>) => {
        const value = String(params.value ?? "").trim();
        if (!value) {
          return "-";
        }

        const href = buildSchemaNamnUrl(
          metadataCatalogBaseUrl,
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
    {
      field: "titel",
      headerName: "Titel",
      minWidth: 150,
      flex: 1,
      valueGetter: (_value, row) => {
        const key = String(row.arendeNummerOpenE ?? "").trim();
        return key ? (titelByArendeNummer.get(key) ?? "-") : "-";
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
      headerName: "Konfidentialitet",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "sakerhetsklassRiktighet",
      headerName: "Riktighet",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "sakerhetsklassTillganglighet",
      headerName: "Tillgänglighet",
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
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.9,
      renderCell: (params: GridRenderCellParams<Metadata>) => {
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
      field: "metaDataVersion",
      headerName: "Metadata version",
      minWidth: 150,
      flex: 0.9,
    },
    {
      field: "metadataSpecifikationModelversion",
      headerName: "Modellversion",
      minWidth: 150,
      flex: 0.9,
    },
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
            setOpenEdit(params.row as Metadata);
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
    <Container
      maxWidth="xl"
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="body2" fontWeight={600}>
          Här skapas och listas metadata automatiskt som kommer från e-tjänsten.
          Redigera eller ta bort objekt. <br /> Klicka på ärendenummer för att
          öppna geodatamängden i metadatakatalogen.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setOpenEdit(null);
            setOpenCreate(true);
          }}
          sx={{ height: 42 }}
        >
          Skapa metadata
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
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
            flex: 1,
            minHeight: 0,
            height: "100%",
            width: "100%",
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

      <MetadataFormDialog
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
              toast.success("Metadata skapad.");
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
            {deleteItem?.namn ? <> ({deleteItem.namn})</> : null}
            ?
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
