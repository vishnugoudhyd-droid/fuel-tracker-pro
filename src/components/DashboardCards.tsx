import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Fuel, Droplets, FileText, Scale, Package, BookOpen } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_SITES, getStoredCustomSites, parseDateDDMMYYYY, formatDateDDMMYYYY, type FuelEntry } from "@/lib/fuel-types";

interface Props {
  entries: FuelEntry[];
}

export default function DashboardCards({ entries }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dashboardSite, setDashboardSite] = useState("ALL SITES");

  const allSites = useMemo(() => {
    const custom = getStoredCustomSites();
    const used = Array.from(new Set(entries.map(e => e.siteName)));
    return Array.from(new Set([...DEFAULT_SITES, ...custom, ...used]));
  }, [entries]);

  const filtered = useMemo(() => {
    let result = entries;
    if (selectedDate) {
      const dateStr = formatDateDDMMYYYY(selectedDate);
      result = result.filter(e => e.date === dateStr);
    }
    if (dashboardSite !== "ALL SITES") {
      result = result.filter(e => e.siteName === dashboardSite);
    }
    return result;
  }, [entries, selectedDate, dashboardSite]);

  const petrol = filtered.filter(e => e.fuelType === "PETROL");
  const diesel = filtered.filter(e => e.fuelType === "DIESEL");

  const cards = [
    { label: "PETROL PURCHASED", value: petrol.reduce((s, e) => s + e.purchased, 0), icon: Fuel, colorClass: "bg-fuel-petrol text-fuel-petrol-foreground", unit: "Ltrs" },
    { label: "DIESEL PURCHASED", value: diesel.reduce((s, e) => s + e.purchased, 0), icon: Droplets, colorClass: "bg-fuel-diesel text-fuel-diesel-foreground", unit: "Ltrs" },
    { label: "PETROL ISSUED", value: petrol.reduce((s, e) => s + e.issued, 0), icon: Fuel, colorClass: "bg-fuel-petrol text-fuel-petrol-foreground", unit: "Ltrs" },
    { label: "DIESEL ISSUED", value: diesel.reduce((s, e) => s + e.issued, 0), icon: Droplets, colorClass: "bg-fuel-diesel text-fuel-diesel-foreground", unit: "Ltrs" },
    { label: "PETROL BALANCE", value: petrol.reduce((s, e) => s + e.balance, 0), icon: Scale, colorClass: "bg-fuel-petrol text-fuel-petrol-foreground", unit: "Ltrs" },
    { label: "DIESEL BALANCE", value: diesel.reduce((s, e) => s + e.balance, 0), icon: Scale, colorClass: "bg-fuel-diesel text-fuel-diesel-foreground", unit: "Ltrs" },
    { label: "PETROL VIA INDENT", value: petrol.filter(e => e.issuedThrough === "INDENT").reduce((s, e) => s + e.issuedThroughLtrs, 0), icon: BookOpen, colorClass: "bg-fuel-petrol text-fuel-petrol-foreground", unit: "Ltrs" },
    { label: "PETROL VIA BARREL", value: petrol.filter(e => e.issuedThrough === "BARREL").reduce((s, e) => s + e.issuedThroughLtrs, 0), icon: Package, colorClass: "bg-fuel-petrol text-fuel-petrol-foreground", unit: "Ltrs" },
    { label: "DIESEL VIA INDENT", value: diesel.filter(e => e.issuedThrough === "INDENT").reduce((s, e) => s + e.issuedThroughLtrs, 0), icon: BookOpen, colorClass: "bg-fuel-diesel text-fuel-diesel-foreground", unit: "Ltrs" },
    { label: "DIESEL VIA BARREL", value: diesel.filter(e => e.issuedThrough === "BARREL").reduce((s, e) => s + e.issuedThroughLtrs, 0), icon: Package, colorClass: "bg-fuel-diesel text-fuel-diesel-foreground", unit: "Ltrs" },
    { label: "TOTAL ENTRIES", value: filtered.length, icon: FileText, colorClass: "bg-primary text-primary-foreground", unit: "" },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? formatDateDDMMYYYY(selectedDate) : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
        {selectedDate && (
          <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)}>Clear date</Button>
        )}

        <Select value={dashboardSite} onValueChange={setDashboardSite}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL SITES">ALL SITES</SelectItem>
            {allSites.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-lg shadow-md overflow-hidden"
          >
            <div className={`${card.colorClass} p-4`}>
              <div className="flex items-center justify-between mb-2">
                <card.icon className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-2xl font-display font-bold">
                {card.value.toLocaleString("en-IN")}
                {card.unit && <span className="text-sm font-normal ml-1">{card.unit}</span>}
              </p>
              <p className="text-xs opacity-80 mt-1 font-medium tracking-wide">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
