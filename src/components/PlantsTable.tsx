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
      <h2 className="text-lg font-semibold mb-4">Plant Information</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plant Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Capacity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plants.map((plant) => (
            <TableRow key={plant.name}>
              <TableCell>{plant.name}</TableCell>
              <TableCell>{plant.location}</TableCell>
              <TableCell>{plant.capacity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}