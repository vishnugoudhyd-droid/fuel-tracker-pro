import { motion } from "framer-motion";
import { Fuel, Droplets, FileText } from "lucide-react";
import type { FuelEntry } from "@/lib/fuel-types";

interface Props {
  entries: FuelEntry[];
}

export default function DashboardCards({ entries }: Props) {
  const petrolEntries = entries.filter(e => e.fuelType === "PETROL");
  const dieselEntries = entries.filter(e => e.fuelType === "DIESEL");

  const cards = [
    {
      label: "PETROL PURCHASED",
      value: petrolEntries.reduce((s, e) => s + e.purchased, 0),
      icon: Fuel,
      colorClass: "bg-fuel-petrol text-fuel-petrol-foreground",
      unit: "Ltrs",
    },
    {
      label: "DIESEL PURCHASED",
      value: dieselEntries.reduce((s, e) => s + e.purchased, 0),
      icon: Droplets,
      colorClass: "bg-fuel-diesel text-fuel-diesel-foreground",
      unit: "Ltrs",
    },
    {
      label: "PETROL ISSUED",
      value: petrolEntries.reduce((s, e) => s + e.issued, 0),
      icon: Fuel,
      colorClass: "bg-fuel-petrol text-fuel-petrol-foreground",
      unit: "Ltrs",
    },
    {
      label: "DIESEL ISSUED",
      value: dieselEntries.reduce((s, e) => s + e.issued, 0),
      icon: Droplets,
      colorClass: "bg-fuel-diesel text-fuel-diesel-foreground",
      unit: "Ltrs",
    },
    {
      label: "TOTAL ENTRIES",
      value: entries.length,
      icon: FileText,
      colorClass: "bg-primary text-primary-foreground",
      unit: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
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
  );
}
