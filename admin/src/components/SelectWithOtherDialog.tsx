import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Controller,
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
  type UseFormSetValue,
} from "react-hook-form";

export type SelectOptionDialogConfig<TFieldValues extends FieldValues> = {
  option: string;
  fieldName: FieldPath<TFieldValues>;
  dialogTitle: string;
  emptySummaryText?: string;
  formatSummary?: (value: unknown) => string;
  /** Used by the default text editor when `renderEditor` is omitted. */
  dialogFieldLabel?: string;
  renderEditor?: (props: {
    value: unknown;
    onChange: (value: unknown) => void;
  }) => React.ReactNode;
};

type SelectWithOtherDialogProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  label: string;
  name: FieldPath<TFieldValues>;
  options: readonly string[];
  emptyOptionLabel: string;
  optionDialogs: SelectOptionDialogConfig<TFieldValues>[];
};

function cloneDraftValue(value: unknown): unknown {
  if (Array.isArray(value)) return [...value];
  return value ?? "";
}

function defaultFormatSummary(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  return String(value ?? "").trim();
}

export function SelectWithOtherDialog<TFieldValues extends FieldValues>({
  control,
  setValue,
  label,
  name,
  options,
  emptyOptionLabel,
  optionDialogs,
}: SelectWithOtherDialogProps<TFieldValues>) {
  const selected = (useWatch({ control, name }) as string | undefined) ?? "";
  const activeConfig = optionDialogs.find((dialog) => dialog.option === selected);

  const dialogFieldValues = useWatch({
    control,
    name: optionDialogs.map((dialog) => dialog.fieldName),
  }) as unknown[];

  const valueByFieldName = React.useMemo(() => {
    const map = new Map<string, unknown>();
    optionDialogs.forEach((dialog, index) => {
      map.set(String(dialog.fieldName), dialogFieldValues?.[index]);
    });
    return map;
  }, [dialogFieldValues, optionDialogs]);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [activeOption, setActiveOption] = React.useState<string | null>(null);
  const [draftValue, setDraftValue] = React.useState<unknown>("");

  const openConfig =
    optionDialogs.find((dialog) => dialog.option === activeOption) ?? null;

  const openDialogForOption = (option: string, currentValue: unknown) => {
    setActiveOption(option);
    setDraftValue(cloneDraftValue(currentValue));
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setActiveOption(null);
  };

  const helperText = (() => {
    if (!activeConfig) return undefined;

    const rawValue = valueByFieldName.get(String(activeConfig.fieldName));
    const formatted =
      activeConfig.formatSummary?.(rawValue) ?? defaultFormatSummary(rawValue);
    const summary =
      formatted.trim() ||
      activeConfig.emptySummaryText ||
      "Ingen text angiven";

    return (
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "flex-start",
          gap: 0.25,
          mt: 0,
        }}
      >
        <IconButton
          type="button"
          size="small"
          aria-label="Redigera"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openDialogForOption(activeConfig.option, rawValue);
          }}
          sx={{ p: 0.125, mt: "-1px" }}
        >
          <TuneIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Box component="span" sx={{ pt: "1px", fontSize: "0.75rem" }}>
          {summary}
        </Box>
      </Box>
    );
  })();

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            select
            label={label}
            value={field.value ?? ""}
            helperText={helperText}
            slotProps={{
              inputLabel: { shrink: true },
              select: { displayEmpty: true },
              formHelperText: {
                sx: {
                  mx: 0.75,
                  mt: 0.5,
                  mb: 0,
                  minHeight: helperText ? 18 : 0,
                },
                component: "div",
              },
            }}
            onBlur={field.onBlur}
            inputRef={field.ref}
            name={field.name}
            onChange={(e) => {
              const next = String(e.target.value ?? "");
              field.onChange(next);
              const config = optionDialogs.find(
                (dialog) => dialog.option === next,
              );
              if (config) {
                openDialogForOption(
                  config.option,
                  valueByFieldName.get(String(config.fieldName)),
                );
              }
            }}
          >
            <MenuItem value="">
              <em>{emptyOptionLabel}</em>
            </MenuItem>
            {options.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Dialog
        open={dialogOpen && openConfig !== null}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        }}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
      >
        {openConfig ? (
          <>
            <DialogTitle>{openConfig.dialogTitle}</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              {openConfig.renderEditor ? (
                openConfig.renderEditor({
                  value: draftValue,
                  onChange: setDraftValue,
                })
              ) : (
                <TextField
                  sx={{ mt: 1 }}
                  autoFocus
                  fullWidth
                  label={openConfig.dialogFieldLabel ?? openConfig.dialogTitle}
                  value={String(draftValue ?? "")}
                  onChange={(e) => setDraftValue(e.target.value)}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button type="button" onClick={closeDialog}>
                Avbryt
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={() => {
                  setValue(
                    openConfig.fieldName,
                    draftValue as PathValue<
                      TFieldValues,
                      FieldPath<TFieldValues>
                    >,
                    { shouldDirty: true },
                  );
                  closeDialog();
                }}
              >
                Spara
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Box>
  );
}
