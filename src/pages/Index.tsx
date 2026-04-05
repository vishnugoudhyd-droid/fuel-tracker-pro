import { useState, useMemo, useEffect } from "react";
import logo from "@/assets/logo.png";
import DashboardCards from "@/components/DashboardCards";
import FuelEntryForm from "@/components/FuelEntryForm";
import FuelTable from "@/components/FuelTable";
import SiteFilter from "@/components/SiteFilter";
import ExportButton from "@/components/ExportButton";
import { getStoredEntries, saveEntries, fetchEntriesFromSheet, type FuelEntry } from "@/lib/fuel-types";

export default function Index() {
  const [entries, setEntries] = useState<FuelEntry[]>(getStoredEntries());
  const [siteFilter, setSiteFilter] = useState("ALL SITES");

  // Sync from Google Sheet on load (reflects deletions made in the sheet)
  useEffect(() => {
    fetchEntriesFromSheet().then((sheetEntries) => {
      if (sheetEntries.length > 0) {
        setEntries(sheetEntries);
        saveEntries(sheetEntries);
      }
    });
  }, []);

  const handleNewEntry = (entry: FuelEntry) => {
    const updated = [...entries, entry];
    setEntries(updated);
    saveEntries(updated);
  };

  const handleEdit = (updated: FuelEntry) => {
    const newEntries = entries.map(e => e.slNo === updated.slNo ? updated : e);
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const filtered = useMemo(
    () => siteFilter === "ALL SITES" ? entries : entries.filter(e => e.siteName === siteFilter),
    [entries, siteFilter]
  );

  const usedSites = useMemo(() => Array.from(new Set(entries.map(e => e.siteName))), [entries]);
  const nextSlNo = entries.length > 0 ? Math.max(...entries.map(e => e.slNo)) + 1 : 1;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <img src={logo} alt="SKPPL Logo" className="h-12 w-auto" />
          <div>
            <h1 className="text-lg md:text-xl font-display font-bold text-foreground leading-tight">
              SRI KEERTHI PROJECTS PVT. LTD.
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium tracking-wide">
              FUEL CONSUMPTION MANAGEMENT SYSTEM
            </p>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        <DashboardCards entries={entries} />
        <FuelEntryForm onSubmit={handleNewEntry} nextSlNo={nextSlNo} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <SiteFilter value={siteFilter} onChange={setSiteFilter} usedSites={usedSites} />
          <ExportButton entries={filtered} />
        </div>

        <FuelTable entries={filtered} onEdit={handleEdit} />
      </main>
    </div>
  );
}
