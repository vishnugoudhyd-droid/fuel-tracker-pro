import { useState, useMemo } from "react";
import { Fuel } from "lucide-react";
import DashboardCards from "@/components/DashboardCards";
import FuelEntryForm from "@/components/FuelEntryForm";
import FuelTable from "@/components/FuelTable";
import SiteFilter from "@/components/SiteFilter";
import ExportButton from "@/components/ExportButton";
import { getStoredEntries, saveEntries, type FuelEntry } from "@/lib/fuel-types";

export default function Index() {
  const [entries, setEntries] = useState<FuelEntry[]>(getStoredEntries());
  const [siteFilter, setSiteFilter] = useState("ALL SITES");

  const handleNewEntry = (entry: FuelEntry) => {
    const updated = [...entries, entry];
    setEntries(updated);
    saveEntries(updated);
  };

  const filtered = useMemo(
    () => siteFilter === "ALL SITES" ? entries : entries.filter(e => e.siteName === siteFilter),
    [entries, siteFilter]
  );

  const usedSites = useMemo(() => Array.from(new Set(entries.map(e => e.siteName))), [entries]);
  const nextSlNo = entries.length > 0 ? Math.max(...entries.map(e => e.slNo)) + 1 : 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-primary rounded-lg p-2">
            <Fuel className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
            Fuel Management System
          </h1>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Dashboard */}
        <DashboardCards entries={filtered} />

        {/* Form */}
        <FuelEntryForm onSubmit={handleNewEntry} nextSlNo={nextSlNo} />

        {/* Filter + Export */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <SiteFilter value={siteFilter} onChange={setSiteFilter} usedSites={usedSites} />
          <ExportButton entries={filtered} />
        </div>

        {/* Table */}
        <FuelTable entries={filtered} />
      </main>
    </div>
  );
}
