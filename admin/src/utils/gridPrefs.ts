import * as React from "react";
import type { GridColumnVisibilityModel, GridDensity } from "@mui/x-data-grid";

export type GridPrefs = {
  columnVisibilityModel: GridColumnVisibilityModel;
  density: GridDensity;
  pageSize: number;
};

function readPrefs(
  storageKey: string,
  defaults: GridPrefs
): GridPrefs {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<GridPrefs>;

    return {
      columnVisibilityModel:
        (parsed.columnVisibilityModel as GridColumnVisibilityModel) ??
        defaults.columnVisibilityModel,
      density: parsed.density ?? defaults.density,
      pageSize: parsed.pageSize ?? defaults.pageSize,
    };
  } catch {
    return defaults;
  }
}

export function useGridPrefs(
  storageKey: string,
  defaults: GridPrefs
) {
  const [prefs, setPrefs] = React.useState<GridPrefs>(() =>
    readPrefs(storageKey, defaults)
  );

  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(prefs));
    } catch {
      // ignore storage failures
    }
  }, [storageKey, prefs]);

  return {
    columnVisibilityModel: prefs.columnVisibilityModel,
    setColumnVisibilityModel: (next: GridColumnVisibilityModel) =>
      setPrefs((prev) => ({
        ...prev,
        columnVisibilityModel: next,
      })),

    density: prefs.density,
    setDensity: (density: GridDensity) =>
      setPrefs((prev) => ({ ...prev, density })),

    pageSize: prefs.pageSize,
    setPageSize: (pageSize: number) =>
      setPrefs((prev) => ({ ...prev, pageSize })),
  };
}

