import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const cargoArrivals = {
  EETL: [
    new Date(2024, 2, 5),
    new Date(2024, 2, 15),
    new Date(2024, 2, 25),
  ],
  PGPCL: [
    new Date(2024, 2, 10),
    new Date(2024, 2, 20),
    new Date(2024, 2, 30),
  ],
};

export function CargoCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card className="bg-dashboard-navy border-0">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Cargo Arrivals Calendar</h2>
        <div className="flex flex-col space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="border-0 text-sm p-2"
            modifiers={{
              eetl: cargoArrivals.EETL,
              pgpcl: cargoArrivals.PGPCL,
            }}
            modifiersStyles={{
              eetl: {
                backgroundColor: "#0EA5E9",
                color: "white",
              },
              pgpcl: {
                backgroundColor: "#4ADE80",
                color: "white",
              },
            }}
          />
          <div className="flex justify-center gap-4 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-dashboard-blue"></div>
              <span className="text-sm">EETL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-dashboard-green"></div>
              <span className="text-sm">PGPCL</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
