import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Check, X } from "lucide-react";
import { syncEditToSheet, type FuelEntry } from "@/lib/fuel-types";

interface Props {
  entries: FuelEntry[];
  onEdit: (updated: FuelEntry) => void;
}

export default function FuelTable({ entries, onEdit }: Props) {
  const { toast } = useToast();
  const [editingSlNo, setEditingSlNo] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<FuelEntry>>({});

  const startEdit = (entry: FuelEntry) => {
    setEditingSlNo(entry.slNo);
    setEditData({ ...entry });
  };

  const cancelEdit = () => {
    setEditingSlNo(null);
    setEditData({});
  };

  const saveEdit = async () => {
    const updated = { ...editData } as FuelEntry;
    updated.issued = (updated.issuedThroughIndentLtrs || 0) + (updated.issuedThroughBarrelLtrs || 0);
    updated.balance = updated.purchased - updated.issued;
    try {
      await syncEditToSheet(updated);
      onEdit(updated);
      toast({ title: "Entry updated & synced!" });
    } catch {
      onEdit(updated);
      toast({ title: "Updated locally (Sheet sync failed)", variant: "destructive" });
    }
    setEditingSlNo(null);
    setEditData({});
  };

  const setField = (key: keyof FuelEntry, val: any) => {
    setEditData(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-display font-semibold">SL.NO.</TableHead>
              <TableHead className="font-display font-semibold">DATE</TableHead>
              <TableHead className="font-display font-semibold">SITE NAME</TableHead>
              <TableHead className="font-display font-semibold">FUEL TYPE</TableHead>
              <TableHead className="font-display font-semibold text-right">FUEL PURCHASED (LTRS)</TableHead>
              <TableHead className="font-display font-semibold">INDENT NO.</TableHead>
              <TableHead className="font-display font-semibold text-right">FUEL ISSUED THROUGH INDENT (LTRS)</TableHead>
              <TableHead className="font-display font-semibold text-right">FUEL ISSUED THROUGH BARREL (LTRS)</TableHead>
              <TableHead className="font-display font-semibold text-right">TOTAL FUEL ISSUED (LTRS)</TableHead>
              <TableHead className="font-display font-semibold text-right">BALANCE FUEL (LTRS)</TableHead>
              <TableHead className="font-display font-semibold text-center">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                  No entries yet. Add your first fuel entry above.
                </TableCell>
              </TableRow>
            )}
            {entries.map((entry) => {
              const isEditing = editingSlNo === entry.slNo;
              const d = isEditing ? editData : entry;

              return (
                <TableRow key={entry.slNo} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{entry.slNo}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell className="font-medium">{entry.siteName}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      entry.fuelType === "PETROL"
                        ? "bg-fuel-petrol text-fuel-petrol-foreground"
                        : "bg-fuel-diesel text-fuel-diesel-foreground"
                    }`}>
                      {entry.fuelType}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input type="number" className="w-24 ml-auto" value={d.purchased} onChange={e => setField("purchased", Number(e.target.value))} />
                    ) : entry.purchased.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <Input className="w-24" value={d.indentNumber || ""} onChange={e => setField("indentNumber", e.target.value.toUpperCase())} />
                    ) : (entry.indentNumber || "—")}
                  </TableCell>

                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input type="number" className="w-24 ml-auto" value={d.issuedThroughIndentLtrs} onChange={e => setField("issuedThroughIndentLtrs", Number(e.target.value))} />
                    ) : (entry.issuedThroughIndentLtrs ?? 0).toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input type="number" className="w-24 ml-auto" value={d.issuedThroughBarrelLtrs} onChange={e => setField("issuedThroughBarrelLtrs", Number(e.target.value))} />
                    ) : (entry.issuedThroughBarrelLtrs ?? 0).toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell className="text-right">
                    {isEditing ? (
                      <span>{((Number(d.issuedThroughIndentLtrs) || 0) + (Number(d.issuedThroughBarrelLtrs) || 0)).toLocaleString("en-IN")}</span>
                    ) : entry.issued.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    {isEditing ? (
                      <span>{(Number(d.purchased) - ((Number(d.issuedThroughIndentLtrs) || 0) + (Number(d.issuedThroughBarrelLtrs) || 0))).toLocaleString("en-IN")}</span>
                    ) : entry.balance.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell className="text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <Button size="icon" variant="ghost" onClick={saveEdit}><Check className="w-4 h-4 text-fuel-petrol" /></Button>
                        <Button size="icon" variant="ghost" onClick={cancelEdit}><X className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    ) : (
                      <Button size="icon" variant="ghost" onClick={() => startEdit(entry)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
