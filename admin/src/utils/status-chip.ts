import type { ChipProps } from "@mui/material/Chip";

function normalizeStatus(v: unknown): string {
  return String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function statusChipColor(
  status: unknown
): Exclude<ChipProps["color"], undefined> {
  const v = normalizeStatus(status);
  if (!v) return "default";

  if (v === "granskas") return "warning";
  if (v === "godkand" || v === "godkänd") return "success";
  if (v === "nekad") return "error";
  if (v === "klar") return "success";

  return "default";
}

