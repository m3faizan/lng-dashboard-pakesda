import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const plants = [
  {
    name: "Plant A",
    location: "Karachi",
    capacity: "1200 MW",
  },
  {
    name: "Plant B",
    location: "Lahore",
    capacity: "800 MW",
  },
  {
    name: "Plant C",
    location: "Islamabad",
    capacity: "600 MW",
  },
];

export function PlantsTable() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-center">Plant Information</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Plant Name</TableHead>
            <TableHead className="text-center">Location</TableHead>
            <TableHead className="text-center">Capacity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plants.map((plant) => (
            <TableRow key={plant.name}>
              <TableCell className="text-center">{plant.name}</TableCell>
              <TableCell className="text-center">{plant.location}</TableCell>
              <TableCell className="text-center">{plant.capacity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}