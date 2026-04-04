import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import type { FuelEntry } from "@/lib/fuel-types";

interface Props {
  entries: FuelEntry[];
}

export default function ExportButton({ entries }: Props) {
  const handleExport = () => {
    const data = entries.map(e => ({
      "Sl.No.": e.slNo,
      "Date": e.date,
      "Site Name": e.siteName,
      "Fuel Type": e.fuelType,
      "Yesterday Fuel Purchased in Ltrs": e.purchased,
      "Indent Number": e.indentNumber || "",
      "Issued Through Indent Ltrs": e.issuedThroughIndentLtrs,
      "Issued Through Barrel Ltrs": e.issuedThroughBarrelLtrs,
      "Yesterday Total Fuel Issued in Ltrs": e.issued,
      "Balance Fuel in Ltrs": e.balance,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fuel Report");
    XLSX.writeFile(wb, "Fuel_Report.xlsx");
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={entries.length === 0}>
      <Download className="w-4 h-4 mr-2" /> Download Excel
    </Button>
  );
}
