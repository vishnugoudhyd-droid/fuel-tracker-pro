import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { FuelEntry } from "@/lib/fuel-types";
import { motion } from "framer-motion";

interface Props {
  entries: FuelEntry[];
}

export default function FuelTable({ entries }: Props) {
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
              <TableHead className="font-display font-semibold text-right">PURCHASED</TableHead>
              <TableHead className="font-display font-semibold text-right">ISSUED</TableHead>
              <TableHead className="font-display font-semibold text-right">BALANCE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No entries yet. Add your first fuel entry above.
                  </TableCell>
                </TableRow>
              )}
              {entries.map((entry) => (
                <motion.tr
                  key={entry.slNo}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
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
                  <TableCell className="text-right">{entry.purchased.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">{entry.issued.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right font-semibold">{entry.balance.toLocaleString("en-IN")}</TableCell>
                </motion.tr>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
