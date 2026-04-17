import * as React from "react";

export type RuntimeConfig = {
  metadataBaseUrl?: string;
  managementPlanBaseUrl?: string;
  metadataPortal?: string;
  orderSummaryList?: string;
};

let cachedConfig: RuntimeConfig | null = null;
let cachedPromise: Promise<RuntimeConfig> | null = null;

async function fetchRuntimeConfig(): Promise<RuntimeConfig> {
  if (cachedConfig) return cachedConfig;
  if (cachedPromise) return cachedPromise;

  cachedPromise = (async () => {
    try {
      const url = `${import.meta.env.BASE_URL}config.json`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        cachedConfig = {};
        return cachedConfig;
      }
      const json = (await res.json()) as RuntimeConfig;
      cachedConfig = json ?? {};
      return cachedConfig;
    } catch {
      cachedConfig = {};
      return cachedConfig;
    } finally {
      cachedPromise = null;
    }
  })();

  return cachedPromise;
}

export function useRuntimeConfig() {
  const [config, setConfig] = React.useState<RuntimeConfig>({});
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    fetchRuntimeConfig().then((c) => {
      if (!alive) return;
      setConfig(c);
      setIsLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { config, isLoaded };
}

export function buildArendeUrl(baseUrl: string | undefined, arende: string) {
  const base = String(baseUrl ?? "").trim();
  if (!base) return "";
  const cleaned = base.replace(/\/+$/, "");
  return `${cleaned}/${encodeURIComponent(arende)}`;
}

