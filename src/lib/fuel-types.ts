export interface FuelEntry {
  slNo: number;
  date: string;
  siteName: string;
  fuelType: "PETROL" | "DIESEL";
  purchased: number;
  issued: number;
  balance: number;
}

export const DEFAULT_SITES = [
  "BHOSGA", "ALAND", "ANNIGERI", "HEXA", "RONA",
  "AYANA", "GUNNAL", "VIVID", "MANAGOLI",
  "TATA ELECTRICAL (MUDHOL)"
] as const;

export const FUEL_TYPES = ["PETROL", "DIESEL"] as const;

export function formatDateDDMMYYYY(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

export function getYesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
}

export function getStoredCustomSites(): string[] {
  try {
    return JSON.parse(localStorage.getItem("customSites") || "[]");
  } catch { return []; }
}

export function saveCustomSites(sites: string[]) {
  localStorage.setItem("customSites", JSON.stringify(sites));
}

export function getStoredEntries(): FuelEntry[] {
  try {
    return JSON.parse(localStorage.getItem("fuelEntries") || "[]");
  } catch { return []; }
}

export function saveEntries(entries: FuelEntry[]) {
  localStorage.setItem("fuelEntries", JSON.stringify(entries));
}
