export interface FuelEntry {
  slNo: number;
  date: string;
  siteName: string;
  fuelType: "PETROL" | "DIESEL";
  purchased: number;
  purchaseMode: "INDENT" | "BARREL";
  indentNumber?: string;
  issuedThrough: "INDENT" | "BARREL";
  issuedThroughLtrs: number;
  issued: number;
  balance: number;
}

export const DEFAULT_SITES = [
  "BHOSGA", "ALAND", "ANNIGERI", "HEXA", "RONA",
  "AYANA", "GUNNAL", "VIVID", "MANAGOLI",
  "TATA ELECTRICAL (MUDHOL)"
] as const;

export const FUEL_TYPES = ["PETROL", "DIESEL"] as const;
export const MODES = ["INDENT", "BARREL"] as const;

export function formatDateDDMMYYYY(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

export function parseDateDDMMYYYY(str: string): Date | null {
  const parts = str.split("-");
  if (parts.length !== 3) return null;
  const d = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const y = parseInt(parts[2], 10);
  const date = new Date(y, m, d);
  if (isNaN(date.getTime())) return null;
  return date;
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
    const raw = JSON.parse(localStorage.getItem("fuelEntries") || "[]");
    // Migrate old entries without new fields
    return raw.map((e: any) => ({
      ...e,
      purchaseMode: e.purchaseMode || "BARREL",
      indentNumber: e.indentNumber || "",
      issuedThrough: e.issuedThrough || "BARREL",
      issuedThroughLtrs: e.issuedThroughLtrs ?? e.issued ?? 0,
    }));
  } catch { return []; }
}

export function saveEntries(entries: FuelEntry[]) {
  localStorage.setItem("fuelEntries", JSON.stringify(entries));
}

const SHEET_URL = "https://script.google.com/macros/s/AKfycbzZed7TqC5VIPIRlBkWXh8nSSifvlivizlL-Yh3VzuI2rcOiORpkY5ueVr_sJ-SYXfK/exec";

export async function syncEntryToSheet(entry: FuelEntry) {
  return fetch(SHEET_URL, {
    method: "POST",
    body: JSON.stringify({
      slno: entry.slNo,
      date: entry.date,
      site: entry.siteName,
      fuelType: entry.fuelType,
      purchased: entry.purchased,
      purchaseMode: entry.purchaseMode,
      indentNumber: entry.indentNumber || "",
      issuedThrough: entry.issuedThrough,
      issuedThroughLtrs: entry.issuedThroughLtrs,
      issued: entry.issued,
      balance: entry.balance,
      action: "add",
    }),
  });
}

export async function syncEditToSheet(entry: FuelEntry) {
  return fetch(SHEET_URL, {
    method: "POST",
    body: JSON.stringify({
      slno: entry.slNo,
      date: entry.date,
      site: entry.siteName,
      fuelType: entry.fuelType,
      purchased: entry.purchased,
      purchaseMode: entry.purchaseMode,
      indentNumber: entry.indentNumber || "",
      issuedThrough: entry.issuedThrough,
      issuedThroughLtrs: entry.issuedThroughLtrs,
      issued: entry.issued,
      balance: entry.balance,
      action: "edit",
    }),
  });
}
